import { useEffect } from "react";

import { Footer } from "../../../layouts/admin-layout/components/footer";
import { useAuth } from "../../../lib/providers/auth-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { Button } from "../../shared/utilities/form/button";
import { Field } from "../../shared/utilities/form/field";
import { Form, FormConsumer } from "../../shared/utilities/form/form";
import { Input } from "../../shared/utilities/form/input";
import { Spinner } from "../../shared/utilities/spinner";

export function LoginPage() {
  const { user, loginFirebaseEmail, redirectToAdmin } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (user) {
      console.log("has yser", user);
      redirectToAdmin();
    }
  }, [user]);

  const login = async ({ username, password }) => {
    if (username && password) {
      await loginFirebaseEmail(username, password)
        .then((user) => {})
        .catch((err) => {
          console.error(err);
          toast.error("Đăng nhập thất bại. " + err.message);
        });
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(/assets/img/admin-background.jpg)` }}
    >
      <div className="w-screen flex-1 flex items-center justify-center">
        {user !== null ? (
          <Spinner />
        ) : (
          <Form
            className="bg-white shadow-xl p-6 w-5/12 max-w-screen-xs flex flex-col"
            onSubmit={async (data) => {
              await login(data);
            }}
          >
            <img className="h-auto py-6 w-24 mx-auto" src="/assets/img/logo-som.png" />
            <h2 className="text-xl text-center font-semibold text-gray-700 mb-4 uppercase">
              Đăng nhập Admin
            </h2>
            <Field className="mb-1" name="username" required>
              <Input className="h-14" placeholder="Email / Tên đăng nhập" autoFocus />
            </Field>
            <Field className="mb-1" name="password" required>
              <Input className="h-14" type="password" placeholder="Mật khẩu" />
            </Field>
            <FormConsumer>
              {({ loading }) => (
                <>
                  <Button
                    submit
                    primary
                    className="h-14 bg-gradient"
                    text="Đăng nhập quản trị"
                    isLoading={loading}
                  />
                </>
              )}
            </FormConsumer>
          </Form>
        )}
      </div>
      <Footer className="text-primary-light border-none" />
    </div>
  );
}
