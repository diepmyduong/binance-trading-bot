import { IValidateSchema, validateSchema } from "./validateSchema.helper";
import { ErrorHelper } from "../base/error";
// import { baseError } from "@app/base/baseError";

export function validateJSON(data: any, schema: IValidateSchema) {
  const { isValid, result } = validateSchema(data, schema);
  if (isValid) {
    return true;
  } else {
    let message = result.errors.map((err) => err.message).toString();
    throw ErrorHelper.validateJSONError(message);
  }
}
