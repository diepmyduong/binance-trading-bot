import { Response } from "express";
import KhongDau from "khong-dau";
import PdfPrinter from "pdfmake";

export default class PDFPrinter {
  private static _instance: PDFPrinter;
  static get instance() {
    if (!this._instance) {
      this._instance = new PDFPrinter();
    }
    return this._instance;
  }
  public font: "roboto" | "times" = "roboto";
  constructor() {}
  getFontOptions(font: string) {
    switch (font) {
      case "times":
        return {
          normal: "public/fonts/times.ttf",
          bold: "public/fonts/timesbd.ttf",
          italics: "public/fonts/timesi.ttf",
          bolditalics: "public/fonts/timesbi.ttf",
        };
      case "roboto":
      default:
        return {
          normal: "public/fonts/Roboto-Regular.ttf",
          bold: "public/fonts/Roboto-Medium.ttf",
          italics: "public/fonts/Roboto-Italic.ttf",
          bolditalics: "public/fonts/Roboto-MediumItalic.ttf",
        };
    }
  }

  responsePDF(
    res: Response,
    pdfContent: any,
    { filename, download, font }: { filename?: string; download?: boolean; font?: string } = {}
  ) {
    const fontOption = this.getFontOptions(font || this.font);
    const printer = new PdfPrinter({ Roboto: fontOption });
    const pdfDoc = printer.createPdfKitDocument(pdfContent);
    res.setHeader("Content-type", "application/pdf");
    if (download) {
      res.setHeader(
        "Content-disposition",
        `attachment; filename=${KhongDau(filename).replace(/\ /g, "-")}.pdf`
      );
    }

    pdfDoc.pipe(res);
    pdfDoc.end();
  }
}
