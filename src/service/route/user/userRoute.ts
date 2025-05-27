import { AxiosInstance } from "axios";
import { UserAttributes } from "./user";

export class UserRoute {
  server: AxiosInstance | null;
  constructor(server: AxiosInstance | null) {
    this.server = server;
  }
  async login(): Promise<UserAttributes> {
    return (
      await this.server.post(
        "/user/token",
        {}
      )
    ).data;
  }
}
