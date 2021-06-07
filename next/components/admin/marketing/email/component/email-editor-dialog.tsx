import { useEffect, useRef } from "react";
import EmailEditor from "react-email-editor";
import { Button } from "../../../../shared/utilities/form/button";
type EmailEditorDialog = {
  [x: string]: any;
  design?: any;
  onSave?: (data: { design: any; html: string }) => void;
};
export function EmailEditorDialog({ onSave = () => {}, ...props }: EmailEditorDialog) {
  const emailEditorRef = useRef(null);
  useEffect(() => {
    if (emailEditorRef.current && emailEditorRef.current.editor) {
      if (props.design) emailEditorRef.current.editor.loadDesign(props.design);
    }
  }, [emailEditorRef.current]);
  return (
    <div className="flex flex-col space-y-5">
      <EmailEditor
        ref={emailEditorRef}
        minHeight="calc(80vh - 80px)"
        options={{
          mergeTags: {
            first_name: {
              name: "First Name",
              value: "{{first_name}}",
              sample: "John",
            },
            last_name: {
              name: "Last Name",
              value: "{{last_name}}",
              sample: "Doe",
            },
          },
        }}
      />
      <div className="flex flex-row-reverse w-full">
        <Button
          primary
          onClick={() => {
            emailEditorRef.current.editor.exportHtml((data) => onSave(data));
          }}
          text="Lưu"
        ></Button>
        <Button onClick={() => onSave(null)} text="Huỷ thay đổi"></Button>
      </div>
    </div>
  );
}
