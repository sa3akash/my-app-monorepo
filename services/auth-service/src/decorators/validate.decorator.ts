import { ConnectError, Code } from "@connectrpc/connect";
import { ZodError, formatError, type ZodJSONSchema } from "zod";

export function Validate(schema: ZodJSONSchema) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (req: any, ctx: any) {
      try {
        // Enforce parsing on raw inputs
        schema.parse(req);
      } catch (error) {
        if (error instanceof ZodError) {
          // Format structural issues directly to client

          const formatErrors = formatError(error);
          const details = formatErrors._errors.map((e) => `${e}`);

          throw new ConnectError(
            `Validation Failed - ${details}`,
            Code.InvalidArgument,
          );
        }
        throw new ConnectError(
          "Internal payload validation panic",
          Code.Internal,
        );
      }

      return await originalMethod.apply(this, [req, ctx]);
    };

    return descriptor;
  };
}
