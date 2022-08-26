use std::{fs, env, thread};
use std::net::{TcpListener, TcpStream};
use std::io::{Read, Write};
use std::cell::{RefCell};
use regex::Regex;
use std::path::{Path, PathBuf};

thread_local! {
    static PROJECT_ROOT: RefCell<String> = RefCell::new(
		fs::canonicalize(
			env::var("PROJECT_ROOT").unwrap()
		).unwrap().to_str().unwrap().to_string()
	)
}

fn dir_traverse<P: AsRef<Path>>(name: P) -> Vec<PathBuf> {
	let dir_entries = fs::read_dir(name).unwrap()
		.map(|a| a.unwrap());
	let mut result: Vec<PathBuf> = Vec::new();
	for entry in dir_entries {
		if fs::canonicalize(entry.path()).unwrap().as_path().is_dir() {
			result.append(&mut dir_traverse(entry.path()));
		} else {
			result.push(entry.path());
		}
	}
	result
}

fn handle_req (mut stream: TcpStream) {
    let mut value = [0; 2048];
    stream.read(&mut value).unwrap();
	let value = String::from_utf8_lossy(&value)
		.into_owned();
	let value = value
		.lines()
		.nth(0).unwrap();
    let path = Regex::new(r"^GET (?P<path>[^\s]*) HTTP/1.1$").unwrap()
        .captures(&value).unwrap()
        .name("path").unwrap()
        .as_str();
	let statics: Vec<String> = dir_traverse("linkFiles").iter()
		.map(|a| a
			.clone().into_os_string().into_string().unwrap()
			.strip_prefix("linkFiles/").unwrap()
			.to_string()
		)
		.collect();
	println!("statics {:?}", statics);
    println!("accessed path {}", path);
    match path {
        "/" => {
            stream.write(b"HTTP/1.1 200 OK\n\n").unwrap();
            stream.write(
                fs::read_to_string(
					fs::canonicalize(
						Path::new(PROJECT_ROOT.with(|a| a.borrow().clone()).as_str())
							.join("linkFiles/index.html")
					).unwrap()
				)
                    .unwrap()
                    .as_bytes()
            ).unwrap();
        },
        e if statics.contains(&(e.strip_prefix("/").unwrap()).to_string()) => {
            stream.write(b"HTTP/1.1 200 OK\nContent-Type: text/javascript\n\n").unwrap();
            stream.write(
                fs::read_to_string(
					fs::canonicalize(
						Path::new(PROJECT_ROOT.with(|a| a.borrow().clone()).as_str())
							.join(format!("linkFiles/{}", e))
					).unwrap()
                )
                    .unwrap()
                    .as_bytes()
            ).unwrap();
        },
        _ => {
            stream
                .write(b"HTTP/1.1 404 NOT FOUND\n\n")
                .unwrap();
        },
    }
    stream.flush().unwrap();
}

fn main() {
	let listener = TcpListener::bind("127.0.0.1:8080").unwrap();
	for stream in listener.incoming() {
		thread::spawn(|| handle_req(stream.unwrap()));
	}
}
