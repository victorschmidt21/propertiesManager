import { AddressAttributes } from "../address/address";
import { OwnerAttributes } from "../owner/owner";
import { UserAttributes } from "../user/user";

export class PropertiesAttributes {
  id_imovel: Number;
  nome_imovel: string;
  valueRegistration: Number;
  date_Value: string;
  adress: AddressAttributes;
  user: UserAttributes;
  owner: OwnerAttributes;

  constructor({
    id_imovel,
    nome_imovel,
    valueRegistration,
    date_Value,
    user,
    owner,
    adress,
  }: PropertiesAttributes) {
    this.id_imovel = id_imovel;
    this.nome_imovel = nome_imovel;
    this.valueRegistration = valueRegistration;
    this.date_Value = date_Value;
    this.user = user;
    this.owner = owner;
    this.adress = new AddressAttributes(adress);
  }

  formatCurrency() {
    const numericValue = parseFloat(this.valueRegistration.toString());
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };
}

export interface PropertiesDTOAttributes {
  nomeImovel: string;
  street: string;
  number: Number;
  neighborhood: string;
  cep: Number;
  valueRegistration: string;
  dateValue: Date;
  cityId: Number;
  userId: string;
  ownerId: Number;
}
