import { useEffect, useRef, useState } from "react";
import { RiStarFill } from "react-icons/ri";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { Button } from "../../../shared/utilities/form/button";
import { Field } from "../../../shared/utilities/form/field";
import { Form } from "../../../shared/utilities/form/form";
import { Input } from "../../../shared/utilities/form/input";
import { Img } from "../../../shared/utilities/img";
import { AvatarUploader } from "../../../shared/utilities/uploader/avatar-uploader";

export function GeneralSettings() {
  const { member, memberUpdateMe } = useAuth();
  const avatarUploaderRef = useRef<any>();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingMemberAvatar, setUploadingMemberAvatar] = useState(false);
  const [starRating, setStarRating] = useState<number>(4.7);
  const toast = useToast();

  useEffect(() => {
    // setStarRating(member.s)
  }, [member]);

  const onAvatarChange = async (image: string) => {
    try {
      setUploadingMemberAvatar(true);
      await memberUpdateMe({ image });
      toast.success("Cập nhật ảnh đại diện cửa hàng thành công");
    } catch (err) {
      toast.success("Cập nhật ảnh đại diện cửa hàng thất bại. " + err.message);
    } finally {
      setUploadingMemberAvatar(false);
    }
  };

  return (
    <Form initialData={member} className="max-w-screen-sm">
      <div className="text-gray-400 font-semibold mt-6 mb-4 pl-1 text-lg">Thông tin cơ bản</div>
      <div className="flex items-center mb-4">
        <Img className="w-14" src={member.shopLogo} avatar />
        <div className="pl-3">
          <div className="font-bold text-lg text-gray-700">{member.shopName}</div>
          <Button
            className="h-auto px-0 text-sm hover:underline"
            textPrimary
            text="Đổi hình đại diện"
            isLoading={uploadingAvatar || uploadingMemberAvatar}
            onClick={() => {
              avatarUploaderRef.current().onClick();
            }}
          />
          <AvatarUploader
            onRef={(ref) => {
              avatarUploaderRef.current = ref;
            }}
            onUploadingChange={setUploadingAvatar}
            onImageUploaded={onAvatarChange}
          />
        </div>
      </div>
      <Field label="Tên cửa hàng" name="shopName">
        <Input className="h-12" />
      </Field>
      <Field label="Hotline cửa hàng" name="shopHotline">
        <Input className="h-12" />
      </Field>
      <Field label="Ghi chú cho shipper lấy hàng" name="shopShipperNote">
        <Input className="h-12" />
      </Field>
      <div className="text-gray-400 font-semibold mt-4 mb-4 pl-1 text-lg">Đánh giá của quán</div>
      <Field label="Đánh giá sao trung bình" constraints={{ min: 0, max: 5 }}>
        <Input
          className="h-12"
          number
          decimal
          value={starRating}
          onChange={(val, extraVal) => setStarRating(extraVal)}
          suffix={
            <div className="flex mr-2">
              {[1, 2, 3, 4, 5].map((star) => {
                let width = "0";
                const rest = starRating - star;
                console.log(starRating, star, rest);
                if (rest > 1) {
                  width = "100%";
                } else if (rest > 0) {
                  let pecent = rest * 100 + 5;
                  width = (pecent > 100 ? 100 : pecent) + "%";
                }
                return (
                  <div className="mr-2 relative">
                    <i className="text-xl text-gray-400">
                      <RiStarFill />
                    </i>
                    <i
                      className="absolute top-0 left-0 h-full text-xl text-yellow-400 overflow-hidden"
                      style={{ width }}
                    >
                      <RiStarFill />
                    </i>
                  </div>
                );
              })}
            </div>
          }
        />
      </Field>
      <Field label="Số lượng người đã mua hàng">
        <Input className="h-12" number suffix="người đã mua hàng" />
      </Field>
      <Field label="Số lượng người đã đánh giá">
        <Input className="h-12" number suffix="người đã đánh giá" />
      </Field>
      <Field
        label="Danh sách tag đánh giá"
        description="Nhập Emoji bằng tổ hợp [Windows + .] hoặc [Control + Command + Spacebar] trên Mac"
      >
        <Input
          multi
          className="h-12 inline-grid"
          value={["😍 Phục vụ thân thiện (42)", "😋 Món ngon (27)", "💰 Giá tốt (19)"]}
        />
      </Field>
    </Form>
  );
}
