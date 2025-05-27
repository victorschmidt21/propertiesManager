import { AxiosInstance } from "axios";
import { PropertiesAttributes, PropertiesDTOAttributes } from "./properties";

export class PropertieRoute {
  server: AxiosInstance | null;
  route: string

  constructor(server: AxiosInstance | null) {
    this.server = server;
    this.route = "/imovel"
  }

  async getByOwner(id: number): Promise<PropertiesAttributes[]> {
    const data = (await this.server?.get(this.route + "/owner/" + id))?.data
    return data.map(item => new PropertiesAttributes(item))
  }

  async getByUser(): Promise<PropertiesAttributes[]> {
    const data = (await this.server?.get(this.route + "/"))?.data;
    return data.map((item) => new PropertiesAttributes(item));
  }

  async getByUserAndPropertie(id: number): Promise<PropertiesAttributes> {
    const data = (await this.server?.get(this.route + "/" + id)).data;
    return new PropertiesAttributes(data);
  }

  async delete(id: Number): Promise<String> {
    return await this.server?.delete(this.route + "/" + id);
  }

  async create(
    propertie: PropertiesDTOAttributes
  ): Promise<PropertiesAttributes> {
    return await this.server?.post(this.route, propertie);
  }
}
