import { Server } from "./src/main.ts";

const server = new Server({
  hostname: "localhost",
  port: 1447,
});

server.get("/api/user", (req) => {
  req.respond({ status: 200, body: "gamer triggered" });
});
server.get("/gamer/:id/:user", (req) => {
  req.respond({ status: 200, body: "gamer triggered" });
});

await server.start();
