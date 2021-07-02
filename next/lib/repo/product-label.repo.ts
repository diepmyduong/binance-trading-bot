import { BaseModel, CrudRepository } from "./crud.repo";

export interface ProductLabel extends BaseModel {
  memberId: string;
  name: string;
  color: string;
}
export class ProductLabelRepository extends CrudRepository<ProductLabel> {
  apiName: string = "ProductLabel";
  displayName: string = "nhãn sản phẩm";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    name: String
    color: String
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    name: String
    color: String
  `);
}

export const ProductLabelService = new ProductLabelRepository();

export const PRODUCT_LABEL_COLORS: Option[] = [
  { code: "#29C5FF", display: "Xanh lơ" },
  { code: "#0287D0", display: "Xanh dương" },
  { code: "#004790", display: "Xanh biển" },
  { code: "#fa8072", display: "Đỏ cá hồi" },
  { code: "#f24b3a", display: "Đỏ tươi" },
  { code: "#B71C0C", display: "Đỏ lựu" },
  { code: "#3EDC81", display: "Xanh lá cây" },
  { code: "#30b848", display: "Xanh lục" },
  { code: "#006C11", display: "Xanh quân đội" },
  { code: "#F9BF3B", display: "Cam cà rốt" },
  { code: "#F1892D", display: "Cam đào" },
  { code: "#C86400", display: "Cam bí ngô" },
  { code: "#AB69C6", display: "Tím nho" },
  { code: "#7E349D", display: "Tím hoàng gia" },
  { code: "#4E046D", display: "Tím mực" },
  { code: "#FFA27B", display: "Da người nhạt" },
  { code: "#E3724B", display: "Da người trung" },
  { code: "#B3421B", display: "Da người đậm" },
  { code: "#47EBE0", display: "Ngọc trời" },
  { code: "#17BBB0", display: "Ngọc bích" },
  { code: "#008B80", display: "Ngọc lam" },
  { code: "#FF8CC8", display: "Hồng phấn" },
  { code: "#EA4C88", display: "Hồng tươi" },
  { code: "#BA1C58", display: "Hồng nhung" },
  { code: "#EAB897", display: "Nâu be" },
  { code: "#AE7C5B", display: "Nâu trầm" },
  { code: "#8E5C3B", display: "Nâu đất" },
  { code: "#ACBAC9", display: "Màu bạc" },
  { code: "#8C9AA9", display: "Màu sắt" },
  { code: "#3C4A59", display: "Màu bão" },
].map((x) => ({ value: x.code, label: x.display, color: x.code }));
