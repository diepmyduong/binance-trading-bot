import React, { useState } from "react";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import BreadCrumbs from "../../../shared/utilities/breadcrumbs/breadcrumbs";
import { NumberPipe } from "../../../../lib/pipes/number";
import { Input } from "../../../shared/utilities/form/input";
import { Button } from "../../../shared/utilities/form/button";
import Link from "next/link";
import { useToast } from "../../../../lib/providers/toast-provider";
import { FaRegCopy, FaShare, FaShareAlt, FaWindowClose } from "react-icons/fa";
import { FbIcon, TgIcon, QRIcon, IconViber } from "../../../../public/assets/svg/svg";
import { AiOutlineClose, AiOutlineRight } from "react-icons/ai";
import QRCode from "qrcode.react";
import { Dialog } from "../../../shared/utilities/dialog/dialog";
import useDevice from "../../../../lib/hooks/useDevice";
import useScreen from "../../../../lib/hooks/useScreen";
import { HistoryDialog } from "../history/history-dialog";
import { RecommendedDialog } from "../recommended/recommended-dialog";
import {
  CollaboratorProvider,
  CollaboratorContext,
  useCollaboratorContext,
} from "../providers/collaborator-provider";
import { Spinner } from "../../../shared/utilities/spinner";

export function InfoPage() {
  const { shopCode, customer } = useShopContext();
  if (!customer) return <Spinner />;
  return (
    <CollaboratorProvider>
      <CollaboratorContext.Consumer>
        {({ colabrator }) =>
          colabrator ? (
            <div className="bg-white shadow  min-h-screen relative rounded-md w-full">
              <div className="p-4">
                <BreadCrumbs
                  breadcrumbs={[
                    { label: "Trang chủ", href: `/${shopCode}` },
                    { label: "Thông tin CTV" },
                  ]}
                  className="pb-2"
                />
                <div
                  className="flex flex-col text-white bg-no-repeat bg-cover bg-center rounded-md p-4"
                  style={{ backgroundImage: `url(/assets/img/bg-collab-card.png)` }}
                >
                  <span className="text-sm">Cộng tác viên</span>
                  <span className="font-semibold text-lg">{customer.name}</span>
                  <span className="pt-6 text-sm">Hoa hồng nhận được</span>
                  <span className="text-lg font-bold">
                    {NumberPipe(colabrator?.commissionSummary.commission || 0, true)}
                  </span>
                </div>
              </div>
              <Share link={colabrator?.collaborator.shortUrl} />
              <MenuCollaborator />
            </div>
          ) : (
            <Spinner />
          )
        }
      </CollaboratorContext.Consumer>
    </CollaboratorProvider>
  );
}
function Share({ link, ...props }: { link: string }) {
  const toast = useToast();
  let [textArea, setTextArea] = useState<any>();
  function isOS() {
    return navigator.userAgent.match(/ipad|iphone/i);
  }

  function createTextArea(text) {
    textArea = document.createElement("textArea");
    textArea.value = text;
    document.body.appendChild(textArea);
  }

  function selectText() {
    let range, selection;
    if (isOS()) {
      range = document.createRange();
      range.selectNodeContents(textArea);
      selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      textArea.setSelectionRange(0, 999999);
    } else {
      textArea.select();
    }
  }

  function copyToClipboard() {
    document.execCommand("copy");
    document.body.removeChild(textArea);
    toast.success("Đã sao chép", { position: "top-center" });
  }

  const coppyToClip = (value: string) => {
    createTextArea(value);
    selectText();
    copyToClipboard();
  };
  // const coppyToClip = (value: string) => {
  //   let listener = (e: ClipboardEvent) => {
  //     e.clipboardData.setData("text/plain", value);
  //     e.preventDefault();
  //   };
  //   document.addEventListener("copy", listener);
  //   document.execCommand("copy");
  //   toast.success("Đã sao chép");
  //   document.removeEventListener("copy", listener);
  // };
  const [showQRcode, setShowQRcode] = useState(false);
  const [showShareType, setShowShareType] = useState(false);
  const screenSm = useScreen("sm");
  return (
    <div className="px-4 py-4">
      <span className="font-semibold">Link giới thiệu:</span>
      <div className="flex mb-4 mt-1 border-group rounded-md h-12">
        <Input value={link} className="border-r-0" />
        {showShareType ? (
          <Button
            icon={<AiOutlineClose />}
            outline
            className="h-12 border-l-0 px-2"
            iconClassName="text-28"
            onClick={() => setShowShareType(false)}
          />
        ) : (
          <Button
            icon={<FaShareAlt />}
            outline
            className="h-12 border-l-0 px-2"
            iconClassName="text-28"
            onClick={() => setShowShareType(true)}
          />
        )}
      </div>
      {showShareType == true && (
        <div className="flex border-group rounded-md animate-scale-up">
          <Button
            icon={<FaRegCopy />}
            outline
            className="flex-1"
            iconClassName="text-28"
            tooltip="Sao chép"
            onClick={() => coppyToClip(link)}
          />
          <Button
            href={{ pathname: "https://www.facebook.com/sharer/sharer.php", query: { u: link } }}
            className="flex-1 text-white hover:text-white"
            icon={<FbIcon />}
            iconPosition="end"
            style={{ backgroundColor: "#4267b2" }}
            iconClassName="w-6 h-6 "
            tooltip="Chia sẻ lên facebook"
          />
          <Button
            href={{ pathname: "https://telegram.me/share/url", query: { url: link } }}
            className="flex-1 text-white hover:text-white"
            icon={<TgIcon />}
            iconPosition="end"
            style={{ backgroundColor: "#37AFE2" }}
            iconClassName="w-6 h-6 "
            tooltip="Chia sẻ lên telegram"
          />
          <Button
            href={{ pathname: "viber://forward", query: { text: link } }}
            // href={`https://3p3x.adj.st/?adjust_t=u783g1_kw9yml&adjust_fallback=https%3A%2F%2Fwww.viber.com%2F%3Futm_source%3DPartner%26utm_medium%3DSharebutton%26utm_campaign%3DDefualt&adjust_campaign=Sharebutton&adjust_deeplink=${encodeURIComponent(
            //   "viber://forward?text="
            // )}${encodeURIComponent(link + " " + window.location.href)}`}
            className="flex-1 text-white hover:text-white"
            icon={<IconViber />}
            iconPosition="end"
            style={{ backgroundColor: "#59267c" }}
            iconClassName="w-6 h-6 "
            tooltip="Chia sẻ lên viber"
          />
          <Button
            icon={<QRIcon />}
            outline
            className="flex-1"
            iconPosition="end"
            tooltip="Xem mã QR"
            iconClassName="w-6 h-6"
            onClick={() => setShowQRcode(!showQRcode)}
          />
        </div>
      )}
      <Dialog isOpen={showQRcode} onClose={() => setShowQRcode(false)} slideFromBottom="none">
        <div className="flex flex-col items-center w-full p-3">
          <QRCode value={link} size={screenSm ? 300 : 230} />
        </div>
      </Dialog>
    </div>
  );
}
function MenuCollaborator() {
  const { shopCode, customer } = useShopContext();
  const { colabrator } = useCollaboratorContext();
  const [showSelected, setShowSelected] = useState(0);
  const menu = [
    {
      label: "Lịch sử hoa hồng",
      onclick: () => setShowSelected(1),
    },
    {
      label: "Danh sách giới thiệu",
      onclick: () => setShowSelected(2),
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
          onClick={item.onclick}
          href={item.href}
          icon={<AiOutlineRight />}
          iconPosition="end"
          className="justify-between border-b px-4 h-12"
        />
      ))}
      <HistoryDialog
        isOpen={showSelected === 1}
        onClose={() => setShowSelected(0)}
        slideFromBottom="all"
        mobileSizeMode
        title={`Lịch sử hoa hồng (${colabrator.commissionSummary.order})`}
      />
      <RecommendedDialog
        isOpen={showSelected === 2}
        onClose={() => setShowSelected(0)}
        slideFromBottom="all"
        mobileSizeMode
      />
    </div>
  );
}
