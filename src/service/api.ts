import axios from "axios";
import { PropertieRoute } from "./route/properties/propertieRoute";
import { CityRoute } from "./route/city/cityRoute";
import { ValuationRoute } from "./route/valuation/valuationRoute";
import { UserRoute } from "./route/user/userRoute";
import { Cookies } from "@/auth/cookies";
import { OwnerRoute } from "./route/owner/ownerRoute";

const server = axios.create({
  baseURL: "http://localhost:8081",
});

server.interceptors.request.use(
  async (config) => {
    const token = await Cookies.get("invistaix");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export class Api {
  propertie = new PropertieRoute(server);
  city = new CityRoute(server);
  valuation = new ValuationRoute(server);
  user = new UserRoute(server);
  owner = new OwnerRoute(server);
}
