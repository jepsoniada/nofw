use std::net::{TcpListener, TcpStream};
use std::io::{Read, Write};
use std::env;
use std::fs;
use std::cell::{RefCell};
use regex::Regex;
use std::thread;

thread_local! {
    static project_root: RefCell<String> = RefCell::new(
		fs::canonicalize(
			env::var("PROJECT_ROOT").unwrap()
		).unwrap().to_str().unwrap().to_string()
	)
}

fn main() {
	let listener = TcpListener::bind("127.0.0.1:8080").unwrap();
	for stream in listener.incoming() {
		thread::spawn(|| handle_req(stream.unwrap()));
	}
}

fn handle_req (mut stream: TcpStream) {
    let mut value = [0; 2048];
    stream
        .read(&mut value).unwrap();
    let value =
        String::from_utf8_lossy(&value[..])
        .into_owned();
	println!("{}", &value);
    let value: Vec<&str> = value
        .lines()
        .collect();
    let path_regex =
        Regex::new(r"^GET (?P<path>[^\s]*) HTTP/1.1$")
        .unwrap();
    let path = path_regex
        .captures(value[0])
        .unwrap()
        .name("path")
        .unwrap()
        .as_str();
    let statics: Vec<String> = fs::read_dir("linkFiles").unwrap()
        .map(|e| e.unwrap()
             .path()
             .file_name().unwrap()
             .to_str().unwrap()
             .to_string()
         )
        .collect();
    println!("accessed path {}", path);
    match path {
        "/" => {
            stream.write(b"HTTP/1.1 200 OK\n\n").unwrap();
            stream.write(
                std::fs::read_to_string(
					fs::canonicalize(
						std::path::Path::new(project_root.with(|a| a.borrow().clone()).as_str())
							.join("linkFiles/index.html")
					).unwrap()
				)
                    .unwrap()
                    .as_bytes()
            ).unwrap();
        },
        e if statics.contains(&(e.strip_prefix("/").unwrap()).to_string()) => {
            stream.write(b"HTTP/1.1 200 OK\n\n").unwrap();
            stream.write(
                std::fs::read_to_string(
					fs::canonicalize(
						std::path::Path::new(project_root.with(|a| a.borrow().clone()).as_str())
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
