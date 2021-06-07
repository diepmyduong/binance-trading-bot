import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Footer } from "../../../../layouts/admin-layout/components/footer";
import { useAlert } from "../../../../lib/providers/alert-provider";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { Button } from "../../../shared/utilities/form/button";
import { Field } from "../../../shared/utilities/form/field";
import { Form } from "../../../shared/utilities/form/form";
import { Input } from "../../../shared/utilities/form/input";
import { Spinner } from "../../../shared/utilities/spinner";

export function ActivePage() {
  const router = useRouter();
  const alert = useAlert();
  const toast = useToast();
  const [sig, setSig] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const [initialData, setInitialData] = useState({ password: "", retypePassword: "" });

  const onFormSubmit = async (data) => {
    setLoading(true);
  };

  return (
    <>
      {!user ? (
        <Spinner />
      ) : (
        <div className="flex flex-col min-h-screen">
          <div className="w-screen flex-1 bg-center bg-no-repeat bg-cover flex-center">
            <Form
              initialData={initialData}
              className="bg-white shadow-lg rounded-sm max-w-md w-11/12 sm:w-2/3 flex flex-col items-center p-4 sm:p-8 border border-gray-200"
              onSubmit={onFormSubmit}
              validatorFn={(data) => ({
                retypePassword: data.password != data.retypePassword ? "Mật khẩu nhập lại sai" : "",
              })}
            >
              <Link href="/">
                <a className="">
                  <img src="/assets/img/logo.svg/" className="w-40" />
                </a>
              </Link>
              <div className="text-gray-600 font-semibold text-center text-xl mt-6 my-4">
                Kích hoạt hội viên
              </div>
              <Field className="w-full" name="password" required>
                <Input
                  className="w-full mt-5 h-12 sm:min-w-xs"
                  type="password"
                  placeholder="Mật khẩu"
                />
              </Field>
              <Field className="w-full" name="retypePassword" required>
                <Input
                  className="w-full h-12 mt-1 sm:min-w-xs"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                />
              </Field>
              <div className="flex w-full mt-2 mb-4">
                <Button
                  className="w-full"
                  large
                  primary
                  submit
                  text="Kích hoạt"
                  isLoading={loading}
                />
              </div>
            </Form>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}
