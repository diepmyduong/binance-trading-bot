import { RiDeleteBin6Line, RiPhoneLine } from "react-icons/ri";
import { AddressPipe } from "../../../../lib/pipes/address";
import { ShopBranch } from "../../../../lib/repo/shop-branch.repo";
import { Button } from "../../../shared/utilities/form/button";
import { Switch } from "../../../shared/utilities/form/switch";

interface PropsType extends ReactProps {
  branch: ShopBranch;
  onClick: () => any;
  onDeleteClick: () => any;
  onToggleClick: () => any;
}
export function BranchItem({ branch, ...props }: PropsType) {
  return (
    <div
      className="flex items-center p-2 mb-2 bg-white border border-gray-300 hover:border-primary rounded-md cursor-pointer group"
      onClick={props.onClick}
    >
      <div className="flex-1 pl-3">
        <div className="text-gray-800 font-semibold text-lg group-hover:text-primary">
          {branch.name}
        </div>
        <div className="text-gray-600">{AddressPipe(branch)}</div>
      </div>
      <div className="px-4 text-gray-700" style={{ flexGrow: 0.5 }}>
        <div className="flex">
          <i className="text-lg mt-1 mr-1">
            <RiPhoneLine />
          </i>
          {branch.phone}
        </div>
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        data-tooltip="Mở chi nhánh"
        data-placement="top-center"
      >
        <Switch className="px-4" value={branch.activated || false} onChange={props.onToggleClick} />
      </div>
      <Button
        icon={<RiDeleteBin6Line />}
        hoverDanger
        iconClassName="text-lg"
        onClick={async (e) => {
          e.stopPropagation();
          await props.onDeleteClick();
        }}
      />
    </div>
  );
}
