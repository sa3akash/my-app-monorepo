import { Code, ConnectError, HandlerContext } from "@connectrpc/connect";

export function authentication(...allowedRoles: string[]) {
  return <Req, Res>(
    handler: (req: Req, ctx: HandlerContext) => Promise<Res>,
  ) => {
    return async (request: Req, context: HandlerContext): Promise<Res> => {
      // 1. Authenticate: Check if user exists (set by your upstream middleware/interceptor)
      if (!context.user) {
        throw new ConnectError("Unauthenticated", Code.Unauthenticated);
      }

      // 2. Authorize: Check if they have the right role
      if (allowedRoles.length > 0 && !allowedRoles.includes(context?.user?.role)) {
        throw new ConnectError("Permission denied", Code.PermissionDenied);
      }

      // 3. Proceed to the actual handler logic
      return handler(request, context);
    };
  };
}
