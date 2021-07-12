import { NextSeo } from "next-seo";
import { useEffect } from "react";
import { Button } from "../components/shared/utilities/form/button";

import { DefaultLayout } from "../layouts/default-layout/default-layout";
import { GoongGeocoder, GoongPlaceDetail, GoongSearch } from "../lib/helpers/goong";

export default function Page() {
  function search(input: string) {
    return GoongSearch(input)
      .then((res) => {
        console.log("search", res);
        return res;
      })
      .then((res) => {
        console.log("res", res);
        return GoongPlaceDetail(res.predictions[0].place_id);
      })
      .then((res) => {
        console.log("detail", res);
      });
  }
  useEffect(() => {
    GoongGeocoder.addTo("#geocoder");
    var results = document.getElementById("result");
    GoongGeocoder.on("result", function (e) {
      console.log("result", e);
      results.innerText = JSON.stringify(e.result, null, 2);
    });
    GoongGeocoder.on("clear", function () {
      console.log("on clear");
      results.innerText = "";
    });
  }, []);
  return (
    <div className="">
      <NextSeo title="Toạ độ" />
      <div id="geocoder"></div>
      <pre id="result"></pre>
      <Button onClick={() => search("300/80 Xo Viet nghe Tinh")} text="Tim kiem" />
    </div>
  );
}

Page.Layout = DefaultLayout;
