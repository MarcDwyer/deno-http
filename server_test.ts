import { Server } from "./src/mod.ts";

// deno run --allow-net server_test.ts
const server = new Server({
  hostname: "localhost",
  port: 1447,
});
server.use("/api/user", ({ req }) => {
  req.respond({ status: 200, body: "Nice api hit" });
});
server.use("/gamer/:id/:user", ({ req, params }) => {
  req.respond({ status: 200, body: JSON.stringify(params) });
});

await server.start();
