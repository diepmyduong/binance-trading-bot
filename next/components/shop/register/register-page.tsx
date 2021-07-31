import { useEffect, useState } from "react";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { Footer } from "../../../layouts/admin-layout/components/footer";
import { useAuth } from "../../../lib/providers/auth-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { ShopRegistrationService } from "../../../lib/repo/shop-registration.repo";
import { Dialog } from "../../shared/utilities/dialog/dialog";
import { Button } from "../../shared/utilities/form/button";
import { Field } from "../../shared/utilities/form/field";
import { Form, FormConsumer } from "../../shared/utilities/form/form";
import { FormValidator } from "../../shared/utilities/form/form-validator";
import { Input } from "../../shared/utilities/form/input";
import { Label } from "../../shared/utilities/form/label";
import { Spinner } from "../../shared/utilities/spinner";

export function ShopRegisterPage() {
  const { member, checkMember, redirectToShop } = useAuth();
  const [success, setSuccess] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (member === undefined) {
      checkMember();
    } else if (member) {
      redirectToShop();
    }
  }, [member]);

  const register = async ({ shopName, shopCode, email, phone, name }) => {
    if (shopName && shopCode && email && phone) {
      await ShopRegistrationService.create({
        data: { shopName, name, shopCode, email, phone },
      })
        .then((user) => {
          setSuccess(true);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Đăng ký thất bại. " + err.message);
        });
    }
  };

  if (member !== null) return <Spinner />;
  if (success)
    return (
      <div
        className="flex flex-col min-h-screen bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(/assets/img/register-success-background.jpg)` }}
      >
        <Dialog isOpen={true} extraDialogClass="flex flex-col items-center p-10">
          <h3 className="font-semibold text-primary uppercase text-2xl">Đăng ký thành công</h3>
          <img className="w-48" src="/assets/img/register-success.png" />
          <div className="text-lg text-gray-700 mt-8 mb-4 text-center">
            Bạn đã đăng ký tài khoản thành công! <br />
            Vui lòng đợi phản hồi kích hoạt từ 3M Marketing
          </div>
          <Button
            className="bg-gradient px-20 h-14"
            primary
            text="Về trang đăng nhập"
            href="/shop/login"
          />
        </Dialog>
      </div>
    );
  else
    return (
      <div
        className="flex flex-col min-h-screen bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(/assets/img/register-background.jpg)` }}
      >
        <div className="w-full flex-1 flex items-center justify-evenly px-32 gap-x-16">
          <div className="flex-1 text-left flex flex-col items-start">
            <img className="h-auto w-32" src="/assets/img/logo-som.png" />
            {REGISTER_INFOS.map((info) => (
              <div className="mt-8 text-lg" key={info.title}>
                <h6 className="flex text-primary font-semibold items-center mb-1">
                  <i>
                    <RiCheckboxCircleFill />
                  </i>
                  {info.title}
                </h6>
                <p className="text-gray-700">{info.content}</p>
              </div>
            ))}
          </div>
          <Form
            className="w-5/12 max-w-screen-xs flex flex-col mb-6"
            onSubmit={async (data) => {
              await register(data);
            }}
          >
            <img className="h-auto my-6 mx-auto w-20" src="/assets/img/logo-som.png" />
            <h2 className="text-2xl text-center font-semibold text-primary uppercase mt-2 mb-6">
              Đăng ký
            </h2>
            <Label className="mb-3 text-base" text="Tên cửa hàng" />
            <Field className="mb-1" name="shopName" required>
              <Input
                className="h-14 shadow-md rounded-md border-0"
                placeholder="Tên hiển thị cửa hàng"
                autoFocus
              />
            </Field>
            <Label className="mb-3 text-base" text="Mã cửa hàng" />
            <Field
              className="mb-1"
              name="shopCode"
              required
              validate={async (value) =>
                !/^[a-zA-Z0-9]+(?:[_a-zA-Z0-9]+)*$/.test(value)
                  ? "Chỉ gồm chữ hoa, số và dấu gạch dưới"
                  : ""
              }
            >
              <Input
                className="h-14 shadow-md rounded-md border-0"
                placeholder="Mã cửa hàng (Viết liền không dấu, gồm số, chữ in hoa và dấu gạch dưới nếu có)"
                autoFocus
              />
            </Field>
            <Label className="mb-3 text-base" text="Email cửa hàng" />
            <Field className="mb-1" name="email" required>
              <Input
                className="h-14 shadow-md rounded-md border-0"
                placeholder="Email dùng để đăng nhập"
                autoFocus
              />
            </Field>
            <Label className="mb-3 text-base" text="Tên người đại diện" />
            <Field className="mb-1" name="name" required>
              <Input
                className="h-14 shadow-md rounded-md border-0"
                placeholder="Người đại diện cửa hàng"
                autoFocus
              />
            </Field>
            <Label className="mb-3 text-base" text="Số điện thoại cửa hàng" />
            <Field className="mb-1" name="phone" required>
              <Input
                className="h-14 shadow-md rounded-md border-0"
                placeholder="Số điện thoại liên hệ"
                autoFocus
              />
            </Field>
            <FormConsumer>
              {({ loading }) => (
                <>
                  <Button
                    submit
                    primary
                    className="mt-4 h-14 bg-gradient shadow"
                    text="Đăng ký cửa hàng"
                    isLoading={loading}
                  />
                </>
              )}
            </FormConsumer>
          </Form>
        </div>
        <Footer />
      </div>
    );
}

const REGISTER_INFOS = [
  {
    title: "Thiết lập nhanh chóng",
    content:
      "Hoàn thiện thông tin về Điểm kinh doanh, Biểu giả vận chuyển, Món, Kết nối thiết bị bahana là bạn đã sẵn sàng kinh doanh.",
  },
  {
    title: "Trải nghiệm chuyên nghiệp",
    content:
      "Tùy biến ứng dụng đặt đồ ăn với nhiều hiệu chính đặc biệt giúp tạo dầu ân thương hiệu tạo trải nghiệm gọi món thân thiện và tối ưu hiệu suất kinh doanh.",
  },
  {
    title: "Vận hành tinh gọn",
    content:
      "Thông báo trực tiếp đến cửa hàng ngày khi khách hàng đặt món, đồng bộ xử lý số lượng lớn đơn hàng tại cùng một thời điểm và dễ dàng gọi dịch vụ vận chuyển trong vài thao tác",
  },
];
