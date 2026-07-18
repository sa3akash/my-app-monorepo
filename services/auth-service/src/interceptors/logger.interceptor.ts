import type { Interceptor } from "@connectrpc/connect";

export const globalLoggerInterceptor: Interceptor = (next) => async (req) => {
  const startTime = performance.now();

  // Extract tracking context from metadata headers
  const traceId = req.header.get("x-trace-id") || crypto.randomUUID();
  req.header.set("x-trace-id", traceId);

  console.log(`[REQ] [TraceID: ${traceId}] Calling RPC: ${req.method.name}`);

  try {
    const res = await next(req);
    const duration = (performance.now() - startTime).toFixed(2);
    console.log(
      `[RES] [TraceID: ${traceId}] ${req.method.name} Success in ${duration}ms`,
    );
    return res;
  } catch (err: any) {
    const duration = (performance.now() - startTime).toFixed(2);
    console.error(
      `[ERR] [TraceID: ${traceId}] ${req.method.name} Failed in ${duration}ms - Message: ${err.message}`,
    );
    throw err;
  }
};
