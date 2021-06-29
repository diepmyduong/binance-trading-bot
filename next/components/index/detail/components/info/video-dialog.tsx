import React from "react";
import { Dialog } from "../../../../shared/utilities/dialog/dialog";
import ReactPlayer from "react-player/lazy";
import useScreen from "../../../../../lib/hooks/useScreen";
interface PropsType extends ReactProps {
  isOpen: boolean;
  url: string;
  onClose: () => any;
  onClick?: () => void;
}

const VideoDialog = (props: PropsType) => {
  const screenSm = useScreen("sm");
  return (
    <Dialog isOpen={props.isOpen} onClose={props.onClose} slideFromBottom="none">
      <div>
        {(screenSm && (
          <ReactPlayer
            url={props.url || "https://www.youtube.com/watch?v=ysz5S6PUM-U"}
            playing={true}
            controls
            config={{
              youtube: {
                playerVars: { showinfo: 1 },
              },
              file: {
                attributes: {
                  controlsList: "nodownload",
                },
              },
            }}
            facebook={{
              appId: "322540175925097",
            }}
          />
        )) || (
          <ReactPlayer
            url={props.url || "https://www.youtube.com/watch?v=ysz5S6PUM-U"}
            playing={true}
            controls
            width="100%"
            height="100%"
            config={{
              youtube: {
                playerVars: { showinfo: 1 },
              },
              file: {
                attributes: {
                  controlsList: "nodownload",
                },
              },
            }}
            facebook={{
              appId: "206401347030",
            }}
          />
        )}
      </div>
    </Dialog>
  );
};

export default VideoDialog;
