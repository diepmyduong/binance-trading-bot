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

export function DeliverySettings() {
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
    <Form initialData={shopConfig} className="max-w-screen-sm animate-emerge" onSubmit={onSubmit}>
      <div className="text-gray-400 font-semibold mt-4 mb-4 pl-1 text-lg">
        Cấu hình phí giao hàng
      </div>
      <Field label="Thời gian nhà hàng chuẩn bị" name="shipPreparationTime">
        <Input className="h-12" />
      </Field>
      <div className="flex">
        <Form.Consumer>
          {({ data }) => (
            <Field label="Phí giao hàng dưới 1km" name="shipOneKmFee" className="flex-1">
              <Input className="h-12" number suffix="VND" readonly={!data.shipUseOneKmFee} />
            </Field>
          )}
        </Form.Consumer>

        <Field label=" " name="shipUseOneKmFee" className="pl-5 flex-1">
          <Switch placeholder="Tính phí ship dưới 1km" className="h-12 font-semibold" />
        </Field>
      </div>
      <div className="flex">
        <Field className="flex-1" label="Phí giao hàng theo" name="shipDefaultDistance">
          <Select options={SHOP_KM_OPTIONS} className="h-12 inline-grid" />
        </Field>
        <span className="pt-10 px-2">-</span>
        <Field className="flex-1" label="Đồng giá" name="shipDefaultFee">
          <Input className="h-12" number suffix="VND" />
        </Field>
      </div>
      <Field label="Phí giao hàng cho mỗi km tiếp theo" name="shipNextFee">
        <Input className="h-12" number suffix="VND" />
      </Field>
      <Field label="Ghi chú giao hàng" name="shipNote">
        <Input className="h-12" />
      </Field>
      {/* <div className="text-gray-400 font-semibold mt-4 mb-4 pl-1 text-lg">Cấu hình VNPOST</div>
      <Field label="Mã CRM VNPost" name="vnpostCode">
        <Input className="h-12" />
      </Field>
      <Field label="Tên người dùng VNPost" name="vnpostName">
        <Input className="h-12" />
      </Field>
      <Field label="Điện thoại VNPost" name="vnpostPhone">
        <Input className="h-12" />
      </Field> */}
      <Form.Footer className="justify-end gap-3">
        <Button primary className="bg-gradient" text="Lưu thay đổi" submit isLoading={submitting} />
      </Form.Footer>
    </Form>
  );
}
