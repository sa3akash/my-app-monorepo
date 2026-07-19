import { Interceptor, ConnectError, Code } from "@connectrpc/connect";

import { createContextKey } from "@connectrpc/connect";

export interface UserSession {
  id: string;
  role: string;
}

// createContextKey takes a default value fallback
export const UserContextKey = createContextKey<UserSession | undefined>(undefined);

export const advancedAuthInterceptor: Interceptor = (next) => async (req) => {
  // 1. Extract Token from the incoming header
  const token = req.header.get("Authorization")?.replace("Bearer ", "");
  
  let currentUser: UserSession | undefined = undefined;

  // 2. Validate token and parse session
  if (token) {
    try {
      // Replace this pseudo-code with your actual JWT/Session parsing logic:
      // currentUser = jwt.verify(token, process.env.JWT_SECRET) as UserSession;
      currentUser = { id: "user_123", role: "admin" }; 
      
      // Save it safely using your typed key
      req.contextValues.set(UserContextKey, currentUser);
    } catch (err) {
      throw new ConnectError("Invalid or expired session", Code.Unauthenticated);
    }
  }

  // 3. Dynamic RBAC via Protobuf Metadata Options
  // Automatically reads 'option (security.required_role) = "admin";' from your .proto definition
  const requiredRole = req.header.get('required_role');

  // If the protobuf endpoint explicitly specified a role requirement
  if (requiredRole) {
    if (!currentUser) {
      throw new ConnectError("Authentication required", Code.Unauthenticated);
    }

    if (currentUser.role !== requiredRole) {
      throw new ConnectError(
        `Permission denied. This endpoint requires the '${requiredRole}' role.`, 
        Code.PermissionDenied
      );
    }
  }

  return await next(req);
};