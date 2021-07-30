import React, { useState } from "react";
import { DialogPropsType, Dialog } from "../../../shared/utilities/dialog/dialog";
import formatDate from "date-fns/format";
import { NumberPipe } from "../../../../lib/pipes/number";
import useScreen from "../../../../lib/hooks/useScreen";
import useDevice from "../../../../lib/hooks/useDevice";

interface HistoryDialogProps extends DialogPropsType {}
export function HistoryDialog(props: HistoryDialogProps) {
  let screenSm = useScreen("sm");
  const { isMobile } = useDevice();
  return (
    <Dialog {...props}>
      <div
        className={`bg-white shadow relative rounded-md w-full v-scrollbar ${
          isMobile ? "pb-12" : ""
        }`}
        style={{ maxHeight: `calc(96vh - 150px)`, minHeight: `calc(96vh - 350px)` }}
      >
        {listCommision.map((item, index) => (
          <div key={index} className="px-4 py-2 border-b flex items-center justify-between">
            <div>
              <span>
                <span>{formatDate(new Date(), "dd-MM-yyyy hh:mm")}</span>
                <span className="px-1">-</span>
                <span className="font-semibold">DH123123</span>
              </span>
              <br />
              <span className="font-semibold">{NumberPipe(99000, true)}</span>
            </div>
            <span className="font-bold text-success text-lg">+{item}</span>
          </div>
        ))}
      </div>
    </Dialog>
  );
}
const listCommision = [
  "123",
  "345",
  "345",
  "345",
  "345",
  "345",
  "123",
  "345",
  "123",
  "345",
  "123",
  "345",
  "123",
  "345",
];
