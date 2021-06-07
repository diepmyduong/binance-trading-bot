import { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import { HiPencil } from "react-icons/hi";
import { useToast } from "../../../../../lib/providers/toast-provider";
import { Dialog } from "../../../../shared/utilities/dialog/dialog";
import { Button } from "../../../../shared/utilities/form/button";
import { Field } from "../../../../shared/utilities/form/field";
import { Form } from "../../../../shared/utilities/form/form";
import { Input } from "../../../../shared/utilities/form/input";
import { SaveButtonGroup } from "../../../../shared/utilities/save-button-group";
import { useEmailContext } from "../providers/email-provider";
import { EmailEditorDialog } from "./email-editor-dialog";
import { HTMLReviewer } from "./html-reviewer";

interface PropsType extends ReactProps {
  dataEmail?: any;
  onCancle?: () => void;
  unSelect?: any;
}
export function FormEmail({ dataEmail, onCancle, unSelect }: PropsType) {
  const [data, setData] = useState(dataEmail);
  const { emails, selectEmail, email, updateEmail, duplicate, deleteEmail } = useEmailContext();
  const toast = useToast();
  const [openEditor, setOpenEditor] = useState(false);
  const cloneData = () => {
    if (!email) return null;
    return {
      name: email.name,
      subject: email.subject,
      html: email.html,
      design: email.design,
    };
  };
  useEffect(() => {
    setData(cloneData());
  }, [email]);
  return (
    <div className="form p-4 w-full ">
      <div className="flex flex-col space-y-4 w-full">
        <Form initialData={data}>
          <Field label="Tên mẫu Email" required>
            <Input value={data.name} onChange={(value) => (data.name = value)} />
          </Field>

          <Field label="Chủ đề" required>
            <Input value={data.subject} onChange={(value) => (data.subject = value)} />
          </Field>

          <Field label="Nội dung">
            <div
              className="relative h-72 form-control transition-all duration-300 hover:bg-gray-200 cursor-pointer group"
              onClick={() => setOpenEditor(true)}
            >
              <i className="absolute top-1/2 w-full flex justify-center items-center text-xl text-gray-700 opacity-0 group-hover:opacity-50">
                <HiPencil /> Chỉnh sửa
              </i>
              <HTMLReviewer html={data.html} />
            </div>
          </Field>
          <SaveButtonGroup
            className="mt-2"
            onSubmit={() =>
              updateEmail(data)
                .then((res) => toast.success("Đã cập nhật."))
                .catch((err) => toast.error(err.message))
            }
            disableCancle
          />
          <Dialog
            width="80%"
            title={`Thiết kế mẫu email`}
            onClose={() => {
              setOpenEditor(false);
            }}
            isOpen={openEditor}
          >
            <Dialog.Body>
              <EmailEditorDialog
                design={data.design}
                onSave={(res) => {
                  setOpenEditor(false);
                  if (!res) return;
                  data.html = data.html;
                  data.design = data.design;
                  setData({ ...data, html: res.html, design: res.design });
                }}
              ></EmailEditorDialog>
            </Dialog.Body>
          </Dialog>
        </Form>
      </div>
    </div>
  );
}
