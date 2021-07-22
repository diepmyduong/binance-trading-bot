import React, { useEffect, useState } from "react";
import { Dialog, DialogPropsType } from "../../../shared/utilities/dialog/dialog";
import { Input } from "../../../shared/utilities/form/input";
import { NotFound } from "../../../shared/utilities/not-found";
import { RiMapPinLine } from "react-icons/ri";
import { Spinner } from "../../../shared/utilities/spinner";
import {
  GoongGeocoderService,
  GoongPlaceDetail,
  GoongAutocompletePlace,
} from "../../../../lib/helpers/goong";
interface Propstype extends DialogPropsType {
  fullAddress: string;
  onChange: (data: { fullAddress: string; lg: number; lat: number }) => void;
}
export const AddressGongDialog = ({ onChange, fullAddress = "", ...props }: Propstype) => {
  const [addressInput, setAddressInput] = useState(fullAddress);
  const [placeDetail, setPlaceDetail] = useState<GoongPlaceDetail>(null);
  const [addressList, setAddressList] = useState<GoongAutocompletePlace[]>(null);
  useEffect(() => {
    if (props.isOpen && placeDetail) {
      setAddressInput(placeDetail.name + ", " + placeDetail.formatted_address);
    }
  }, [props.isOpen]);

  useEffect(() => {
    if (addressInput) {
      setAddressList(null);
      GoongGeocoderService.getPlaces(addressInput).then((res) => {
        setAddressList(res);
      });
    } else {
      setAddressList(undefined);
    }
  }, [addressInput]);

  useEffect(() => {
    if (placeDetail) {
      onChange({
        fullAddress: placeDetail.name + ", " + placeDetail.formatted_address,
        lat: placeDetail.geometry.location.lat,
        lg: placeDetail.geometry.location.lng,
      });
    } else {
      onChange({
        fullAddress: "",
        lat: 10.72883,
        lg: 106.725484,
      });
    }
  }, [placeDetail]);
  return (
    <Dialog {...props}>
      <div className="relative v-scrollbar" style={{ height: "calc(100vh - 100px" }}>
        <div className="p-4 bg-gray-100 sticky top-0">
          <Input
            autoFocus
            className="h-14"
            debounce
            clearable
            name="address"
            placeholder="Tìm địa chỉ giao hàng tại đây"
            value={addressInput}
            onChange={(val) => {
              setAddressInput(val);
            }}
          />
        </div>
        {addressInput === undefined && (
          <NotFound icon={<RiMapPinLine />} text="Nhập địa chỉ để tìm kiếm địa điểm giao hàng" />
        )}
        {addressList === null && <Spinner />}
        {addressList && (
          <>
            {addressList.length ? (
              <>
                {addressList.map((address) => (
                  <button
                    type="button"
                    key={address.description}
                    className="w-full animate-emerge p-4 flex items-start text-gray-600 border-b border-gray-200 hover:bg-primary-light"
                    onClick={async () => {
                      let placeDetail = await GoongGeocoderService.getPlaceDetail(address.place_id);
                      setPlaceDetail({
                        ...placeDetail,
                        name: address.structured_formatting.main_text,
                        formatted_address: address.structured_formatting.secondary_text,
                      });
                      props.onClose();
                    }}
                  >
                    <i className="text-xl mr-2 mt-1">
                      <RiMapPinLine />
                    </i>
                    <div className="text-left">
                      <div className="font-semibold text-lg">
                        {address.structured_formatting.main_text}
                      </div>
                      <div>{address.structured_formatting.secondary_text}</div>
                    </div>
                  </button>
                ))}
              </>
            ) : (
              <NotFound text="Không tìm thấy địa chỉ" />
            )}
          </>
        )}
      </div>
      {/* <AddressGroup
              {...{
                wardId: orderInput.buyerWardId,
                districtId: orderInput.buyerDistrictId,
                provinceId: orderInput.buyerProvinceId,
                address: orderInput.buyerAddress,
              }}
              required
            />
            <SaveButtonGroup onCancel={() => setOpenInputAddress(false)} /> */}
    </Dialog>
  );
};
