import React, { useEffect, useState } from "react";
import ImgnVideo from "./img-video";
import BasicInfo from "./basic-info";
import { Product } from "../../../../../lib/repo/product.repo";
import cloneDeep from "lodash/cloneDeep";
interface Propstype extends ReactProps {
  product: Product;
}

const Info = (props: Propstype) => {
  const [breads, setBreads] = useState<{ label: string; href: string }[]>([]);
  useEffect(() => {
    if (props.product) {
      let breadsNew = [];
      for (let index = props.product.categories.length - 1; index >= 0; index--) {
        console.log(index);

        let newBread = {
          label: props.product.categories[index].name,
          href: "/category/" + props.product.categories[index].code,
        };
        breadsNew.push(newBread);
      }
      breadsNew.push({ label: props.product.name, href: "" });
      setBreads(cloneDeep(breadsNew));
    }
  }, [props.product]);
  return (
    <div className={`grid grid-cols-5 gap-3 ${props.className && props.className}`}>
      <ImgnVideo
        className="col-span-5 sm:col-span-2 rounded-md overflow-hidden"
        imgs={props.product.images}
        url={props.product.youtubeLink}
      />
      <BasicInfo
        className="col-span-5 sm:col-span-3"
        breadcrumbs={breads}
        info={{
          name: props.product.name,
          des: props.product.shortDesc,
          price: props.product.basePrice,
          unit: props.product.unit,
        }}
      />
    </div>
  );
};

export default Info;
