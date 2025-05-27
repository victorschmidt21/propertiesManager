import { PropertiesAttributes } from "../properties/properties";

export interface ExpenseAttributes{
    title: string,
    description: string,
    value: string,
    date: Date,
    imovel: PropertiesAttributes
}
export interface ExpenseDTOAttributes{
    title: string,
    description: string,
    value: string,
    date: Date,
    imovelId: Number
}