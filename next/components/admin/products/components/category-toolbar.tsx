import { MutableRefObject, useRef, useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi";
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiClipboardLine,
  RiDeleteBin5Line,
  RiDownload2Line,
  RiFileAddLine,
  RiFileCopy2Line,
  RiFileCopyLine,
  RiFileUploadLine,
  RiFolderAddLine,
  RiForbid2Line,
} from "react-icons/ri";
import { VscExpandAll } from "react-icons/vsc";
import { importFile } from "../../../../lib/helpers/import-file";
import { saveFile } from "../../../../lib/helpers/save-file";
import { useToast } from "../../../../lib/providers/toast-provider";
import { Category } from "../../../../lib/repo/category.repo";
import { ProductService } from "../../../../lib/repo/product.repo";
import { Button } from "../../../shared/utilities/form/button";
import { useProductsContext } from "../providers/products-provider";
import { ExportProductDialog } from "./export-product-dialog";

interface PropsType extends ReactProps {}

export function CategoryToolbar({ ...props }: PropsType) {
  const {
    selectedItem,
    selectItem,
    createProduct,
    createCategory,
    deleteSelectedItem,
    duplicateProduct,
    refresh,
    moveCategory,
    copyItem,
    copiedItem,
    pasteItem,
    expandCategory,
  } = useProductsContext();

  const [isOpenExportProductDialog, setIsOpenExportProductDialog] = useState(false);
  const [importing, setImporting] = useState(false);
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>();
  const onFileChange = async (e) => {
    let file = e.target.files[0];
    if (file) {
      try {
        setImporting(true);
        await saveFile(
          () => ProductService.importProduct(file),
          "excel",
          "KET_QUA_IMPORT.xlsx",
          toast
        );
        refresh();
        toast.success("Import thành công");
      } catch (err) {
        console.error(err);
      } finally {
        setImporting(false);
        e.target.value = "";
      }
    }
  };

  return (
    <>
      <Button
        outline
        className="col-span-3 flex-col p-2 h-auto bg-white text-center text-xs"
        icon={<RiFolderAddLine />}
        iconClassName="text-xl pb-1"
        text="Tạo danh mục"
        onClick={() => createCategory()}
      />
      <Button
        outline
        className="col-span-3 flex-col p-2 h-auto bg-white text-center text-xs"
        icon={selectedItem?.categoryId ? <RiFileCopy2Line /> : <RiFileAddLine />}
        iconClassName="text-xl pb-1"
        text={`${selectedItem?.categoryId ? "Nhân bản" : "Tạo"} sản phẩm`}
        disabled={!selectedItem}
        onClick={() => (selectedItem?.categoryId ? duplicateProduct() : createProduct())}
      />
      <Button
        outline
        className="col-span-3 flex-col p-2 h-auto bg-white text-center text-xs"
        icon={<RiDeleteBin5Line />}
        iconClassName="text-xl pb-1"
        text="Xoá đang chọn"
        disabled={!selectedItem}
        onClick={() => deleteSelectedItem()}
      />
      <Button
        outline
        className="col-span-3 flex-col p-2 h-auto bg-white text-center text-xs"
        icon={<RiForbid2Line />}
        iconClassName="text-xl pb-1"
        text="Bỏ chọn"
        disabled={!selectedItem}
        onClick={() => selectItem(null)}
      />
      <div className="border-group rounded col-span-3 flex">
        <Button
          outline
          className="bg-white px-0 py-2 flex-1 h-auto"
          tooltip="Import sản phẩm"
          placement="top"
          isLoading={importing}
          icon={<RiFileUploadLine />}
          onClick={() => fileRef.current.click()}
        />
        <input hidden accept=".xlsx" type="file" ref={fileRef} onChange={onFileChange} />
        <Button
          outline
          className="bg-white px-0 py-2 flex-1 h-auto"
          tooltip="Xuất danh sách sản phẩm"
          placement="top"
          disabled={selectedItem?.categoryId}
          icon={<RiDownload2Line />}
          onClick={() => setIsOpenExportProductDialog(true)}
        />
        <ExportProductDialog
          category={selectedItem as Category}
          isOpen={isOpenExportProductDialog}
          onClose={() => setIsOpenExportProductDialog(false)}
        />
      </div>
      <div className="border-group rounded col-span-3 flex">
        <Button
          outline
          className="bg-white px-0 py-2 flex-1 h-auto"
          tooltip="Sao chép"
          placement="top"
          disabled={!selectedItem}
          icon={<RiFileCopyLine />}
          onClick={copyItem}
        />
        <Button
          outline
          className="bg-white px-0 py-2 flex-1 h-auto"
          tooltip="Dán vào danh mục"
          placement="top"
          disabled={!selectedItem || !copiedItem}
          icon={<RiClipboardLine />}
          onClick={pasteItem}
        />
      </div>
      <div className="border-group rounded col-span-3 flex">
        <Button
          outline
          className="bg-white px-0 py-2 flex-1 h-auto"
          tooltip="Di chuyển danh mục lên"
          placement="top"
          disabled={!selectedItem || selectedItem.categoryId || !selectedItem.parentIds?.length}
          icon={<RiArrowUpLine />}
          onClick={() => moveCategory("up")}
        />
        <Button
          outline
          className="bg-white px-0 py-2 flex-1 h-auto"
          tooltip="Di chuyển danh mục xuống"
          placement="top"
          disabled={!selectedItem || selectedItem.categoryId || !selectedItem.parentIds?.length}
          icon={<RiArrowDownLine />}
          onClick={() => moveCategory("down")}
        />
      </div>
      <div className="border-group rounded col-span-3 flex">
        <Button
          outline
          className="bg-white px-0 py-2 flex-1 h-auto"
          tooltip={selectedItem ? "Mở hết danh mục đang chọn" : "Mở hết danh mục"}
          placement="top"
          disabled={selectedItem?.categoryId}
          icon={<VscExpandAll />}
          onClick={expandCategory}
        />
        <Button
          outline
          className="bg-white px-0 py-2 flex-1 h-auto"
          tooltip="Tải lại cây thư mục"
          placement="top"
          icon={<HiOutlineRefresh />}
          onClick={refresh}
        />
      </div>
    </>
  );
}
