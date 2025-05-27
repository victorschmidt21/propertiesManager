import { AxiosInstance } from "axios";
import { CityAttributes } from "./city";

export class CityRoute {
  server: AxiosInstance | null;
  constructor(server: AxiosInstance | null) {
    this.server = server;
  }

  async getByState(id: Number): Promise<CityAttributes[]> {
    return (await this.server?.get("/city/" + id)).data;
  }
}
