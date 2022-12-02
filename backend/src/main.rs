use tokio;
use warp;
use warp::{Filter};

#[tokio::main]
async fn main () {
    let index = warp::path::end()
        .and(warp::fs::file("static/index.html"));
    let statics = warp::path("static")
        .and(warp::fs::dir("static"));
    let api = warp::path("api").and(
        warp::path("dictionaries")
            .and(warp::fs::file("data.json"))
    );
    let routes = index
        .or(statics)
        .or(api);
    warp::serve(routes).run(([127,0,0,1],8080)).await;
}
