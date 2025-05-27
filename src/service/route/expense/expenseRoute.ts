import { AxiosInstance } from "axios";
import { ExpenseAttributes, ExpenseDTOAttributes } from "./expense";

export class ExpenseRoutes {
  server: AxiosInstance | null;
  constructor(server: AxiosInstance | null) {
    this.server = server;
  }

  async create(expense: ExpenseDTOAttributes): Promise<ExpenseAttributes> {
    return (await this.server.post("/expense", expense)).data;
  }

  async delete(id: number): Promise<void> {
    return await this.server.delete("/expense/" + id);
  }

  async update(
    expense: ExpenseDTOAttributes,
    id: number
  ): Promise<ExpenseAttributes> {
    return (await this.server.put("/expense/" + id, expense)).data;
  }
}
