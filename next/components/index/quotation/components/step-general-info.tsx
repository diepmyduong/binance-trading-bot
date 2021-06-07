import { Field } from "../../../shared/utilities/form/field";
import { Form } from "../../../shared/utilities/form/form";
import { Input } from "../../../shared/utilities/form/input";
import { Textarea } from "../../../shared/utilities/form/textarea";

export function StepGeneralInfo() {
  return (
    <Form className="max-w-3xl mx-auto" grid>
      <div className="text-accent font-semibold text-center col-span-12 my-6 text-xl uppercase">
        Thông tin sự kiện
      </div>
      <Field label="Tên sự kiện" required cols={12}>
        <Input />
      </Field>
      <Field label="Địa điểm" cols={12}>
        <Input placeholder="Địa điểm tổ chức" />
      </Field>
      <Field label="Thời gian" cols={12}>
        <Input placeholder="Nhập ngày bắt đầu và kết thúc sự kiện" />
      </Field>
      <Field label="Thông tin khác" cols={12}>
        <Textarea />
      </Field>
      <div className="text-accent font-semibold text-center col-span-12 my-6 text-xl uppercase">
        Thông tin khách hàng
      </div>
      <Field label="Tên khách hàng" required cols={6}>
        <Input />
      </Field>
      <Field label="Người đại diện" required cols={6}>
        <Input />
      </Field>
      <Field label="Số điện thoại liên hệ" required cols={6}>
        <Input />
      </Field>
      <Field label="Email liên hệ" required cols={6}>
        <Input />
      </Field>
      <div className="flex justify-end "></div>
    </Form>
  );
}
