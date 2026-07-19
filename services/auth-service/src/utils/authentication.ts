import { ConnectError, Code, HandlerContext } from "@connectrpc/connect";
import { ZodType } from "zod"; // Using Zod for input validation

export interface SecureContext extends HandlerContext {
  user?: { id: string; role: string };
}

// 1. Role-Based Authentication Wrapper
export function Authorize(allowedRole?: string) {
  return <Req, Res>(handler: (req: Req, ctx: SecureContext) => Promise<Res> | Res) => {
    return async (request: Req, context: SecureContext): Promise<Res> => {
      if (!context.user) {
        throw new ConnectError("Unauthenticated", Code.Unauthenticated);
      }
      if (allowedRole && context.user.role !== allowedRole) {
        throw new ConnectError("Permission denied", Code.PermissionDenied);
      }
      return handler(request, context);
    };
  };
}

// 2. Input Validation Wrapper
export function UseValidation<T>(schema: ZodType<T>) {
  return <Res>(handler: (req: T, ctx: SecureContext) => Promise<Res> | Res) => {
    return async (request: T, context: SecureContext): Promise<Res> => {
      const result = schema.safeParse(request);
      console.log(result)
      if (!result.success) {
        // Flatten validation errors cleanly for the client
        const message = result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        console.log(message)
        throw new ConnectError(message, Code.InvalidArgument);
      }
      // Pass the fully typed, safely parsed data to the handler
      return handler(result.data as T, context);
    };
  };
}

// 3. Optional: Combine them so you don't write nested wrappers
export function ProtectedRoute<T>(role: string, schema: ZodType<T>) {
  return <Res>(handler: (req: T, ctx: SecureContext) => Promise<Res> | Res) => {
    return Authorize(role)(UseValidation(schema)(handler));
  };
}