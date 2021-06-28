import { useEffect } from "react";

import { Footer } from "../../../layouts/admin-layout/components/footer";
import { useAuth } from "../../../lib/providers/auth-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { Button } from "../../shared/utilities/form/button";
import { Field } from "../../shared/utilities/form/field";
import { Form, FormConsumer } from "../../shared/utilities/form/form";
import { Input } from "../../shared/utilities/form/input";
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

  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-screen flex-1 flex items-center justify-center">
        {member !== null ? (
          <Spinner />
        ) : (
          <Form
            className="bg-white shadow-xl p-6 w-5/12 max-w-screen-xs flex flex-col"
            onSubmit={async (data) => {
              await login(data);
            }}
          >
            <img className="h-auto my-6 mx-auto w-32" src="/assets/img/logo-som.png" />
            <h2 className="text-2xl text-center font-semibold text-primary uppercase mt-2 mb-6">
              Đăng nhập
            </h2>
            <Field className="mb-1" name="username" required>
              <Input className="h-12" placeholder="Email đăng nhập" autoFocus />
            </Field>
            <Field className="mb-1" name="password" required>
              <Input className="h-12" type="password" placeholder="Mật khẩu" />
            </Field>
            <FormConsumer>
              {({ loading }) => (
                <>
                  <Button
                    submit
                    primary
                    className="h-12"
                    text="Đăng nhập quản trị"
                    isLoading={loading}
                  />
                </>
              )}
            </FormConsumer>
          </Form>
        )}
      </div>
      <Footer />
    </div>
  );
}
