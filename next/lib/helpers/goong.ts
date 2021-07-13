import axios from "axios";

export interface GoongAutocompletePlace {
  description: string;
  matched_substrings: string[];
  place_id: string;
  reference: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  terms: string[];
  has_children: boolean;
  display_type: string;
  score: number;
  plus_code: {
    compound_code: string;
    global_code: string;
  };
}

export interface GoongPlaceDetail {
  place_id: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  name: string;
}

class GoongGeocoder {
  apiKey = "SD0vJABEWMql2sKaK6S4rUJyuDDJUGUwuNK4RelX";
  hostName = `https://rsapi.goong.io`;

  hashedData = {};

  async getPlaces(fullAddress: string = ""): Promise<GoongAutocompletePlace[]> {
    const uri = `${this.hostName}/Place/AutoComplete`;
    const params = {
      api_key: this.apiKey,
      input: fullAddress,
      limit: 20,
      location: "10.762622,106.660172",
    };
    const hashedString = JSON.stringify({ uri, params });
    if (this.hashedData[hashedString]) return this.hashedData[hashedString];
    else
      return axios
        .get(uri, {
          params,
        })
        .then((res) => {
          this.hashedData[hashedString] = res.data.predictions;
          return res.data.predictions;
        })
        .catch((err) => null);
  }

  async getPlaceDetail(placeId: string = ""): Promise<GoongPlaceDetail> {
    const uri = `${this.hostName}/Place/Detail`;
    const params = {
      api_key: this.apiKey,
      place_id: placeId,
    };
    const hashedString = JSON.stringify({ uri, params });
    if (this.hashedData[hashedString]) return this.hashedData[hashedString];
    else
      return axios
        .get(uri, {
          params,
        })
        .then((res) => {
          this.hashedData[hashedString] = res.data.predictions;
          return res.data.result;
        })
        .catch((err) => null);
  }
}

export const GoongGeocoderService = new GoongGeocoder();

// export const GoongGeocoder = new goongjs({
//   accessToken: "SD0vJABEWMql2sKaK6S4rUJyuDDJUGUwuNK4RelX",
// });

// export const GoongSearch = async (input) =>
//   GoongGeocoder.autoCompleteService
//     .search({ input })
//     .send()
//     .then((res) => {
//       return res.body;
//     });

// export const GoongPlaceDetail = (placeId) =>
//   GoongGeocoder.autoCompleteService
//     .placeDetail({ placeid: placeId })
//     .send()
//     .then((res) => res.body);
