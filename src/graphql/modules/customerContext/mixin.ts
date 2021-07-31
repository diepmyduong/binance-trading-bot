import { get } from "lodash";
import { Context } from "../../context";

export function getContextValue(key: string, defaultValue: any = null) {
  return async (root: any, args: any, context: Context) => {
    return get(root, "context." + key, defaultValue);
  };
}
