import path from 'path';
import { Response } from 'express';
import numeral from 'numeral';
import PdfPrinter from "pdfmake";
import KhongDau from "khong-dau";
export class PrinterHelper {
    static printer = new PdfPrinter({
        Roboto: {
            normal: path.resolve(
                __dirname,
                '../../public/fonts/Roboto-Regular.ttf'
            ),
            bold: path.resolve(
                __dirname,
                '../../public/fonts/Roboto-Medium.ttf'
            ),
            italics: path.resolve(
                __dirname,
                '../../public/fonts/Roboto-Italic.ttf'
            ),
            bolditalics: path.resolve(
                __dirname,
                '../../public/fonts/Roboto-MediumItalic.ttf'
            ),
            // timesNewRoman: path.resolve(
            //     __dirname,
            //     '../../public/fonts/Times_New_Roman_Normal.ttf')
        }
    });

    static responsePDF(res: Response, pdfContent: any, filename: string) {
        const printer = new PdfPrinter({
            Roboto: {
                normal: path.resolve(
                    __dirname,
                    '../../public/fonts/Roboto-Regular.ttf'
                ),
                bold: path.resolve(
                    __dirname,
                    '../../public/fonts/Roboto-Medium.ttf'
                ),
                italics: path.resolve(
                    __dirname,
                    '../../public/fonts/Roboto-Italic.ttf'
                ),
                bolditalics: path.resolve(
                    __dirname,
                    '../../public/fonts/Roboto-MediumItalic.ttf'
                ),
                // timesNewRoman: path.resolve(
                //     __dirname,
                //     '../../public/fonts/Times_New_Roman_Normal.ttf')
            }
        });
        const pdfDoc = printer.createPdfKitDocument(pdfContent);
        res.setHeader('Content-type', 'application/pdf');
        res.setHeader(
            'Content-disposition',
            `attachment; filename=${KhongDau(filename).replace(/\ /g, '-')}.pdf`
        );
        pdfDoc.pipe(res);
        pdfDoc.end();
    }
    static getStyles() {
        return {
            center: {
                alignment: 'center'
            },
            ml70: { margin: [70, 0, 0, 0] },
            mt10: {
                margin: [0, 10, 0, 0]
            },
            thead: {
                alignment: 'center',
                bold: true
            },
            cr: {
                alignment: 'right'
            },
            cl: {
                alignment: 'left'
            },
            crb: {
                alignment: 'right',
                bold: true
            },
            h2ib: {
                bold: true,
                fontSize: 12,
                italics: true
            },
            h2b: {
                bold: true,
                fontSize: 14
            },
            b: {
                bold: true
            },
            u: {
                decoration: 'underline'
            },
            sm: {
                fontSize: 5
            },
            byellow: {
                bold: true,
                fontSize: 10,
                fillColor: 'yellow',
                color: 'red'
            },
            borange: {
                bold: true,
                fontSize: 10,
                fillColor: 'orange',
                color: 'red'
            },
            kgio: {
                italics: true,
                color: 'blue'
            },
            clb: {
                alignment: 'left',
                bold: true
            },
            lightgrey: {
                fillColor: 'lightgrey'
            }
        };
    }
    static getTextNull(value: number) {
        const textNull: any[] = [];
        while (value > 0) {
            textNull.push({ text: '' });
            value--;
        }
        return textNull;
    }
    static checkUndefine(value: any) {
        if (!value) return '';
        else return value;
    }
    static lintNumberPDF(value: any, style: any) {
        return {
            text: `${value ? numeral(value).format('0,0') : " "}`,
            style: style
        };
    };
}
