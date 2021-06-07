import React, { useEffect, useState } from "react";
import ImgRadio from "./img-radio";
import { Img } from "../../../../shared/utilities/img";
import { Button } from "../../../../shared/utilities/form/button";
import VideoDialog from "./video-dialog";
interface Propstype extends ReactProps {
  imgs: string[];
  url: string;
}

const ImgnVideo = (props: Propstype) => {
  const [showDialog, setShowDialog] = useState(false);
  const [imgSelected, setImgSelected] = useState<string>(null);
  useEffect(() => {
    setImgSelected(props.imgs[0]);
  }, [props.imgs]);
  return (
    <div className={` ` + props.className}>
      <div className="relative flex flex-col justify-between">
        <Img src={imgSelected} ratio169 />
        {props.url && (
          <Button
            accent
            className="rounded-xl absolute bottom-2 right-2 btn-sm sm:btn-lg"
            text="Xem video"
            onClick={() => setShowDialog(true)}
          />
        )}
      </div>
      <ImgRadio
        options={props.imgs}
        className="w-full mt-3"
        onChange={(val) => setImgSelected(val)}
      />
      <VideoDialog isOpen={showDialog} onClose={() => setShowDialog(false)} url={props.url} />
    </div>
  );
};

export default ImgnVideo;
