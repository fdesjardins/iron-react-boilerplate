extern crate iron;
extern crate logger;
extern crate router;
extern crate mount;
extern crate staticfile;

use std::path::Path;

use iron::prelude::*;
use iron::status;
use logger::Logger;
use logger::format::Format;
use router::Router;
use mount::Mount;
use staticfile::Static;

fn hello_world(_: &mut Request) -> IronResult<Response> {
	Ok(Response::with((status::Ok, "Hello world!")))
}

fn main() {
    let format = Format::new("{method} {uri} -> {status} ({response-time} ms)", vec![], vec![]);
    let (logger_before, logger_after) = Logger::new(Some(format.unwrap()));

 	let mut router = Router::new();
    router.get("/hello", hello_world);

	let mut mount = Mount::new();
    mount.mount("/api", router);
	mount.mount("/", Static::new(Path::new("dist/public")));
	// mount.mount("/dist/public", Static::new(Path::new("dist/public")));

	let mut chain = Chain::new(mount);

    chain = Chain::new(chain);
    chain.link_before(logger_before);
    chain.link_after(logger_after);

	println!("Server running at 0.0.0.0:8080");
    Iron::new(chain).http("0.0.0.0:8080").unwrap();
}
