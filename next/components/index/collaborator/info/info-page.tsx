import React, { useState } from "react";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import BreadCrumbs from "../../../shared/utilities/breadcrumbs/breadcrumbs";
import { NumberPipe } from "../../../../lib/pipes/number";
import { Input } from "../../../shared/utilities/form/input";
import { Button } from "../../../shared/utilities/form/button";
import Link from "next/link";
import { useToast } from "../../../../lib/providers/toast-provider";
import { FaRegCopy } from "react-icons/fa";
import { FbIcon, TgIcon, QRIcon } from "../../../../public/assets/svg/svg";
import { AiOutlineRight } from "react-icons/ai";
import QRCode from "qrcode.react";
import { Dialog } from "../../../shared/utilities/dialog/dialog";
import useDevice from "../../../../lib/hooks/useDevice";
import useScreen from "../../../../lib/hooks/useScreen";

export function InfoPage() {
  const { shopCode, customer } = useShopContext();
  return (
    <div className="bg-white shadow  min-h-screen  relative rounded-md w-full">
      <div className="p-4 bg-gradient-to-t from-accent to-primary-light">
        <BreadCrumbs
          breadcrumbs={[{ label: "Trang chủ", href: `/${shopCode}` }, { label: "Thông tin CTV" }]}
          className="pb-4"
          light
        />
        <div className="flex flex-col items-center text-white">
          <span className="pt-6 text-sm">Cộng tác viên</span>
          <span className="font-semibold text-lg">{customer.name}</span>
          <span className="pt-6 text-sm">Hoa hồng nhận được</span>
          <span className="text-primary-dark text-xl font-bold pb-2">
            {NumberPipe(123123123, true)}
          </span>
        </div>
      </div>
      <Share link={customer.collaborator.shortUrl} />
      <MenuCollaborator />
    </div>
  );
}
function Share({ link, ...props }: { link: string }) {
  const toast = useToast();
  const coppyToClip = () => {
    let listener = (e: ClipboardEvent) => {
      e.clipboardData.setData("text/plain", link);
      e.preventDefault();
    };
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    toast.success("Đã sao chép");
    document.removeEventListener("copy", listener);
  };
  const [showQRcode, setShowQRcode] = useState(false);
  const screenSm = useScreen("sm");
  return (
    <div className="px-4 py-6">
      <span className="font-semibold">Link giới thiệu:</span>
      <div className="flex mb-4 mt-1 border-group rounded-sm h-12">
        <Input value={link} />
        <Button
          icon={<FaRegCopy />}
          outline
          className="h-12"
          iconClassName="text-28"
          onClick={() => coppyToClip()}
        />
      </div>
      {!screenSm && <span className="font-semibold">Chia sẻ với</span>}
      <div className="flex border-group rounded-sm">
        <Button
          href={{ pathname: "https://www.facebook.com/sharer/sharer.php", query: { u: link } }}
          text={screenSm ? "Chia sẻ" : ""}
          className="flex-1"
          info
          icon={<FbIcon />}
          iconPosition="end"
          iconClassName="w-6 h-6"
          tooltip="Chia sẻ lên facebook"
        />
        <Button
          href={{ pathname: "https://telegram.me/share/url", query: { url: link } }}
          text={screenSm ? "Chia sẻ" : ""}
          className="flex-1 bg-blue-300 hover:bg-blue-600 text-white hover:text-white"
          icon={<TgIcon />}
          iconPosition="end"
          iconClassName="w-6 h-6 text-white hover:text-white"
          tooltip="Chia sẻ lên telegram"
        />
        <Button
          text={screenSm ? "Mã QR" : ""}
          icon={<QRIcon />}
          outline
          className="flex-1"
          iconPosition="end"
          tooltip="Xem mã QR"
          iconClassName="w-6 h-6"
          onClick={() => setShowQRcode(!showQRcode)}
        />
      </div>
      <Dialog isOpen={showQRcode} onClose={() => setShowQRcode(false)} slideFromBottom="none">
        <div className="flex flex-col items-center w-full p-3">
          <QRCode value={link} size={screenSm ? 230 : 300} />
        </div>
      </Dialog>
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
    <div className="flex flex-col border-t">
      {menu.map((item) => (
        <Button
          key={item.label}
          text={item.label}
          href={item.href}
          icon={<AiOutlineRight />}
          iconPosition="end"
          className="justify-between border-b px-4 h-12"
        />
      ))}
    </div>
  );
}
