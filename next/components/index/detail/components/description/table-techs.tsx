import React from "react";
interface Propstype extends ReactProps {
  options: Option[];
}
const TableTechs = (props: Propstype) => {
  return (
    <div className={`flex flex-col ${props.className || ""}`}>
      <h3 className="text-primary font-bold mb-4">Thông số kỹ thuật</h3>
      {(props.options &&
        props.options.length > 0 &&
        props.options.map((item) => (
          <div className="grid grid-cols-3">
            <p className="col-span-1 bg-gray-200 p-2 border-primary border">{item.label}</p>
            <p className="col-span-2 p-2 border-primary border-l-0 border">{item.value}</p>
          </div>
        ))) ||
        "Chưa có"}
    </div>
  );
};

export default TableTechs;
