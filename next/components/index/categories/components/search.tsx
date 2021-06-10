import { RiFile3Fill, RiFolder2Line, RiSearchLine } from "react-icons/ri";
import { Button } from "../../../shared/utilities/form/button";
import { Input } from "../../../shared/utilities/form/input";
import { Spinner } from "../../../shared/utilities/spinner";

interface PropsType extends ReactProps {
  onChange: Function;
  value: string;
}

export function Search({ ...props }: PropsType) {
  return (
    <div className="border-b border-gray-200">
      <Input
        clearable
        className="w-full border-0 rounded-none py-3"
        prefix={
          <i>
            <RiSearchLine />
          </i>
        }
        value={props.value}
        debounce={300}
        placeholder="Tìm kiếm danh mục hoặc sản phẩm"
        onChange={(val) => props.onChange(val)}
      />
    </div>
  );
}
