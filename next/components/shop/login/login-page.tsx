import Link from "next/link";
import { useEffect } from "react";

import { Footer } from "../../../layouts/admin-layout/components/footer";
import { useAuth } from "../../../lib/providers/auth-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { Button } from "../../shared/utilities/form/button";
import { Field } from "../../shared/utilities/form/field";
import { Form, FormConsumer } from "../../shared/utilities/form/form";
import { Input } from "../../shared/utilities/form/input";
import { Label } from "../../shared/utilities/form/label";
import { Spinner } from "../../shared/utilities/spinner";

export default function ShopLoginPage() {
  const { member, checkMember, loginMemberByPassword, redirectToShop } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (member === undefined) {
      checkMember();
    } else if (member) {
      redirectToShop();
    }
  }, [member]);

  const login = async ({ username, password }) => {
    if (username && password) {
      await loginMemberByPassword(username, password)
        .then((user) => {})
        .catch((err) => {
          console.error(err);
          toast.error("Đăng nhập thất bại. " + err.message);
        });
    }
  };

  if (member !== null) return <Spinner />;
  return (
    <div
      className="flex flex-col min-h-screen bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(/assets/img/login-background.jpg)` }}
    >
      <div className="w-screen flex-1 flex items-center justify-start">
        <Form
          className="w-5/12 max-w-screen-xs flex flex-col ml-40 h-screen"
          onSubmit={async (data) => {
            await login(data);
          }}
        >
          <img className="h-auto my-6 mx-auto w-32 mt-auto" src="/assets/img/logo-som.png" />
          <h2 className="text-2xl text-center font-semibold text-primary uppercase mt-2 mb-6">
            Đăng nhập
          </h2>
          <Label className="mb-3 text-base" text="Email đăng nhập" />
          <Field className="mb-1" name="username" required>
            <Input
              className="h-14 shadow-md rounded-md border-0"
              placeholder="Email đăng nhập"
              autoFocus
            />
          </Field>
          <Label className="mb-3 text-base" text="Mật khẩu" />
          <Field className="mb-1" name="password" required>
            <Input
              className="h-14 shadow-md rounded-md border-0"
              type="password"
              placeholder="Mật khẩu"
            />
          </Field>
          <FormConsumer>
            {({ loading }) => (
              <>
                <Button
                  submit
                  primary
                  className="mt-4 h-14 bg-gradient shadow"
                  text="Đăng nhập cửa hàng"
                  isLoading={loading}
                />
              </>
            )}
          </FormConsumer>
          <div className="text-lg text-gray-700 font-semibold text-center mt-6">
            Bạn chưa có tài khoản?{" "}
            <Link href="/shop/register">
              <a className="cursor-pointer text-primary hover:text-primary-dark hover:underline">
                Đăng ký ngay
              </a>
            </Link>
          </div>
          <Footer className="mt-auto border-gray-400" />
        </Form>
      </div>
    </div>
  );
}
