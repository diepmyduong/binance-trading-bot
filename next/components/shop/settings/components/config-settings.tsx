import { useEffect, useRef, useState } from "react";
import { RiStarFill } from "react-icons/ri";
import { useShopLayoutContext } from "../../../../layouts/shop-layout/providers/shop-layout-provider";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { Button } from "../../../shared/utilities/form/button";
import { Field } from "../../../shared/utilities/form/field";
import { Form } from "../../../shared/utilities/form/form";
import { ImageInput } from "../../../shared/utilities/form/image-input";
import { Input } from "../../../shared/utilities/form/input";
import { Img } from "../../../shared/utilities/img";
import { AvatarUploader } from "../../../shared/utilities/uploader/avatar-uploader";

export function ConfigSettings() {
  const { shopConfig, updateShopConfig } = useShopLayoutContext();
  const [submitting, setSubmitting] = useState(false);
  const [starRating, setStarRating] = useState<number>();

  useEffect(() => {
    setStarRating(shopConfig.rating);
    console.log(shopConfig);
  }, [shopConfig]);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      await updateShopConfig(data);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form initialData={shopConfig} className="max-w-screen-sm animate-emerge" onSubmit={onSubmit}>
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
                if (rest > 1) {
                  width = "100%";
                } else if (rest > 0) {
                  let pecent = rest * 100 + 5;
                  width = (pecent > 100 ? 100 : pecent) + "%";
                }
                return (
                  <div className="mr-2 relative" key={star}>
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
      <Field label="Số lượng người đã mua hàng" name="soldQty">
        <Input className="h-12" number suffix="người đã mua hàng" />
      </Field>
      <Field label="Số lượng người đã đánh giá" name="ratingQty">
        <Input className="h-12" number suffix="người đã đánh giá" />
      </Field>
      {/* <Field
        label="Danh sách tag đánh giá"
        description="Nhập Emoji bằng tổ hợp [Windows + .] hoặc [Control + Command + Spacebar] trên Mac"
      >
        <Input
          multi
          className="min-h-12 inline-grid"
          value={["😍 Phục vụ thân thiện (42)", "😋 Món ngon (27)", "💰 Giá tốt (19)"]}
        />
      </Field> */}
      <Form.Footer className="justify-end gap-3">
        <Button primary className="bg-gradient" text="Lưu thay đổi" submit isLoading={submitting} />
      </Form.Footer>
    </Form>
  );
}
