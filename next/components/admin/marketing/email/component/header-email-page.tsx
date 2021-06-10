import { useState } from "react";
import { Button } from "../../../../../components/shared/utilities/form/button";
import { useEmailContext } from "../providers/email-provider";

export function HeaderEmailPage(props) {
  const [View, setView] = useState(1);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const handleView = (e) => {
    setView(e);
    props.handleView(e);
  };
  const { createEmail } = useEmailContext();

  return (
    <>
      <div className="wrapper mb-2">
        <div className="flex justify-between">
          <div className="title inline-block">
            <h3 className="inline text-xl">Danh sách Mail mẫu</h3>
            <p className="text-xs text-gray-400">Danh sách các biểu mẫu email</p>
          </div>
        </div>
      </div>
    </>
  );
}
