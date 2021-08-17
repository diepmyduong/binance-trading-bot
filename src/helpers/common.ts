import fs from "fs";
import { get, isBoolean, isNumber, isObject, isString } from "lodash";
import moment from "moment-timezone";
import path from "path";
import { queryErrorNotFound } from "../errors/query.error";

export function walkSyncFiles(dir: string, filelist: string[] = []) {
  const files = fs.readdirSync(dir);
  files.forEach(function (file: any) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSyncFiles(path.join(dir, file), filelist);
    } else {
      filelist.push(path.join(dir, file));
    }
  });
  return filelist;
}

export function toMoney(text = 0, digit = 0) {
  var re = "\\d(?=(\\d{3})+" + (digit > 0 ? "\\." : "$") + ")";
  return text.toFixed(Math.max(0, ~~digit)).replace(new RegExp(re, "g"), "$&,");
}

export function matchDateRange(fromDate?: string, toDate?: string) {
  const match: any = {};
  if (fromDate) match.$gte = moment(fromDate, "YYYY-MM-DD").startOf("date").toDate();
  if (toDate) match.$lte = moment(toDate, "YYYY-MM-DD").endOf("date").toDate();
  return match;
}

export function replaceDataToText(text: string, data: any) {
  let messageText = text.toString();
  const stringRegex = /{{(.*?)}}/g;
  messageText = messageText.replace(stringRegex, (m: any, field: string) => {
    let value = get(data, field.trim());
    if (isString(value) || isNumber(value)) {
      value = JSON.stringify(value)
        .replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f")
        .replace(/^\"(.*)\"$/g, "$1");
    } else if (isObject(value) || isBoolean(value)) {
      value = `<<Object(${JSON.stringify(value)})Object>>`;
    }
    return value || "";
  });
  return messageText.replace(
    /\:\"(?: +)?<<Object\((true|false|[\{|\[].*?[\}|\]])\)Object>>(?: +)?\"/g,
    ":$1"
  );
}

export function replaceDataToObject(object: any, data: any) {
  let encodeData = JSON.stringify(object);
  encodeData = this.replaceDataToText(encodeData, data);
  try {
    return JSON.parse(encodeData);
  } catch (err) {
    return object;
  }
}

export function notFoundHandler<T>(data: T) {
  if (!data) throw queryErrorNotFound;
  return data;
}
