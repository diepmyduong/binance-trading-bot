import endOfMonth from "date-fns/endOfMonth";
import format from "date-fns/format";
import isSameDay from "date-fns/isSameDay";
import startOfMonth from "date-fns/startOfMonth";
import { saveFile } from "../../../../lib/helpers/save-file";
import { useToast } from "../../../../lib/providers/toast-provider";
import {
  OrderService,
  ORDER_STATUS,
  PAYMENT_METHODS,
  PICKUP_METHODS,
} from "../../../../lib/repo/order.repo";
import { ShopBranchService } from "../../../../lib/repo/shop-branch.repo";
import { DialogPropsType } from "../../../shared/utilities/dialog/dialog";
import { DatePicker } from "../../../shared/utilities/form/date";
import { Field } from "../../../shared/utilities/form/field";
import { Form } from "../../../shared/utilities/form/form";
import { Select } from "../../../shared/utilities/form/select";

interface PropsType extends DialogPropsType {
  shopBranchId: string;
  pickupMethod: string;
  paymentMethod: string;
  status: string;
}
export function ExportOrderDialog({ ...props }: PropsType) {
  const toast = useToast();

  const onSubmit = async (data, fullData) => {
    const { fromDate, toDate, shopBranchId, pickupMethod, paymentMethod, status } = data;
    const filter = {
      ...(shopBranchId ? { shopBranchId } : {}),
      ...(pickupMethod ? { pickupMethod } : {}),
      ...(paymentMethod ? { paymentMethod } : {}),
      ...(status ? { status } : {}),
    };
    console.log(filter);
    try {
      await saveFile(
        () =>
          OrderService.exportExcel(
            format(fromDate, "yyyy/MM/dd"),
            format(toDate, "yyyy/MM/dd"),
            filter
          ),
        "excel",
        `DON_HANG_TU_${format(fromDate, "dd-MM-yyyy")}_DEN_${format(toDate, "dd-MM-yyyy")}${
          fullData.shopBranchId
            ? `_CHI_NHANH_${(fullData.shopBranchId.name as string)
                .toUpperCase()
                .replaceAll(" ", "_")}`
            : ""
        }.xlsx`,
        toast
      );
    } catch (err) {}
  };

  return (
    <Form
      dialog
      title="Xuất danh sách đơn hàng"
      disableDialogCloseAlert
      isOpen={props.isOpen}
      onClose={props.onClose}
      initialData={{
        fromDate: startOfMonth(new Date()),
        toDate: endOfMonth(new Date()),
        ...props,
      }}
      onSubmit={onSubmit}
      grid
      width="600px"
    >
      <Field name="fromDate" label="Từ ngày" required cols={6}>
        <DatePicker clearable={false} />
      </Field>
      <Field name="toDate" label="Đến ngày" required cols={6}>
        <DatePicker clearable={false} />
      </Field>
      <Field name="shopBranchId" label="Chi nhánh" cols={6}>
        <Select
          className="h-12"
          clearable
          placeholder="Tất cả chi nhánh"
          optionsPromise={() => ShopBranchService.getAllOptionsPromise()}
        />
      </Field>
      <Field name="pickupMethod" label="Hình thức lấy hàng" cols={6}>
        <Select
          className="h-12"
          clearable
          placeholder="Tất cả hình thức lấy hàng"
          options={PICKUP_METHODS}
        />
      </Field>
      <Field name="paymentMethod" label="Hình thức thanh toán" cols={6}>
        <Select
          className="h-12"
          clearable
          placeholder="Tất cả hình thức thanh toán"
          options={PAYMENT_METHODS}
        />
      </Field>
      <Field name="status" label="Trạng thái" cols={6}>
        <Select className="h-12" clearable placeholder="Tất cả trạng thái" options={ORDER_STATUS} />
      </Field>
      <Form.Footer>
        <Form.ButtonGroup cancelText="Đóng" onCancel={props.onClose} />
      </Form.Footer>
    </Form>
  );
}
