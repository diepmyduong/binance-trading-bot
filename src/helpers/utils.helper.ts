import { Workbook } from "exceljs";
import { Response } from "express";
import fs from "fs";
import path from "path";
import _ from "lodash";

import bm25 from "wink-bm25-text-search";
import nlp from "wink-nlp-utils";
import KhongDau from "khong-dau";

import { AddressModel } from "../graphql/modules/address/address.model";
import moment from "moment-timezone";

const START_MONTH = moment().startOf("month").format("YYYY-MM-DD");
const END_MONTH = moment().endOf("month").format("YYYY-MM-DD");

export class UtilsHelper {
  constructor() {}

  static getDatesWithComparing = (fromDate: string = START_MONTH, toDate: string = END_MONTH) => {
    let $gte: Date = null,
      $lte: Date = null;

    if (fromDate) {
      $gte = moment(fromDate, "YYYY-MM-DD").startOf("date").toDate();
    }

    if (toDate) {
      $lte = moment(toDate, "YYYY-MM-DD").endOf("date").toDate();
    }
    return {
      $gte,
      $lte,
    };
  };

  static setTitleExcelWorkBook = (sheet: any, title: string) => {
    sheet.insertRow(1, [title]);
    sheet.mergeCells(`A1:I1`);
    sheet.getRow(1).font = { bold: true, size: 18 };
  };

  static setThemeExcelWorkBook = (sheet: any) => {
    for (let i = 0; i < sheet.columns.length; i += 1) {
      let dataMax = 0;
      const headerIndex = 1;
      const column = sheet.columns[i];
      for (let j = 1; j < column.values.length; j += 1) {
        const rowValue = column.values[j];
        const columnLength = rowValue ? rowValue.toString().length : 0;
        if (columnLength > dataMax) {
          dataMax = columnLength;
        }
        column.worksheet.getRow(j).border = {
          top: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        };
      }
      column.width = dataMax < 10 ? 10 : dataMax;
      column.worksheet.getRow(headerIndex).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD100" },
        bgColor: { argb: "FFD100" },
      };
      column.worksheet.getRow(headerIndex).font = {
        bold: true,
      };
    }
  };

  static responseExcel(res: Response, workBook: Workbook, filename = "baocao") {
    res.status(200);
    res.setHeader(
      "Content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-disposition",
      `attachment; filename=${filename.replace(/\ /g, "-")}.xlsx`
    );
    workBook.xlsx.write(res).then(res.end);
  }

  static search<T>(docs: any[], keyword: string, key: string, weight: any, option?: any): T[] {
    option = option || {};
    if (docs.length <= 3) return docs;
    const importantFields = Object.keys(weight);

    const searchEngine = bm25();
    if (option.firstChar) {
      importantFields.forEach((field) => {
        weight[`$fc_${field}`] = weight[field];
      });
    }
    searchEngine.defineConfig({ fldWeights: weight });
    searchEngine.definePrepTasks([
      nlp.string.lowerCase,
      nlp.string.removeExtraSpaces,
      nlp.string.tokenize0,
      nlp.tokens.propagateNegations,
      nlp.tokens.stem,
    ]);
    const copy = _.cloneDeep(docs);
    for (const doc of copy) {
      importantFields.forEach((field) => {
        doc[field] = KhongDau(doc[field]);
        if (option.firstChar) doc[`$fc_${field}`] = doc[field].match(/\b(\w)/g).join("");
      });
      searchEngine.learn(doc, doc[key]);
    }
    searchEngine.consolidate();

    return searchEngine
      .search(
        KhongDau(keyword),
        100,
        (r: any) => !option.core || r[1] >= option.core,
        option.params
      )
      .map((r: any) => docs.find((d) => d[key] == r[0]));
  }

  static walkSyncFiles(dir: string, filelist: string[] = []) {
    const files = fs.readdirSync(dir);
    files.forEach(function (file: any) {
      if (fs.statSync(path.join(dir, file)).isDirectory()) {
        filelist = UtilsHelper.walkSyncFiles(path.join(dir, file), filelist);
      } else {
        filelist.push(path.join(dir, file));
      }
    });
    return filelist;
  }
  static parsePhone(phone: string, pre: string) {
    if (!phone) return phone;
    let newPhone = "" + phone;
    newPhone = newPhone
      .replace(/^\+84/i, pre)
      .replace(/^\+0/i, pre)
      .replace(/^0/i, pre)
      .replace(/^84/i, pre);

    return newPhone;
  }

  static isEmail(email: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  static parseObjectWithInfo(params: { object: any; info: any }) {
    const { info, object } = params;
    let encodeData = JSON.stringify(object);
    encodeData = this.parseStringWithInfo({ data: encodeData, info });
    try {
      return JSON.parse(encodeData);
    } catch (err) {
      return object;
    }
  }
  static parseStringWithInfo(params: { data: string; info: any }) {
    const { data, info } = params;
    let messageText = "" + data;
    const stringRegex = /{{(.*?)}}/g;
    messageText = messageText.replace(stringRegex, (m: any, field: string) => {
      let data = _.get(info, field.trim());
      if (_.isString(data) || _.isNumber(data)) {
        data = JSON.stringify(data)
          .replace(/\\n/g, "\\n")
          .replace(/\\'/g, "\\'")
          .replace(/\\"/g, '\\"')
          .replace(/\\&/g, "\\&")
          .replace(/\\r/g, "\\r")
          .replace(/\\t/g, "\\t")
          .replace(/\\b/g, "\\b")
          .replace(/\\f/g, "\\f")
          .replace(/^\"(.*)\"$/g, "$1");
      } else if (_.isObject(data) || _.isBoolean(data)) {
        data = `<<Object(${JSON.stringify(data)})Object>>`;
      }
      return data || "";
    });
    return messageText.replace(
      /\:\"(?: +)?<<Object\((true|false|[\{|\[].*?[\}|\]])\)Object>>(?: +)?\"/g,
      ":$1"
    );
  }
}

export const getProvinceName = async (provinceId: any) => {
  if (!provinceId) return null;
  const address = await AddressModel.findOne({ provinceId });
  if (!address) return null;
  return address.province;
};
export const getDistrictName = async (districtId: any) => {
  if (!districtId) return null;
  const address = await AddressModel.findOne({ districtId });
  if (!address) return null;
  return address.district;
};
export const getWardName = async (wardId: any) => {
  if (!wardId) return null;
  const address = await AddressModel.findOne({ wardId });
  if (!wardId) return null;
  return address.ward;
};
