import { useState } from "react";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { MemberService } from "../../../../lib/repo/member.repo";
import { Button } from "../../../shared/utilities/form/button";
import { Field } from "../../../shared/utilities/form/field";
import { Form } from "../../../shared/utilities/form/form";
import { Input } from "../../../shared/utilities/form/input";
import { Select } from "../../../shared/utilities/form/select";

export function DeliverySettings() {
  const { member, memberUpdateMe } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const onSubmit = async (data) => {
    toast.success("Chức năng chưa hoạt động");
    return;
    try {
      setSubmitting(true);
      await memberUpdateMe(data);
      toast.success("Lưu thay đổi thành công");
    } catch (err) {
      toast.error("Lưu thay đổi thất bại. " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const options = [
    { value: 2, label: "2km đầu tiên" },
    { value: 3, label: "3km đầu tiên" },
    { value: 5, label: "5km đầu tiên" },
    { value: 10, label: "10km đầu tiên" },
  ];

  return (
    <Form initialData={member} className="max-w-screen-sm animate-emerge" onSubmit={onSubmit}>
      <Field label="Thời gian nhà hàng chuẩn bị" name="readyTime">
        <Input className="h-12" />
      </Field>
      <Field label="Phí giao hàng dưới 1km" name="below1kmFee">
        <Input className="h-12" number suffix="VND" />
      </Field>
      <div className="flex">
        <Field className="flex-1" label="Phí giao hàng theo" name="shortDistance">
          <Select options={options} className="h-12 inline-grid" />
        </Field>
        <span className="pt-10 px-2">-</span>
        <Field className="flex-1" label="Đồng giá" name="shortDistanceFee">
          <Input className="h-12" number suffix="VND" />
        </Field>
      </div>
      <Field label="Phí giao hàng cho số km tiếp theo" name="longDistanceFee">
        <Input className="h-12" number suffix="VND" />
      </Field>
      <Form.Footer className="justify-end gap-3">
        <Button primary className="bg-gradient" text="Lưu thay đổi" submit isLoading={submitting} />
      </Form.Footer>
    </Form>
  );
}
