import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RiExternalLinkLine, RiStarFill } from "react-icons/ri";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { Button } from "../../../shared/utilities/form/button";
import { Field } from "../../../shared/utilities/form/field";
import { Form } from "../../../shared/utilities/form/form";
import { ImageInput } from "../../../shared/utilities/form/image-input";
import { Input } from "../../../shared/utilities/form/input";
import { Label } from "../../../shared/utilities/form/label";
import { Img } from "../../../shared/utilities/img";
import { AvatarUploader } from "../../../shared/utilities/uploader/avatar-uploader";

export function GeneralSettings() {
  const { member, memberUpdateMe } = useAuth();
  const avatarUploaderRef = useRef<any>();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingMemberAvatar, setUploadingMemberAvatar] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const onSubmit = async (data) => {
    // await memberUpdateMe({
    // shopLogo:
    //   "https://3mmarketing.vn/wp-content/uploads/2021/04/54435386_403746057122362_985545898937286656_n.png",
    //   shopLogo: "https://i.imgur.com/ty11Eu1.jpeg",
    // });
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

  const onAvatarChange = async (image: string) => {
    try {
      setUploadingMemberAvatar(true);
      await memberUpdateMe({ shopLogo: image });
      toast.success("Cập nhật ảnh đại diện cửa hàng thành công");
    } catch (err) {
      toast.error("Cập nhật ảnh đại diện cửa hàng thất bại. " + err.message);
    } finally {
      setUploadingMemberAvatar(false);
    }
  };

  return (
    <Form initialData={member} className="max-w-screen-sm animate-emerge" onSubmit={onSubmit}>
      <div className="flex items-center my-6">
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
      <Label text="Link cửa hàng" />
      <Link href={`${location.origin}/${member.code}`}>
        <a
          target="_blank"
          className="pb-3 pt-1 pl-1 flex items-center font-semibold text-primary hover:text-primary-dark hover:underline"
        >
          {`${location.origin}/${member.code}`}
          <i className="ml-2 text-base">
            <RiExternalLinkLine />
          </i>
        </a>
      </Link>
      <Field label="Tên cửa hàng" name="shopName">
        <Input className="h-12" />
      </Field>
      <Field label="Ảnh nền cửa hàng" name="shopCover">
        <ImageInput cover largeImage ratio169 inputClassName="h-12" buttonClassName="h-12" />
      </Field>
      <Form.Footer className="justify-end gap-3">
        <Button
          primary
          className="bg-gradient h-12 px-12"
          text="Lưu thay đổi"
          submit
          isLoading={submitting}
        />
      </Form.Footer>
    </Form>
  );
}
