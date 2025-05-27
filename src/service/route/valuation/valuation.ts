import { PropertiesAttributes } from "../properties/properties"

export interface ValuationAttributes{
    id: Number
    nameResponsible: string
    date: Date
    description: string
    rotaImage: string
    value: Number
    imovel: PropertiesAttributes
}
export interface ValuationDTOAttributes{
    nameResponsible: string
    date: Date
    description: string
    rotaImage: string
    value: Number
    imovelId: Number
}