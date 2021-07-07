import axios from "axios";

export class HereMapRepository {
  constructor() {}

  appId: string = "E1sWiTZV6gtYhE7W6XYg";
  apiKey: string = "p03Ve2KqJ-IIsk-o2JvXG1j3Q2JrQsmkl6IpDg_mefc";

  async getCoordinatesFromAddress(fullAddress: string = ""): Promise<H.service.ServiceResult> {
    return axios
      .get(`https://geocode.search.hereapi.com/v1/geocode`, {
        params: {
          in: "countryCode:VNM",
          lang: "vi-VN",
          limit: 1,
          q: fullAddress,
          apiKey: this.apiKey,
        },
      })
      .then((res) => res.data.items[0])
      .catch((err) => null);
  }
}

export const HereMapService = new HereMapRepository();
