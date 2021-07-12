import goongjs from "@goongmaps/goong-geocoder";

export const GoongGeocoder = new goongjs({
  accessToken: "SD0vJABEWMql2sKaK6S4rUJyuDDJUGUwuNK4RelX",
});

export const GoongSearch = (input) =>
  GoongGeocoder.autoCompleteService
    .search({ input })
    .send()
    .then((res) => {
      return res.body;
    });
export const GoongPlaceDetail = (placeId) =>
  GoongGeocoder.autoCompleteService
    .placeDetail({ placeid: placeId })
    .send()
    .then((res) => res.body);
