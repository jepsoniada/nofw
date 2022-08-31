use std::path::{Path};
use std::error::{Error};
use std::fmt::{Formatter, Display, Error as FmtError};
use std::ffi::{OsStr};

use mime_db::{lookup};

#[derive(Debug)]
struct ResolveError;
impl Display for ResolveError {
	fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), FmtError> {
		write!(f, "resolve error occured")
	}
}
impl Error for ResolveError {}

pub fn mime_resolve<P: AsRef<std::ffi::OsStr> + ?Sized>(file: &P) -> Result<String, &dyn Error> {
	let file = Path::new(file);
	let extension = match file.extension() {
		Some(x) => x,
		None => return Err(&ResolveError)
	};
	let extension = match extension.to_str() {
		Some(x) => x,
		None => return Err(&ResolveError)
	};
	match lookup(extension) {
		Some(x) => Ok(x.to_owned()),
		None => Err(&ResolveError)
	}
}
