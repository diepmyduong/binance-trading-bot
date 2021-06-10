import { MutableRefObject, useEffect, useRef, useState } from "react";
import { CgSpinner } from "react-icons/cg";

export interface EditorProps extends FormControlProps {
  minHeight?: string;
  maxHeight?: string;
  maxWidth?: string;
  noBorder?: boolean;
}
export function Editor({
  controlClassName = "form-control",
  className = "flex justify-center bg-gray-100 px-0",
  maxWidth = "960px",
  minHeight = "128px",
  maxHeight = "none",
  defaultValue = getDefaultValue({}),
  style = {},
  ...props
}: EditorProps) {
  const [value, setValue] = useState<any>();
  const [editor, setEditor] = useState<any>();

  useEffect(() => {
    if (props.value !== undefined) {
      setValue(props.value || defaultValue);
    } else {
      setValue(defaultValue);
    }
  }, [props.value]);

  const editorRef: MutableRefObject<any> = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, InlineEditor } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      InlineEditor: require("@lynxerious/ckeditor5-build-mcom"),
    };
    setEditorLoaded(true);
  }, []);

  const onChange = (data) => {
    setValue(data);
    if (props.onChange) props.onChange(data);
  };

  useEffect(() => {
    if (editor) {
      editor.editing.view.change((writer) => {
        writer.setStyle("min-height", minHeight, editor.editing.view.document.getRoot());
        writer.setStyle("max-height", maxHeight, editor.editing.view.document.getRoot());
        writer.setStyle("max-width", maxWidth, editor.editing.view.document.getRoot());
        writer.setStyle("width", "100%", editor.editing.view.document.getRoot());
        writer.setStyle("border-radius", "inherit", editor.editing.view.document.getRoot());
        writer.setStyle(
          "background-color",
          props.readonly ? "transparent" : "white",
          editor.editing.view.document.getRoot()
        );
        if (props.noBorder) {
          writer.setStyle("border", "0 !important", editor.editing.view.document.getRoot());
          writer.setStyle("box-shadow", "none !important", editor.editing.view.document.getRoot());
        } else {
          writer.setStyle(
            "box-shadow",
            "0 0 4px 1px rgba(0, 0, 0, 0.08)",
            editor.editing.view.document.getRoot()
          );
        }
      });
      editor.isReadOnly = props.readonly;
    }
  }, [props.readonly, minHeight, maxHeight, editor]);

  return (
    <>
      {editorLoaded ? (
        <div
          className={`${controlClassName} ${props.readonly ? "readonly" : ""} ${
            props.error ? "error" : ""
          } ${className}`}
          style={{ ...style }}
        >
          <CKEditor
            editor={InlineEditor}
            data={value}
            config={{ placeholder: props.placeholder, tabindex: "-1" }}
            onChange={(event, editor) => {
              onChange(editor.getData());
            }}
            onReady={(editor) => {
              setEditor(editor);
            }}
          />
        </div>
      ) : (
        <div className="form-checkbox col-span-12 pt-1.5">
          <i className="pt-0 self-start animate-spin">
            <CgSpinner />
          </i>
          <span className="pl-1.5 loading-ellipsis text-base">Đang tải</span>
        </div>
      )}
    </>
  );
}

const getDefaultValue = (props: EditorProps) => {
  return "";
};

Editor.getDefaultValue = getDefaultValue;
