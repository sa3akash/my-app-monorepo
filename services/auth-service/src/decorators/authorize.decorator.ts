import type { Message } from "@bufbuild/protobuf";
import { ConnectError, Code, type HandlerContext } from "@connectrpc/connect";

export function Authorize(...allowedRoles: string[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (req: Message<any>, ctx: HandlerContext) {
      // 1. Get Authentication token from standard gRPC context headers
      const authHeader = ctx.requestHeader.get("authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ConnectError(
          "Unauthenticated: Missing or malformed token",
          Code.Unauthenticated,
        );
      }

      const token = authHeader.split(" ")[1] || "";

      try {
        // Mock extraction (In production, replace with your JWT verification library jwt.verify())
        // Assuming Gateway forwarded parsed headers or user payload encrypted
        const user = JSON.parse(Buffer.from(token, "base64").toString()) as {
          id: string;
          role: string;
        };

        if (!allowedRoles.includes(user.role)) {
          throw new ConnectError(
            `Permission Denied: Requires roles [${allowedRoles.join(", ")}]`,
            Code.PermissionDenied,
          );
        }

        // Attach user identities to the request lifecycle object dynamically if needed
        (ctx as any).user = user;

        return await originalMethod.apply(this, [req, ctx]);
      } catch (error: any) {
        if (error instanceof ConnectError) throw error;
        throw new ConnectError(
          "Authentication validation pipeline broken",
          Code.Unauthenticated,
        );
      }
    };

    return descriptor;
  };
}
