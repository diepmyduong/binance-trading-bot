import React, { useState } from "react";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import BreadCrumbs from "../../../shared/utilities/breadcrumbs/breadcrumbs";
import { NumberPipe } from "../../../../lib/pipes/number";
import { Input } from "../../../shared/utilities/form/input";
import { Button } from "../../../shared/utilities/form/button";
import Link from "next/link";
import { useToast } from "../../../../lib/providers/toast-provider";
import { FaRegCopy } from "react-icons/fa";
import { FbIcon } from "../../../../public/assets/svg/svg";
import { HiArrowRight } from "react-icons/hi";

export function InfoPage() {
  const { shopCode, customer } = useShopContext();
  return (
    <div className="bg-white shadow  min-h-screen  relative rounded-md w-full">
      <div className="p-4 bg-gradient-to-t from-accent to-primary">
        <BreadCrumbs
          breadcrumbs={[{ label: "Trang chủ", href: `/${shopCode}` }, { label: "Thông tin CTV" }]}
          className="pb-4"
        />
        <div className="flex flex-col items-center text-white">
          <span className="pt-6 text-sm">Cộng tác viên</span>
          <span className="font-semibold text-lg">{customer.name}</span>
          <span className="pt-6 text-sm">Hoa hồng nhận được</span>
          <span className="text-success-dark text-xl font-bold pb-2">
            {NumberPipe(123123123, true)}
          </span>
        </div>
      </div>
      <Share link={customer.collaborator.shortUrl} />
    </div>
  );
}
function Share({ link, ...props }: { link: string }) {
  const toast = useToast();
  const [showShareType, setShowShareType] = useState(false);
  const coppyToClip = () => {
    let listener = (e: ClipboardEvent) => {
      e.clipboardData.setData("text/plain", link);
      e.preventDefault();
    };
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    toast.success("Đã sao chép", { position: "top-center" });
    document.removeEventListener("copy", listener);
  };
  return (
    <div className="p-4">
      <span>Link giới thiệu:</span>
      <div className="flex items-center h-12 pt-2">
        <Input value={link} readonly className="h-12" />
        <Button
          text={showShareType ? "Xong" : "Chia sẻ"}
          className="whitespace-nowrap"
          onClick={() => setShowShareType(!showShareType)}
        />
      </div>
      {/* <div>
        <Button
          icon={<FaRegCopy />}
          className=""
          iconClassName="text-28"
          onClick={() => coppyToClip()}
        />
        <Link href={{ pathname: "https://www.facebook.com/sharer/sharer.php", query: { u: link } }}>
          <a target="_blank" className="w-10 h-10">
            <FbIcon />
          </a>
        </Link>
      </div> */}
      <MenuCollaborator />
    </div>
  );
}
function MenuCollaborator() {
  const { shopCode } = useShopContext();
  const menu = [
    {
      label: "Lịch sử hoa hồng",
      href: `/${shopCode}/collaborator/history`,
    },
    {
      label: "Danh sách giới thiệu",
      href: `/${shopCode}/collaborator/history`,
    },
    {
      label: "Gọi cho chủ shop",
      href: `tel:123123123123`,
    },
  ];
  return (
    <div className="flex flex-col">
      {menu.map((item) => (
        <Button text={item.label} icon={<HiArrowRight />} iconPosition="end" />
      ))}
    </div>
  );
}
