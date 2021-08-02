import React, { useState } from "react";
import { DialogPropsType, Dialog } from "../../../shared/utilities/dialog/dialog";
import useDevice from "../../../../lib/hooks/useDevice";
import useScreen from "../../../../lib/hooks/useScreen";
import { useCollaboratorContext } from "../providers/collaborator-provider";
import { Spinner } from "../../../shared/utilities/spinner";
import { InvitedCustomer } from "../../../../lib/repo/collaborator.repo";
import { NumberPipe } from "../../../../lib/pipes/number";

interface RecommendedDialogProps extends DialogPropsType {}
export function RecommendedDialog(props: RecommendedDialogProps) {
  const { customersInvited } = useCollaboratorContext();
  const { isMobile } = useDevice();
  let screenSm = useScreen("sm");
  return (
    <Dialog {...props} title={`Danh sách đã mời (${customersInvited?.length || 0})`}>
      <div
        className={`bg-white shadow relative rounded-md w-full v-scrollbar ${
          isMobile ? "pb-12" : ""
        }`}
        style={{ maxHeight: `calc(96vh - 150px)`, minHeight: `calc(96vh - 350px)` }}
      >
        {" "}
        {customersInvited ? (
          <>
            {customersInvited.length > 0 ? (
              <>
                {customersInvited.map((item: InvitedCustomer, index) => (
                  <div key={index} className="px-4 py-2 border-b flex items-center justify-between">
                    <div>
                      <span className="font-semibold">{item.name}</span>
                      <span className="px-1">-</span>
                      <span>{item.phone}</span>
                      {/* <span
                className={`px-1 rounded-full ${
                  item === "Đã mua" ? "bg-success" : "bg-trueGray"
                } text-white font-semibold`}
              >
                {item}
              </span> */}
                    </div>
                    <span className="font-bold text-success text-lg">
                      +{NumberPipe(item.commission, true)}
                    </span>
                  </div>
                ))}{" "}
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
