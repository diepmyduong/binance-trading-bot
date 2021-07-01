import React from "react";
import { Button } from "../../../../shared/utilities/form/button";
import StatusTime from "../../../../shared/infomation/status-time";
interface Propstype extends ReactProps {
  onClick?: () => void;
  branch: { place: string; address: string; isActive: boolean; range: number };
}
const Branch = (props: Propstype) => {
  return (
    <div className="flex px-4 mt-2 border-b pb-2">
      <div className="flex-1 leading-7">
        <h3 className="text-primary text-base sm:text-lg">{props.branch.place}</h3>
        <p className="text-ellipsis-2">{props.branch.address}</p>
        <StatusTime
          isActive={props.branch.isActive}
          // openAt={props.branch.openAt}
          // closeAt={props.branch.closeAt}
          range={props.branch.range}
        />
      </div>
      <Button
        outline
        primary
        text="Chọn"
        className="rounded-full"
        onClick={() => props.onClick()}
      />
    </div>
  );
};

export default Branch;
