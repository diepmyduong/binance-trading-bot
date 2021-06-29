import { ChangeEvent, useEffect, useRef, useState } from "react";
import { uploadImage } from "../../../../lib/helpers/upload-image";
import { useToast } from "../../../../lib/providers/toast-provider";

interface PropsType extends ReactProps {
  onUploadingChange?: (uploading: boolean) => any;
  onImageUploaded: (image: string) => any;
  onRef: any;
}

export function AvatarUploader({ onRef, onUploadingChange, onImageUploaded, ...props }: PropsType) {
  const ref = useRef<HTMLInputElement>();
  const toast = useToast();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    onRef(() => ({
      onClick,
    }));
  }, []);

  useEffect(() => {
    onUploadingChange(uploading);
  }, [uploading]);

  const onClick = () => {
    ref.current.click();
  };

  const onFileChanged = async (e: ChangeEvent<HTMLInputElement>) => {
    let files = e.target.files;
    if (files.length == 0) return;

    let file = files[0];
    try {
      setUploading(true);
      let res = await uploadImage(file);
      onImageUploaded(res.link);
    } catch (err) {
      console.error(err);
      toast.error(`Upload ảnh thất bại.`);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <>
      <input hidden type="file" accept="image/*" ref={ref} onChange={onFileChanged} />
    </>
  );
}
