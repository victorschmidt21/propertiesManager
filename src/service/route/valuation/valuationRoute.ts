import { AxiosInstance } from "axios";
import { ValuationAttributes, ValuationDTOAttributes } from "./valuation";

export class ValuationRoute {
  server: AxiosInstance | null;
  constructor(server: AxiosInstance | null) {
    this.server = server;
  }

  async getByIdPropertie(id: Number): Promise<ValuationAttributes[]> {
    return (await this.server.get("/valuation/" + id)).data;
  }
  async create(
    valuation: ValuationDTOAttributes
  ): Promise<ValuationAttributes> {
    console.log(valuation);
    return (await this.server.post("/valuation", valuation)).data;
  }
}
