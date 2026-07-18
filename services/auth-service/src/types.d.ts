import "@connectrpc/connect";

declare module "@connectrpc/connect" {
  interface HandlerContext {
    user?: {
      id: string;
      role: string;
    };
  }
}