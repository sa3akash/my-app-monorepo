import { connectNodeAdapter } from "@connectrpc/connect-node";
import { AuthService } from "@repo/protos/gen/ts/auth/v1/auth_pb";

import { authHandler } from "./handlers/auth.handler";

const AUTH_PORT = process.env.PORT || 6001;

async function main() {
  // Instantiate the ConnectRPC router adapter
  const adapter = connectNodeAdapter({
    interceptors: [],
    routes: (router) => {
      router.service(AuthService, authHandler);
    },
  });

  Bun.serve({
    port: AUTH_PORT,
    routes: adapter,
    fetch(req) {
      const url = new URL(req.url);
      // Health checks or fallback pathways
      if (url.pathname === "/health") {
        return new Response(JSON.stringify({ status: "UP" }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response("Not Found", { status: 404 });
    },
  });

  // const server = http.createServer((req, res) => {
  //   return adapter(req, res);
  // });

  // server.listen(AUTH_PORT, () => {
  //   console.log(`Server running on port ${AUTH_PORT}`);
  // });
}

void main();
