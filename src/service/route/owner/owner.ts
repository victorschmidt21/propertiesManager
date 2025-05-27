import { AddressAttributes } from "../address/address";
import { UserAttributes } from "../user/user";

export class OwnerAttributes {
  id: Number;
  name: string;
  cpf_cnpj: string;
  phone: string;
  email: string;
  ativo: boolean;
  address: AddressAttributes;
  user: UserAttributes;

  constructor({
    id,
    name,
    cpf_cnpj,
    phone,
    email,
    ativo,
    address,
    user,
  }: OwnerAttributes) {
    this.id = id;
    this.name = name;
    this.cpf_cnpj = cpf_cnpj;
    this.phone = phone;
    this.email = email;
    this.ativo = ativo;
    this.address = new AddressAttributes(address);
    this.user = new UserAttributes(user);
  }

  documentFormatter(): string {
    const cleaned = this.cpf_cnpj.replace(/\D/g, "");

    if (cleaned.length === 11) {
      return `CPF: ${cleaned.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        "$1.$2.$3-$4"
      )}`;
    } else if (cleaned.length === 14) {
      return `CNPJ: ${cleaned.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      )}`;
    } else {
      return this.cpf_cnpj; 
    }
  }

  phoneFormatter(): string {
    const cleaned = this.phone.toString().replace(/\D/g, "");

    if (cleaned.length === 10) {
      // Formato: (XX) XXXX-XXXX
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else if (cleaned.length === 11) {
      // Formato: (XX) XXXXX-XXXX
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else {
      // Caso não tenha 10 ou 11 dígitos, retorna como está
      return this.phone;
    }
  }
}

export interface OwnerDTOAttributes {
  name: string;
  cpf_cnpj: string;
  phone: string;
  email: string;
  street: string;
  number: Number;
  neighborhood: string;
  cep: Number;
  userId: string;
  cityId: number;
}
