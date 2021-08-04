import React, { useEffect, useState } from "react";
import { ShopCard } from "./components/shop-card";
import { Label } from "../../shared/utilities/form/label";
import { Input } from "../../shared/utilities/form/input";
import { FaMapMarkerAlt } from "react-icons/fa";
import { AddressGongDialog } from "../customer/components/address-gong-dialog";
import { GoongGeocoderService } from "../../../lib/helpers/goong";

export function ShopsPage() {
  const [openAddress, setOpenAddress] = useState(false);
  let [useAddress, setUseAddress] = useState<{ fullAddress: string; lg: number; lat: number }>();
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          GoongGeocoderService.getPlaceDetailByLatLg(
            position.coords.latitude,
            position.coords.longitude
          ).then((res) => {
            if (res && res.length > 0) {
              let newUserAddress = {
                fullAddress: res[0].formatted_address,
                lat: res[0].geometry.location.lat,
                lg: res[0].geometry.location.lng,
              };
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
  }, []);
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
        <div className="flex flex-col gap-2 p-4">
          {shops.map((item, index) => (
            <ShopCard key={index} />
          ))}
        </div>
      </div>
      {useAddress !== undefined && (
        <AddressGongDialog
          slideFromBottom="all"
          title="Nhập địa chỉ"
          mobileSizeMode
          isOpen={openAddress}
          fullAddress={useAddress?.fullAddress || ""}
          onClose={() => setOpenAddress(false)}
          onChange={(data) =>
            setUseAddress({
              fullAddress: data.fullAddress,
              lat: data.lat,
              lg: data.lg,
            })
          }
        />
      )}
    </div>
  );
}
const shops = [
  "123123",
  "123123",
  "123123",
  "123123",
  "123123",
  "123123",
  "123123",
  "123123",
  "123123",
  "123123",
  "123123",
];
