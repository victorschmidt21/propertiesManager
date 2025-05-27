import { CityAttributes } from "../city/city";

export class AddressAttributes {
  id: Number;
  street: string;
  number: Number;
  neighborhood: string;
  cep: Number;
  city: CityAttributes;

  constructor({
    id,
    street,
    number,
    neighborhood,
    cep,
    city,
  }: AddressAttributes) {
    this.id = id;
    this.street = street;
    this.number = number;
    this.neighborhood = neighborhood;
    this.cep = cep;
    this.city = new CityAttributes(city);
  }

  toElegant() : string {
    const cepFormatted =
      this.cep?.toString().replace(/^(\d{5})(\d{3})$/, "$1-$2") || "";
    const cityName = this.city?.nome || "";
    const state = this.city?.state.name || "";

    return `${this.street}, ${this.number} - ${this.neighborhood ? `${this.neighborhood},` : ""} ${cityName} - ${state}, ${cepFormatted}`;
  }
}
