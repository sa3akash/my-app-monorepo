import {
  Code,
  ConnectError,
  ServiceImpl,
} from "@connectrpc/connect";
import { type AuthService } from "@repo/protos/gen/ts/auth/v1/auth_pb";

export const authHandler: ServiceImpl<typeof AuthService> = {
  register(request, _context) {
    console.log("Register request received");
    if (!request.email) {
      throw new ConnectError("Email is required", Code.InvalidArgument);
    }
    return {};
  },
  login(_request, _context) {
    console.log("Login request received");
    return {};
  },
  refreshToken(_request, _context) {
    console.log("Refresh token request received");
    return {};
  },
  forgotPassword(_request, _context) {
    console.log("Forgot password request received");
    return {};
  },
  resetPassword(_request, _context) {
    console.log("Reset password request received");
    return {};
  },
  changePassword(_request, _context) {
    console.log("Change password request received");
    return {};
  },
  verifyEmail(_request, _context) {
    console.log("Verify email request received");
    return {};
  },
  getMe(_request, _context) {
    console.log("Get me request received");
    return {};
  },
  logout(_request, _context) {
    console.log("Logout request received");
    return {};
  },
};

/*
export class AuthRoutes implements ServiceImpl<typeof AuthService> {
  @Authorize('admin')
  async register(
    request: RegisterRequest,
    context: HandlerContext,
  ): Promise<RegisterResponse> {
    console.log("Register request received");
    return {
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiaWF0IjoxNzE3MTY4MDY4LCJleHAiOjE3MjQ5NDQwNjl9.e1F8o-1Y8jVnJtN8l9pQ6zK1R5c4r3t2s1u0v9w8x7y6z5u0v9w8x7y6z5u0v9w8x7y6",
      refreshToken: "",
      displayName: "Test",
      email: "email",
      name: "",
      role: UserRole.ADMIN,
      userId: "dfdf",
      $typeName: "auth.v1.RegisterResponse"   
    };
  }

  login(
    request: LoginRequest,
    context: HandlerContext,
  ): Promise<LoginResponse> {
    throw new Error("Method not implemented.");
  }

  refreshToken(
    request: RefreshTokenRequest,
    context: HandlerContext,
  ): Promise<RefreshTokenResponse> {
    throw new Error("Method not implemented.");
  }
  forgotPassword(
    request: ForgotPasswordRequest,
    context: HandlerContext,
  ): Promise<ForgotPasswordResponse> {
    throw new Error("Method not implemented.");
  }
  resetPassword(
    request: ResetPasswordRequest,
    context: HandlerContext,
  ): Promise<ResetPasswordResponse> {
    throw new Error("Method not implemented.");
  }
  changePassword(
    request: ChangePasswordRequest,
    context: HandlerContext,
  ): Promise<ChangePasswordResponse> {
    throw new Error("Method not implemented.");
  }
  verifyEmail(
    request: VerifyEmailRequest,
    context: HandlerContext,
  ): Promise<VerifyEmailResponse> {
    throw new Error("Method not implemented.");
  }
  getMe(
    request: GetMeRequest,
    context: HandlerContext,
  ): Promise<GetMeResponse> {
    throw new Error("Method not implemented.");
  }
  logout(
    request: LogoutRequest,
    context: HandlerContext,
  ): Promise<LogoutResponse> {
    throw new Error("Method not implemented.");
  }
}

*/
