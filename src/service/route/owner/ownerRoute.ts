import { AxiosInstance } from "axios";
import { OwnerAttributes, OwnerDTOAttributes } from "./owner";

export class OwnerRoute {
  server: AxiosInstance | null;
  route: string;
  constructor(server: AxiosInstance | null) {
    this.server = server;
    this.route = "/owner";
  }

  async getOwners(): Promise<OwnerAttributes[]> {
    const data = (await this.server?.get(this.route))?.data;
    return data.map((item) => new OwnerAttributes(item));
  }

  async getOwnerById(id: number): Promise<OwnerAttributes> {
    const data = (await this.server?.get(this.route + "/" + id))?.data;
    return new OwnerAttributes(data);
  }

  async createOwner(ownerDTO: OwnerDTOAttributes): Promise<OwnerAttributes> {
    const data = (await this.server?.post(this.route, ownerDTO))?.data;
    return new OwnerAttributes(data);
  }

  async editOwner(
    ownerDTO: Partial<OwnerDTOAttributes>,
    id: number
  ): Promise<OwnerAttributes> {
    const data = (await this.server?.put(this.route + "/" + id, ownerDTO))
      ?.data;
    return new OwnerAttributes(data);
  }

  async deleteOwner(id: Number): Promise<string> {
    return await this.server?.delete(this.route + "/" + id);
  }
}
