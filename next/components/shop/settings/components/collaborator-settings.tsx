import { useState } from "react";
import { useShopLayoutContext } from "../../../../layouts/shop-layout/providers/shop-layout-provider";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { MemberService } from "../../../../lib/repo/member.repo";
import { SHOP_KM_OPTIONS } from "../../../../lib/repo/shop-config.repo";
import { Button } from "../../../shared/utilities/form/button";
import { Field } from "../../../shared/utilities/form/field";
import { Form } from "../../../shared/utilities/form/form";
import { Input } from "../../../shared/utilities/form/input";
import { Select } from "../../../shared/utilities/form/select";
import { Switch } from "../../../shared/utilities/form/switch";

export function CollaboratorSettings() {
  const { shopConfig, updateShopConfig } = useShopLayoutContext();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      await updateShopConfig(data);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form
      grid
      initialData={shopConfig}
      className="max-w-screen-sm animate-emerge"
      onSubmit={onSubmit}
    >
      <div className="text-gray-400 font-semibold mt-4 mb-4 pl-1 text-lg col-span-12">
        Cấu hình cộng tác viên
      </div>
      <Form.Consumer>
        {({ data }) => (
          <>
            <Field name="collaborator" cols={6}>
              <Switch placeholder="Bật chức năng cộng tác viên" />
            </Field>
            <Field name="colApprove" cols={6}>
              <Switch placeholder="Yêu cầu duyệt cộng tác viên" />
            </Field>
            <Field label="Yêu cầu đơn tối thiểu" name="colMinOrder" cols={6}>
              <Input className="h-12" number suffix="đơn" />
            </Field>
            <Field label="Điều kiện tính hoa hồng dựa theo" name="colCommissionBy" cols={6}>
              <Select className="h-12" options={COLLABORATORS_COMMISSIONS_TYPES} />
            </Field>
            <Field label="Hoa hồng cố định theo" name="colCommissionUnit" cols={6}>
              <Select className="h-12" options={COLLABORATORS_COMMISSIONS_UNITS} />
            </Field>
            <Field label="Giá trị hoa hồng trên từng đơn" name="colCommissionValue" cols={6}>
              <Input className="h-12" number suffix={data.colCommissionBy == "VND" ? "VND" : "%"} />
            </Field>
          </>
        )}
      </Form.Consumer>
      <Form.Footer className="justify-end gap-3">
        <Button primary className="bg-gradient" text="Lưu thay đổi" submit isLoading={submitting} />
      </Form.Footer>
    </Form>
  );
}

const COLLABORATORS_COMMISSIONS_TYPES: Option[] = [
  { value: "ORDER", label: "Số đơn hàng" },
  { value: "ITEM", label: "Số sản phẩm" },
];

const COLLABORATORS_COMMISSIONS_UNITS: Option[] = [
  { value: "PERCENT", label: "Phần trăm" },
  { value: "VND", label: "Giá cố đỊnh" },
];
