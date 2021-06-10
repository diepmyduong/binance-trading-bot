import React, { useEffect } from "react";

import { Spinner } from "../../shared/utilities/spinner";
import Description from "./components/description/description";
import Info from "./components/info/info";
import LikeProducts from "./components/like-products/like-products";
import { useDetailsContext } from "./providers/details-provider";

const DetailsPage = (props) => {
  const { product } = useDetailsContext();
  return (
    <div className="main-container px-2 sm:px-10 py-10 my-10 space-y-10 bg-white ">
      {(product && (
        <>
          <Info product={product} />
          <Description product={product} />
          <LikeProducts product={product} />
        </>
      )) || <Spinner />}
    </div>
  );
};

export default DetailsPage;
