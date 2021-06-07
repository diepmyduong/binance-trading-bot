export function AddressPipe(item: any) {
  return `${item.address || ""}${item.ward ? `, ${item.ward}` : ""}${
    item.district ? `, ${item.district}` : ""
  }${item.province ? `, ${item.province}` : ""}`.trim();
}
