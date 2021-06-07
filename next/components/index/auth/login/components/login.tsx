import md5 from "md5";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
export function Login({ setMode, ...props }: PropsType) {
  const { redirectToWebapp, loginFirebaseEmail, user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const alert = useAlert();
  const router = useRouter();
  const [initialData, setInitialData] = useState({ username: "", password: "" });

  useEffect(() => {
    if (user) {
      redirectToWebapp();
    }
  }, [user]);

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    console.log(initialData);
    if (data.username && data.password) {
      await loginFirebaseEmail(data.username, data.password)
        .then((user) => {})
        .catch((err) => {
          console.error(err);
          setLoading(false);
          toast.error("Đăng nhập thất bại. " + err.message);
        });
    }
  };

  return (
    <Form initialData={initialData} className="animate-emerge" onSubmit={onFormSubmit}>
      <div className="text-center text-lg mt-5">Đăng nhập</div>
      <Field name="username" required>
        <Input className="h-12 mt-5 min-w-2xs sm:min-w-xs" autoFocus placeholder="Email" />
      </Field>
      <Field name="password" required>
        <Input className="h-12 min-w-2xs sm:min-w-xs" placeholder="Mật khẩu" type="password" />
      </Field>
      <div className="w-full flex flex-col items-center mt-2">
        <Button primary large submit className="w-full" text="Đăng nhập" isLoading={loading} />
        <div className="flex justify-center mt-2 w-full">
          <Button
            textAccent
            className="hover:underline"
            text="Quên mật khẩu"
            onClick={() => {
              setMode("recovery");
            }}
          />
        </div>
        {/* {user && (
          <Button
            textPrimary
            className="mt-4 text-sm text-center underline"
            text="Bạn đang đăng nhập Admin. Bấm vào để đến trang Admin"
            href="/admin"
          />
        )} */}
      </div>
    </Form>
  );
}
