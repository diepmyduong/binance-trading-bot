import React, { useState } from "react";
import { DialogPropsType, Dialog } from "../../../shared/utilities/dialog/dialog";
import formatDate from "date-fns/format";
import { NumberPipe } from "../../../../lib/pipes/number";
import useScreen from "../../../../lib/hooks/useScreen";
import useDevice from "../../../../lib/hooks/useDevice";
import { useCollaboratorContext } from "../providers/collaborator-provider";
import { Spinner } from "../../../shared/utilities/spinner";
import { CommissionLog } from "../../../../lib/repo/commission.repo";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import Link from "next/link";

interface HistoryDialogProps extends DialogPropsType {}
export function HistoryDialog(props: HistoryDialogProps) {
  const { commissions } = useCollaboratorContext();
  const { shopCode } = useShopContext();
  let screenSm = useScreen("sm");
  const { isMobile } = useDevice();
  return (
    <Dialog {...props} title={`Lịch sử hoa hồng (${commissions?.length || 0})`}>
      <div
        className={`bg-white shadow relative rounded-md w-full v-scrollbar ${
          isMobile ? "pb-12" : ""
        }`}
        style={{ maxHeight: `calc(96vh - 150px)`, minHeight: `calc(96vh - 350px)` }}
      >
        {commissions ? (
          <>
            {commissions.length > 0 ? (
              <>
                {commissions.map((item: CommissionLog, index) => (
                  <div key={index} className="px-4 py-2 border-b flex items-center justify-between">
                    <div>
                      <span>
                        <span>{formatDate(new Date(item.createdAt), "dd-MM-yyyy hh:mm")}</span>
                        <span className="px-1">-</span>
                        <Link href={`/${shopCode}/order/${item.order.code}`}>
                          <a>
                            <span className="font-semibold hover:text-primary cursor-pointer duration-200 transition-all">
                              {item.order.code}
                            </span>
                          </a>
                        </Link>
                      </span>
                      <br />
                      <span className="font-semibold">{NumberPipe(item.order.amount, true)}</span>
                    </div>
                    <span className="font-bold text-success text-lg">
                      +{NumberPipe(item.value)}
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center mt-10 px-4">Chưa có lịch sử hoa hồng</div>
            )}
          </>
        ) : (
          <Spinner />
        )}
      </div>
    </Dialog>
  );
}
