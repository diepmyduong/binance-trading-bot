import React from "react";
import { Product } from "../../../../lib/repo/product.repo";
import { useRouter } from "next/router";
import { Img } from "../../../shared/utilities/img";
import { NumberPipe } from "../../../../lib/pipes/number";
import { Spinner } from "../../../shared/utilities/spinner";
interface Propstype extends ReactProps {
  product: Product;
}

const CategoryProductCard = (props: Propstype) => {
  const router = useRouter();
  return (
    <>
      {props.product &&
        ((
          <div
            className="border-b pb-4 flex justify-between items-center px-3 text-24 cursor-pointer hover:text-primary"
            onClick={() => router.push("/details/" + props.product.code)}
          >
            <div className="flex gap-2 items-center">
              <Img src={props.product.images[0]} className="w-20 h-20" />
              <div>
                <h4 className=" font-semibold">{props.product.name}</h4>
                <p className="text-sm">{props.product.shortDesc}</p>
              </div>
            </div>
            <h4>
              {NumberPipe(props.product.basePrice, true)}/{props.product.unit || "cái"}
            </h4>
          </div>
        ) || <Spinner />)}
    </>
  );
};

export default CategoryProductCard;
