import React, { useEffect, useState } from "react";
import { ShopCard } from "./components/shop-card";
import { Label } from "../../shared/utilities/form/label";
import { Input } from "../../shared/utilities/form/input";
import { FaMapMarkerAlt } from "react-icons/fa";
import { AddressGongDialog } from "../customer/components/address-gong-dialog";
import { GoongGeocoderService } from "../../../lib/helpers/goong";
import { PublicShop, ShopService } from "../../../lib/repo/shop.repo";
import { useToast } from "../../../lib/providers/toast-provider";
import { Spinner } from "../../shared/utilities/spinner";
import cloneDeep from "lodash/cloneDeep";
import { Button } from "../../shared/utilities/form/button";
import { orderBy } from "lodash";

export function ShopsPage() {
  const [openAddress, setOpenAddress] = useState(false);
  let [useAddress, setUseAddress] = useState<{ fullAddress: string; lg: number; lat: number }>();
  const [cusomterLoca, setCusomterLoca] = useState<{
    fullAddress: string;
    lg: number;
    lat: number;
  }>();
  let [shops, setShops] = useState<PublicShop[]>();
  const toast = useToast();
  useEffect(() => {
    let address = sessionStorage.getItem("addressSelected");
    if (address) {
      setUseAddress(JSON.parse(address));
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position);
            GoongGeocoderService.getPlaceDetailByLatLg(
              position.coords.latitude,
              position.coords.longitude
            ).then((res) => {
              console.log(res);
              if (res && res.length > 0) {
                let newUserAddress = {
                  fullAddress: res[0].formatted_address,
                  lat: res[0].geometry.location.lat,
                  lg: res[0].geometry.location.lng,
                };
                console.log(newUserAddress);
                setUseAddress(newUserAddress);
              } else {
                setUseAddress(null);
              }
            });
          },
          (err) => {
            setUseAddress(null);
            setOpenAddress(true);
          }
        );
      }
    }
  }, []);
  useEffect(() => {
    console.log(useAddress);
    if (useAddress && useAddress.fullAddress) {
      sessionStorage.setItem("addressSelected", JSON.stringify(useAddress));
      ShopService.getAllShop(useAddress.lat, useAddress.lg)
        .then((res) => {
          console.log(res);
          let shopsData = res;
          shops = orderBy(shopsData, (o) => o.distance);
          setShops(shops);
        })
        .catch((err) => toast.error("Lỗi" + err));
    }
    if (useAddress === null) {
      setOpenAddress(true);
      setShops([]);
    }
  }, [useAddress]);
  if (useAddress === undefined || shops === undefined) return <Spinner />;
  return (
    <div className="flex flex-col min-h-screen relative bg-gray-800">
      <div className="w-full bg-gray-100 relative min-h-screen max-w-lg mx-auto">
        <div className="sticky top-0 bg-white z-50 p-4">
          <div
            className="flex flex-col"
            onClick={() => {
              setOpenAddress(true);
            }}
          >
            <Label text="Giao đến:" />
            <Input
              readonly
              placeholder="Nhập địa chỉ giao đến"
              prefix={<FaMapMarkerAlt />}
              value={useAddress?.fullAddress}
            />
          </div>
        </div>
        {shops.length > 0 ? (
          <div className="flex flex-col gap-2 p-4">
            {shops.map((item, index) => (
              <ShopCard key={index} shop={item} />
            ))}
          </div>
        ) : (
          <div className="items-center flex flex-col mt-10">
            <span>Không tìm thấy cửa hàng gần bạn</span>
            <Button text="Chọn địa chỉ" primary onClick={() => setOpenAddress(true)} />
          </div>
        )}
      </div>
      {useAddress !== undefined && (
        <AddressGongDialog
          slideFromBottom="all"
          title="Nhập địa chỉ"
          mobileSizeMode
          isOpen={openAddress}
          fullAddress={useAddress?.fullAddress}
          onClose={() => setOpenAddress(false)}
          onChange={(data) => {
            if (data.fullAddress) {
              setUseAddress({
                fullAddress: data.fullAddress,
                lat: data.lat,
                lg: data.lg,
              });
            }
          }}
        />
      )}
    </div>
  );
}
