import { useEffect, useState } from "react";
import { Dialog, DialogPropsType } from "../../../shared/utilities/dialog/dialog";
import GoongMap, { Marker, NavigationControl } from "@goongmaps/goong-map-react";
import { GoongGeocoderService } from "../../../../lib/helpers/goong";
import { Button } from "../../../shared/utilities/form/button";
import { RiMapPinFill } from "react-icons/ri";
import { Select } from "../../../shared/utilities/form/select";
import { IoConstructOutline } from "react-icons/io5";

interface PropsType extends DialogPropsType {
  address: string;
  location: { latitude: number; longitude: number };
  onSelectLocation: ({ latitude, longitude }) => any;
}
export function BranchLocationDialog({ address, location, onSelectLocation, ...props }: PropsType) {
  const [placeId, setPlaceId] = useState<string>(undefined);
  const [viewport, setViewport] = useState({
    longitude: 106.6968302,
    latitude: 10.7797855,
    zoom: 16,
  });

  useEffect(() => {
    if (props.isOpen) {
      if (location) {
        setViewport({
          ...viewport,
          ...location,
        });
      }
      if (address && !location) {
        GoongGeocoderService.geocode(address).then((res) => {
          if (res.length) {
            setPlaceId(res[0].place_id);
          }
        });
      }
    } else {
      setPlaceId(undefined);
    }
  }, [props.isOpen]);

  useEffect(() => {
    if (placeId) {
      GoongGeocoderService.getPlaceDetail(placeId).then((res) => {
        setViewport({
          ...viewport,
          latitude: res.geometry.location.lat,
          longitude: res.geometry.location.lng,
        });
      });
    }
  }, [placeId]);

  return (
    <Dialog title="Chọn toạ độ chi nhánh" {...props}>
      <Dialog.Body>
        <div className="text-gray-600 mb-2">
          * <b className="underline">Nhập địa chỉ</b> để đến vị trí và{" "}
          <b className="underline">kéo bản đồ</b> để đánh dấu toạ độ của chi nhánh
        </div>
        <div className="flex mb-4">
          <Select
            className="h-12"
            placeholder="Tìm kiếm địa chỉ"
            value={placeId}
            onChange={setPlaceId}
            autocompletePromise={({ id, search }) =>
              GoongGeocoderService.getPlaces(search).then((res) => {
                return (
                  res?.map(
                    (x) =>
                      ({
                        value: x.place_id,
                        label:
                          x.structured_formatting.main_text +
                          " " +
                          x.structured_formatting.secondary_text,
                      } as Option)
                  ) || []
                );
              })
            }
          />
        </div>
        <GoongMap
          goongApiAccessToken={GoongGeocoderService.mapKey}
          width="640px"
          height="480px"
          className="border border-gray-400 rounded"
          scrollZoom={true}
          {...viewport}
          onViewportChange={setViewport}
        >
          <Marker {...viewport}>
            <i className="text-6xl text-primary absolute transform -translate-x-1/2 -translate-y-full">
              <RiMapPinFill />
            </i>
          </Marker>
          <NavigationControl showZoom={true} className="p-4" />
        </GoongMap>
      </Dialog.Body>
      <Dialog.Footer>
        <Button
          primary
          className="bg-gradient h-16 px-12 mb-4 mx-auto"
          text="Chọn toạ độ được đánh dấu"
          onClick={() => {
            const { latitude, longitude } = viewport;
            onSelectLocation({ latitude, longitude });
            props.onClose();
          }}
        />
      </Dialog.Footer>
    </Dialog>
  );
}
