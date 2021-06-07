import React from "react";
import BreadCrumbs from "../../../../shared/utilities/breadcrumbs/breadcrumbs";
import { NumberPipe } from "../../../../../lib/pipes/number";
interface Propstype extends ReactProps {
  breadcrumbs?: { label: string; href: string }[];
  info: {
    name: string;
    des: string;
    price: string | number;
    unit: string;
  };
}
const BasicInfo = (props: Propstype) => {
  return (
    <div className={`space-y-5 ` + props.className}>
      <BreadCrumbs className="text-sm" breadcrumbs={props.breadcrumbs} accent native />
      <h3 className="text-lg sm:text-xl font-bold sm:uppercase text-ellipsis">{props.info.name}</h3>
      <p className="text-base sm:text-lg text-accent font-bold">
        {NumberPipe(props.info.price, true)}/{props.info.unit || "cái"}
      </p>
      <p className="text-sm sm:text-base text-gray-500">{props.info.des}</p>
    </div>
  );
};

export default BasicInfo;
