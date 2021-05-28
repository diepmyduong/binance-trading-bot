import { Worksheet, Workbook } from "exceljs";
import { CellRange } from "./cell-range";
import { WorkSheetHelper } from "./workSheet.helper";
import _ from "lodash";
export class SheetCloner {
  constructor(public baseSheet: Worksheet, public destSheet: Worksheet) {
    this.helper = new WorkSheetHelper(this.baseSheet);
  }
  public currentRow = 0;
  public currentCol = 0;
  public helper: WorkSheetHelper;
  next(tl: string, br: string, context?: any, margin: number = 0) {
    const templateRange = CellRange.createFromCells(
      this.baseSheet.getCell(tl),
      this.baseSheet.getCell(br)
    );
    const rangeDest = new CellRange(
      1,
      templateRange.left,
      templateRange.countRows,
      templateRange.right
    );
    rangeDest.move(this.currentRow, this.currentCol);
    this.helper.copyCellRange(templateRange, rangeDest, this.baseSheet, this.destSheet);
    if (context) {
      this.helper.parseRange(rangeDest, context, this.destSheet);
    }
    this.currentRow += templateRange.countRows + margin;
  }
  nextAsync(tl: string, br: string, context?: any, margin: number = 0) {
    const templateRange = CellRange.createFromCells(
      this.baseSheet.getCell(tl),
      this.baseSheet.getCell(br)
    );
    const currentRow = this.currentRow;
    const currentCol = this.currentCol;
    this.currentRow += templateRange.countRows + margin;

    return new Promise((resolve, reject) => {
      _.defer(() => {
        const rangeDest = new CellRange(
          1,
          templateRange.left,
          templateRange.countRows,
          templateRange.right
        );
        rangeDest.move(currentRow, currentCol);
        this.helper.copyCellRange(templateRange, rangeDest, this.baseSheet, this.destSheet);
        if (context) {
          this.helper.parseRange(rangeDest, context, this.destSheet);
        }
        resolve(true);
      });
    });
  }
  cloneWidth() {
    this.helper.cloneSheetWidth(this.destSheet);
  }
}

export const getWorksheetCloner = async (
  templatePath: string,
  templateSheetName = "template",
  reportSheetName = "Báo cáo"
) => {
  const baseWorkbook = new Workbook();
  await baseWorkbook.xlsx.readFile(`reportTemplate/${templatePath}.xlsx`);
  const reportWorkbook = new Workbook();
  const reportSheet = reportWorkbook.addWorksheet(reportSheetName);
  const cloner = new SheetCloner(baseWorkbook.getWorksheet(templateSheetName), reportSheet);
  cloner.cloneWidth();
  return { cloner, reportWorkbook };
};
