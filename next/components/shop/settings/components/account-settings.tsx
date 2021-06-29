import { useState } from "react";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { MemberService } from "../../../../lib/repo/member.repo";
import { Button } from "../../../shared/utilities/form/button";
import { Field } from "../../../shared/utilities/form/field";
import { Form } from "../../../shared/utilities/form/form";
import { Input } from "../../../shared/utilities/form/input";

export function AccountSettings() {
  const { member, memberUpdateMe } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [openChangepassword, setOpenChangePassword] = useState(false);
  const toast = useToast();

  const onSubmit = async (data) => {
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

  return (
    <Form initialData={member} className="max-w-screen-sm animate-emerge" onSubmit={onSubmit}>
      <div className="text-gray-400 font-semibold mt-6 mb-4 pl-1 text-lg">Thông tin tài khoản</div>
      <Field label="Email đăng nhập" name="username" readonly>
        <Input className="h-12" />
      </Field>
      <Field label="Mã cửa hàng" name="code" readonly>
        <Input className="h-12" />
      </Field>
      <Field label="Tên chủ cửa hàng" name="name">
        <Input className="h-12" />
      </Field>
      <Field label="Số điện thoại" name="phone">
        <Input className="h-12" />
      </Field>
      <Form.Footer className="justify-end gap-3">
        <Button
          outline
          className="bg-white"
          text="Đổi mật khẩu"
          onClick={() => setOpenChangePassword(true)}
        />
        <Button primary className="bg-gradient" text="Lưu thay đổi" submit isLoading={submitting} />
      </Form.Footer>

      <Form
        title="Thay đổi mật khẩu"
        dialog
        isOpen={openChangepassword}
        onClose={() => setOpenChangePassword(null)}
        onSubmit={async (data) => {
          try {
            await MemberService.updateMemberPassword(member?.id, data.password);
            setOpenChangePassword(null);
            toast.success("Thay đổi mật khẩu thành công.");
          } catch (err) {
            toast.error("Thay đổi mật khẩu thất bại. " + err.message);
          }
        }}
        validatorFn={(data) => ({
          retypePassword:
            data.password != data.retypePassword ? "Mật khẩu nhập lại không trùng khớp" : "",
        })}
      >
        <Field required name="password" label="Mật khẩu mới">
          <Input type="password" />
        </Field>
        <Field required name="retypePassword" label="Nhập lại mật khẩu mới">
          <Input type="password" />
        </Field>
        <Form.Footer>
          <Form.ButtonGroup />
        </Form.Footer>
      </Form>
    </Form>
  );
}
