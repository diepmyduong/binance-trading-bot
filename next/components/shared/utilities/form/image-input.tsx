import { ChangeEvent, MutableRefObject, useEffect, useRef, useState } from "react";
import { useToast } from "../../../../lib/providers/toast-provider";
import { Button } from "./button";
import { Img } from "./../img";
import useDebounce from "../../../../lib/hooks/useDebounce";
import { RiArrowLeftLine, RiArrowRightLine, RiCloseLine, RiUpload2Line } from "react-icons/ri";
import { uploadImage } from "../../../../lib/helpers/upload-image";

export interface ImageInputProps extends FormControlProps {
  multi?: boolean;
  inputClassName?: string;
  avatar?: boolean;
  largeImage?: boolean;
  ratio169?: boolean;
  percent?: number;
  contain?: boolean;
  cover?: boolean;
  checkerboard?: boolean;
  cols?: Cols;
  compress?: number;
}
export function ImageInput({
  controlClassName = "form-control",
  className = "",
  inputClassName = "",
  defaultValue = getDefaultValue({}),
  style = {},
  multi = false,
  ...props
}: ImageInputProps) {
  const [value, setValue] = useState<string | string[]>(multi ? "" : []);
  const [url, setUrl] = useState("");
  const debouncedValue = useDebounce(value, 300);
  const ref: MutableRefObject<HTMLInputElement> = useRef();
  const [uploading, setUploading] = useState(false);

  const toast = useToast();

  useEffect(() => {
    if (props.value !== undefined) {
      setValue(props.value || defaultValue);
    } else {
      setValue(defaultValue);
    }
  }, [props.value]);

  useEffect(() => {
    if (debouncedValue !== undefined && props.onChange) {
      props.onChange(debouncedValue);
    }
  }, [debouncedValue]);

  const onFileChanged = async (e: ChangeEvent<HTMLInputElement>) => {
    let files = e.target.files;
    if (files.length == 0) return;

    if (multi) {
      try {
        setUploading(true);
        let tasks = [];
        for (let i = 0; i < files.length; i++) {
          tasks.push(
            uploadImage(files.item(i))
              .then((res) => {
                (value as string[]).push(res.link);
                setValue([...(value as string[])]);
              })
              .catch((err) => {
                console.error(err);
                toast.error(`Upload ảnh thất bại. Xin thử lại bằng url thay vì upload.`);
              })
          );
        }
        await Promise.all(tasks);
        if (props.onChange) props.onChange(value);
      } catch (err) {
        console.error(err);
        toast.error(`Upload ảnh thất bại. Xin thử lại bằng url thay vì upload.`);
      } finally {
        setUploading(false);
        e.target.value = "";
      }
    } else {
      let file = files[0];
      try {
        setUploading(true);
        let res = await uploadImage(file);
        setValue(res.link);
        if (props.onChange) props.onChange(res.link);
      } catch (err) {
        console.error(err);
        toast.error(`Upload ảnh thất bại. Xin thử lại bằng url thay vì upload.`);
      } finally {
        setUploading(false);
        e.target.value = "";
      }
    }
  };

  const onAddImage = () => {
    if (url) {
      let newValue = value.concat(url);
      setValue(newValue);
      setUrl("");
      if (props.onChange) props.onChange(newValue);
    }
  };

  return (
    <>
      {multi ? (
        <>
          {!!value?.length && (
            <div className={`grid mb-2 gap-3 grid-cols-${props.cols || 4}`}>
              {(value as string[]).map((image, index) => (
                <Img
                  compress={props.compress || 200}
                  key={index}
                  className="border border-gray-400 group"
                  showImageOnClick
                  contain={props.contain || !props.cover}
                  checkerboard={props.checkerboard}
                  ratio169={props.ratio169}
                  percent={props.percent}
                  src={image}
                  avatar={props.avatar}
                >
                  {index != 0 && (
                    <Button
                      outline
                      primary
                      className="absolute rounded-full -left-2 -bottom-1 px-0 w-8 h-8 bg-white opacity-0 group-hover:opacity-100"
                      icon={<RiArrowLeftLine />}
                      onClick={() => {
                        let newValue = [...(value as string[])];
                        let temp = newValue[index - 1];
                        newValue[index - 1] = newValue[index];
                        newValue[index] = temp;
                        setValue(newValue);
                        if (props.onChange) props.onChange(newValue);
                      }}
                    />
                  )}
                  <Button
                    outline
                    danger
                    className="absolute rounded-full left-1/2 transform -translate-x-1/2 -bottom-1 px-0 w-8 h-8 bg-white opacity-0 group-hover:opacity-100"
                    icon={<RiCloseLine />}
                    onClick={() => {
                      (value as string[]).splice(index, 1);
                      let newValue = [...(value as string[])];
                      setValue(newValue);
                      if (props.onChange) props.onChange(newValue);
                    }}
                  />
                  {index != value.length - 1 && (
                    <Button
                      outline
                      primary
                      className="absolute rounded-full -right-2 -bottom-1 px-0 w-8 h-8 bg-white opacity-0 group-hover:opacity-100"
                      icon={<RiArrowRightLine />}
                      onClick={() => {
                        let newValue = [...(value as string[])];
                        let temp = newValue[index + 1];
                        newValue[index + 1] = newValue[index];
                        newValue[index] = temp;
                        setValue(newValue);
                        if (props.onChange) props.onChange(newValue);
                      }}
                    />
                  )}
                </Img>
              ))}
            </div>
          )}
          <div className="flex items-center">
            <input
              tabIndex={props.noFocus && -1}
              className={`${controlClassName} flex-1 rounded-r-none ${inputClassName || ""}`}
              placeholder={props.placeholder || "Nhập đường dẫn ảnh"}
              readOnly={props.readonly}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  e.preventDefault();
                  onAddImage();
                }
              }}
            />
            <Button
              outline
              className="flex-grow-0 flex-shrink-0 rounded-l-none px-3"
              text="Thêm ảnh"
              unfocusable
              disabled={props.readonly}
              onClick={() => {
                onAddImage();
              }}
            />
            <span className="px-2 font-semibold">hoặc</span>
            <Button
              outline
              className="flex-grow-0 flex-shrink-0 px-3"
              icon={<RiUpload2Line />}
              text="Upload"
              unfocusable
              disabled={props.readonly}
              isLoading={uploading}
              onClick={() => ref.current?.click()}
            />
            <input
              hidden
              multiple
              type="file"
              accept="image/*"
              ref={ref}
              onChange={onFileChanged}
            />
          </div>
        </>
      ) : (
        <>
          {props.largeImage && (
            <Img
              compress={props.compress || 400}
              className="w-full bg-gray-100 border border-gray-400 rounded-t border-b-0"
              showImageOnClick
              contain={props.contain || !props.cover}
              checkerboard={props.checkerboard}
              ratio169={props.ratio169}
              percent={props.percent}
              src={debouncedValue}
              avatar={props.avatar}
            />
          )}

          <div
            className={`${controlClassName} relative flex items-center focus-within:border-primary-dark group px-0 ${
              props.readonly ? "readonly" : ""
            } ${props.error ? "error" : ""} ${
              props.largeImage ? "rounded-t-none" : ""
            } ${className}`}
            style={{ ...style }}
          >
            {!props.largeImage && (
              <Img
                compress={props.compress || 80}
                contain={props.contain}
                className="flex-shrink-0 w-10 self-stretch p-1"
                src={debouncedValue}
                avatar={props.avatar}
                showImageOnClick
              />
            )}
            <input
              tabIndex={props.noFocus && -1}
              className={`flex-grow bg-transparent self-stretch ${
                props.largeImage ? "px-3" : "px-1.5"
              } ${inputClassName || ""}`}
              name={props.name}
              value={value}
              placeholder={props.placeholder}
              readOnly={props.readonly}
              onChange={(e) => {
                setValue(e.target.value);
                if (props.onChange) props.onChange(e.target.value);
              }}
            />
            {!props.readonly && (
              <Button
                className="border-l self-stretch rounded-l-none border-gray-300 bg-gray-50 px-3"
                isLoading={uploading}
                text="Upload"
                icon={<RiUpload2Line />}
                unfocusable
                onClick={() => ref.current?.click()}
              ></Button>
            )}
            <input hidden type="file" accept="image/*" ref={ref} onChange={onFileChanged} />
          </div>
        </>
      )}
    </>
  );
}

const getDefaultValue = (props: ImageInputProps) => {
  return props.multi ? "" : [];
};

ImageInput.getDefaultValue = getDefaultValue;
