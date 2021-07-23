import { onError } from "apollo-link-error";
import { useState } from "react";
import { useAuth } from "../../../lib/providers/auth-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { Button } from "../../shared/utilities/form/button";
import { Field } from "../../shared/utilities/form/field";
import { Form } from "../../shared/utilities/form/form";
import { Input } from "../../shared/utilities/form/input";
import { Img } from "../../shared/utilities/img";
import { SaveButtonGroup } from "../../shared/utilities/save-button-group";

export function AccountPage() {
  const { user, updateUser, updateUserPassword } = useAuth();
  const [data, setData] = useState(user);
  const [password, setpassword] = useState({
    old: "",
    new: "",
    renew: "",
  });
  const [openDialog, setopenDialog] = useState(false);
  const toast = useToast();
  const submitForm = (data) => {
    updateUser(data)
      .then((res) => {
        toast.success("Cập nhật thông tin thành công");
      })
      .catch((err) => {
        toast.error("Cập nhật thông tin thất bại");
      });
  };
  return (
    <div className="flex items-center justify-center w-full py-20">
      <div className="min-w-3xl bg-white shadow relative rounded-md">
        <div className="w-full flex flex-col items-center justify-center py-14">
          <div className="absolute -top-10 w-full flex justify-center">
            <Img src={user.code} avatar className="w-20 h-20" compress={200} />
          </div>
          <div className="">
            <h1 className="text-2xl font-bold text-gray-700 text-center">{user.name}</h1>
            <h3 className="text-md font-light pt-2 text-accent text-center">ID: {user.code}</h3>
          </div>
          <Form
            initialData={data}
            className="w-full"
            onSubmit={async (data) => {
              submitForm(data);
            }}
          >
            <div className="w-full pt-8 px-4 grid grid-cols-2 gap-x-4">
              <Field label="Họ và Tên" name="name">
                <Input defaultValue="Lê Huỳnh Thảo Nguyên" className=" border-gray-300" />
              </Field>
              <Field label="Số điện thoại" name="phone">
                <Input defaultValue="032 77 33 883" className=" border-gray-300" type="number" />
              </Field>
              <Field label="Email" name="email">
                <Input
                  defaultValue="lamquangvinh33@gmail.com"
                  className=" border-gray-300"
                  type="email"
                />
              </Field>

              <div className="w-full flex justify-start items-center">
                <Button
                  text="Đổi mật khẩu"
                  textAccent
                  small
                  className="font-bold"
                  onClick={() => {
                    setopenDialog(true);
                  }}
                ></Button>
              </div>
            </div>
            <div className=" w-full px-4">
              <SaveButtonGroup />
            </div>
          </Form>
          <Form
            initialData={password}
            dialog
            isOpen={openDialog}
            width={"550px"}
            onSubmit={(data) => {
              if (data.new == data.renew) {
                updateUserPassword(user.id, data.new)
                  .then((res) => {
                    toast.success("Đổi mật khẩu thành công");
                    setopenDialog(false);
                  })
                  .catch((err) => {
                    toast.error("Đổi mật khẩu thất bại");
                  });
              } else {
                toast.error("Mật khẩu nhập không khớp");
              }
            }}
            onClose={() => setopenDialog(false)}
          >
            <Field label="Nhập mật khẩu mới" name="new">
              <Input className=" border-gray-300" type="password" />
            </Field>
            <Field label="Nhập lại mật khẩu mới" name="renew">
              <Input className=" border-gray-300" type="password" />
            </Field>
            <SaveButtonGroup />
          </Form>
        </div>
      </div>
    </div>
  );
}
