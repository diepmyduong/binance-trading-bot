import { useToast } from "../../../../lib/providers/toast-provider";
import { Category } from "../../../../lib/repo/category.repo";
import { ProductService } from "../../../../lib/repo/product.repo";
import { Field } from "../../../shared/utilities/form/field";
import { Form, FormPropsType } from "../../../shared/utilities/form/form";
import { Input } from "../../../shared/utilities/form/input";
import { Label } from "../../../shared/utilities/form/label";
import { Radio } from "../../../shared/utilities/form/radio";
import { saveFile } from "../../../../lib/helpers/save-file";

interface PropsType extends FormPropsType {
  category?: Category;
}
export function ExportProductDialog({ ...props }: PropsType) {
  const toast = useToast();

  const onSubmit = async (data) => {
    let filter = {};
    if (data.minPrice || data.maxPrice) {
      filter["basePrice"] = {};
      if (data.minPrice) filter["basePrice"] = { $gte: data.minPrice };
      if (data.maxPrice) filter["basePrice"] = { ...filter["basePrice"], $lte: data.maxPrice };
    }
    if (data.exportType == "descendants") {
      filter["categoryIds"] = props.category ? { $in: [props.category.id] } : undefined;
    } else {
      if (props.category) {
        filter["categoryId"] = props.category.id;
      } else {
        toast.info("Không thể xuất danh sách sản phẩm con của danh mục gốc");
        return;
      }
    }

    await saveFile(
      () => ProductService.exportProduct(filter),
      "excel",
      `Danh_sach_san_pham${
        props.category
          ? `${data.exportType == "descentdants" ? "_thuoc" : "_con"}_danh_muc_${
              props.category.name
            }`
          : ""
      }.xlsx`,
      toast
    );
  };

  return (
    <Form
      dialog
      disableDialogCloseAlert
      width="550px"
      title="Xuất danh sách sản phẩm"
      {...props}
      onSubmit={onSubmit}
      initialData={{ exportType: "descendants" }}
    >
      <Field label="Danh mục">
        <Input readonly value={props.category ? props.category.name : "Tất cả danh mục"} />
      </Field>
      <Field name="exportType" label="Quy cách xuất">
        <Radio
          cols={12}
          options={[
            { value: "descendants", label: "Xuất tất cả sản phẩm trong danh mục" },
            { value: "children", label: "Chỉ xuất sản phẩm con của danh mục" },
          ]}
        />
      </Field>
      <Label text="Giá sản phẩm" />
      <div className="flex">
        <span className="text-gray-600 pt-2 px-2">Từ</span>
        <Field className="flex-1" name="minPrice">
          <Input number currency />
        </Field>
        <span className="text-gray-600 pt-2 px-2">đến</span>
        <Field className="flex-1" name="maxPrice">
          <Input number currency />
        </Field>
      </div>
      <Form.Footer>
        <Form.ButtonGroup
          submitText="Xuất sản phẩm"
          cancelText="Đóng"
          onCancel={() => {
            props.onClose();
          }}
        />
      </Form.Footer>
    </Form>
  );
}
