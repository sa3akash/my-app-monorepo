import type { Interceptor } from "@connectrpc/connect";

export const AuthInterceptor: Interceptor = (next) => async (req) => {
  const token = req.header.get("Authorization");
  
 

  return await next(req);
};
