import React, { useState } from "react";
import BreadCrumbs from "../../../shared/utilities/breadcrumbs/breadcrumbs";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { Checkbox } from "../../../shared/utilities/form/checkbox";
import { Button } from "../../../shared/utilities/form/button";
import { CollaboratorService } from "../../../../lib/repo/collaborator.repo";
import { useRouter } from "next/router";
import { useToast } from "../../../../lib/providers/toast-provider";

export function RegisterPage() {
  const { shopCode } = useShopContext();
  const [confirm, setConfirm] = useState(true);
  const router = useRouter();
  const toast = useToast();
  async function regisCollab() {
    CollaboratorService.regisCollaborator()
      .then((res) => {
        toast.success("Đăng ký thành công");
        router.replace(`/${shopCode}/collaborator/info`);
      })
      .catch((err) => toast.success("Đăng ký thất bại. Đã xảy ra lỗi trong quá trình đăng ký."));
  }
  return (
    <div className="bg-white shadow  min-h-screen  relative rounded-md w-full">
      <div className="px-4 min-h-screen">
        <BreadCrumbs
          breadcrumbs={[{ label: "Trang chủ", href: `/${shopCode}` }, { label: "Đăng ký CTV" }]}
          className="pt-4"
        />
        <h2 className=" text-28 font-semibold py-2 pt-4">Điều khoản dịch vụ</h2>
        <p>Nội dung đang được soạn thảo</p>
      </div>
      <div className="flex flex-col p-4 pt-2 border-t-2 sticky bottom-0 bg-white">
        <Checkbox
          placeholder="Tôi đồng ý với điều khoản"
          defaultValue={confirm}
          onChange={(val) => setConfirm(val)}
        />
        <Button
          text="Đăng ký"
          primary
          className="bg-gradient"
          large
          disabled={!confirm}
          onClick={async () => await regisCollab()}
        />
      </div>
    </div>
  );
}
