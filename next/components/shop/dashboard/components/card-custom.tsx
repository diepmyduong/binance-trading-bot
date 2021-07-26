import { Card } from "../../../shared/utilities/card/card";
import { Select } from "../../../shared/utilities/form/select";

interface PropsType extends ReactProps {}
export function CardCustom({ className = "", ...props }: PropsType) {
  return <div className={`bg-white rounded shadow ${className}`}>{props.children}</div>;
}
type HeaderProps = ReactProps & {
  title: string;
  subtitle?: string;
  icon?: any;
  filter?: Option[];
  onChange?: (data: any) => void;
};
CardCustom.Header = (props: HeaderProps) => {
  return (
    <div className={`w-full ${props.className}`}>
      <div className="flex items-center min-h-18 justify-between p-4">
        <div className="flex items-center w-full">
          {props.icon && <i className="text-xl">{props.icon}</i>}
          <h1 className="font-semibold">{props.title}</h1>
        </div>
        {props.filter && (
          <div className="w-full">
            <Select
              options={props.filter}
              defaultValue={props.filter[0]}
              onChange={(data) => props.onChange(data)}
            />
          </div>
        )}
      </div>
      <div className="w-full h-1 bg-gray-200"></div>
    </div>
  );
};
CardCustom.Body = (props: PropsType & ReactProps) => {
  return (
    <div className={`w-full p-4 ${props.className}`} style={props.style}>
      {props.children}
    </div>
  );
};
