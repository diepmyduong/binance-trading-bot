const {  WorkSheetHelper } = require('../dist/helpers/workSheet/workSheet.helper');
const { Workbook } = require("exceljs");
(async function(){
  const workbook = new Workbook();
  await workbook.xlsx.readFile('Thu-Lao-BH-Ca-Nhan-NV0004-2021-05-01-2021-05-31.xlsx');
  // console.log('sheets', workbook.worksheets)
  const sheet = workbook.getWorksheet("THÙ_LAO_BH_CÁ_NHÂN");
  const data = sheet.getSheetValues();
  console.log('data', data);
})()