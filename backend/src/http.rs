pub struct Header<'a> {
    name: &'a str,
    value: &'a str,
}
impl<'a> Header<'a> {
    pub fn new (name: &'a str, value: &'a str) -> Header<'a> {
        Header { name: name, value: value }
    }
}

pub const CODES: [(u16, &str); 2] = [
    (200, "OK"),
    (404, "Not Found"),
];

pub fn response_builder(
    response_code: &(u16, &str),
    headers: Vec<Header>,
    body: String,
) -> String {
    let metadata = format!("HTTP/1.1 {} {}",
        response_code.0,
        response_code.1,
    );
    let headers = headers.iter().map(|a|
        format!("{}: {}\n", a.name, a.value)
    ).collect::<String>();
    format!(
        "\
{metadata}
{headers}
{}
        ",
        body.trim()
    )
}
