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

fn main() {
	// env_logger::init().unwrap();
    let format = Format::new("{method} {uri} -> {status} ({response-time} ms)", vec![], vec![]);
    let (logger_before, logger_after) = Logger::new(Some(format.unwrap()));

	fn hello_world(_: &mut Request) -> IronResult<Response> {
		Ok(Response::with((status::Ok, "Hello Woarld!")))
	}

 	let mut router = Router::new();
    router.get("/hello", hello_world);

	let mut mount = Mount::new();
    mount.mount("/api", router);
	mount.mount("/", Static::new(Path::new("target/")));
	mount.mount("/public", Static::new(Path::new("public/")));

	let mut chain = Chain::new(mount);
    // chain.link_before(sessions_controller);

    chain = Chain::new(chain);
    // chain.around(login_manager);
    chain.link_before(logger_before);
    chain.link_after(logger_after);

    Iron::new(chain).http("0.0.0.0:8080").unwrap();

	// Iron::new(hello_world).http("localhost:3000").unwrap();
	println!("On 8080");
}
