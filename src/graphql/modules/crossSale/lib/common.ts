import { ProductModel } from "../../product/product.model";

export async function getCrossSaleProduct(productId: any) {
  const product = await ProductModel.findById(productId);
  if (!product || !product.isCrossSale) throw Error("Sản phẩm không thể đăng ký.");
  return product;
}
