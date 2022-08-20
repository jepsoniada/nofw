use std::net::{TcpListener, TcpStream};
use std::io::{Read, Write};
use std::env;
use std::fs;
use std::cell::{RefCell};
use regex::Regex;
use std::thread;

thread_local! {
    static project_root: String = fs::canonicalize(
        env::var("PROJECT_ROOT").unwrap()
    ).unwrap().to_str().unwrap().to_string()
}

fn main() {
    let serve = TcpListener::bind("127.0.0.1:8080").unwrap();
    let serve_thread = thread::spawn(move || {
        for stream in serve.incoming() {
            handle_req(stream.unwrap());
        }
    });
    serve_thread.join().unwrap();
}

fn handle_req (mut stream: TcpStream) {
    let mut value = [0; 2048];
    stream
        .read(&mut value).unwrap();
    let value =
        String::from_utf8_lossy(&value[..])
        .into_owned();
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
    project_root.with(|a| {
        println!("project root: {}", a);
    });
    println!("accessed path {}", path);
    match path {
        "/" => {
            stream.write(b"HTTP/1.1 200 OK\n\n").unwrap();
            stream.write(
                std::fs::read_to_string("linkFiles/index.html")
                    .unwrap()
                    .as_bytes()
            ).unwrap();
        },
//         e if statics.contains(&(e.strip_prefix("/").unwrap()).to_string()) => {
//             stream.write(b"HTTP/1.1 200 OK\n\n").unwrap();
//             stream.write(
//                 std::fs::read_to_string(
//                     format!("linkFiles/{}", e)
//                 )
//                     .unwrap()
//                     .as_bytes()
//             ).unwrap();
//         },
        _ => {
            stream
                .write(b"HTTP/1.1 404 NOT FOUND\n\n")
                .unwrap();
        },
    }
    stream.flush().unwrap();
}
