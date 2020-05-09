import { Server } from "./src/main.ts";

const server = new Server({
  hostname: "localhost",
  port: 1447,
});

server.get("/api/user", ({ req, params }) => {
  console.log(params);
  req.respond({ status: 200, body: "api user triggered" });
});
server.get("/gamer/:id/:user", ({ req, params }) => {
  console.log(params);
  req.respond({ status: 200, body: "gamer was triggered" });
});

await server.start();
