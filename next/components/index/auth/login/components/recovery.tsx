import { useRouter } from "next/router";
import { useState } from "react";
import { useAlert } from "../../../../../lib/providers/alert-provider";
import { useAuth } from "../../../../../lib/providers/auth-provider";
import { useToast } from "../../../../../lib/providers/toast-provider";
import { Button } from "../../../../shared/utilities/form/button";
import { Field } from "../../../../shared/utilities/form/field";
import { Form } from "../../../../shared/utilities/form/form";
import { Input } from "../../../../shared/utilities/form/input";
interface PropsType extends ReactProps {
  setMode?: Function;
}
export function Recovery(props: PropsType) {
  const { resetPasswordFirebaseEmail, user } = useAuth();
  const toast = useToast();
  const alert = useAlert();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState({ email: "" });
  const onFormSubmit = async (data) => {
    setLoading(true);
    console.log("data", data);
    resetPasswordFirebaseEmail(data.email)
      .then((res) => {
        alert
          .success(
            "Email khôi phục mật khẩu đã được gửi.",
            "Vui lòng kiểm tra hộp thư đến của bạn",
            "Xác nhận"
          )
          .then(() => {
            props.setMode("login");
          });
      })
      .catch((err) => {
        alert.error(`Gửi email khổi phục thất bại. ${err.message}`);
      });
  };
  return (
    <Form
      initialData={initialData}
      className="flex flex-col items-center animate-emerge"
      disabled={loading}
      onSubmit={onFormSubmit}
    >
      <div className=" text-center text-lg mt-5">Đặt lại mật khẩu</div>
      <Field name="email" required>
        <Input
          className="h-12 mt-5 min-w-2xs sm:min-w-xs"
          placeholder="Nhập Email hoặc Số điện thoại"
        />
      </Field>
      <div className="w-full flex flex-col items-center mt-2">
        <Button
          primary
          large
          submit
          className="w-full uppercase"
          text="Yêu cầu đổi mật khẩu"
          isLoading={loading}
        />
        <div className="flex justify-center mt-2 w-full">
          <Button
            className="hover:underline"
            text="Quay lại đăng nhập"
            onClick={() => props.setMode("login")}
          />
        </div>
      </div>
    </Form>
  );
}
