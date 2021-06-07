import { HiOutlineInformationCircle } from "react-icons/hi";

type CardHeaderProps = {
  [x: string]: any;
  title?: string;
  subtitle?: string;
  tooltip?: string;
};
export function CardHeader(props: CardHeaderProps) {
  return (
    <div>
      <div className="title flex items-center">
        <h3 className="inline text-xl">{props.title}</h3>
        {props.tooltip && (
          <i className="text-xl pl-1 text-gray-400" data-tooltip={props.tooltip}>
            <HiOutlineInformationCircle />
          </i>
        )}
      </div>
      {props.subtitle && (
        <div className="note pb-2">
          <p className="inline text-sm text-gray-400 ">{props.subtitle}</p>
        </div>
      )}
    </div>
  );
}
