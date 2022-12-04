import { action, computed, makeObservable, observable } from 'mobx';

interface ICountry {
  country: string;
  iso_code: string;
  name: string;
  latitude: number;
  longitude: number;
  rank: number;
  is_virtual: boolean;
  // mapped to country
  value: string;
  id: number;
}

interface IProtocol {
  name: string;
  protocol: string;
  port_number: number;
  is_multiport: boolean;
  value: string;
  id: number;
}

export class DomainStoreImpl {
  countries: ICountry[] = [];

  protocols: IProtocol[] = [];

  plainCountries: any[] = [];

  plainProtocols: any[] = [];

  plainCities: any[] = [];

  constructor() {
    makeObservable(this, { countries: observable, protocols: observable });
    this.plainCountries = [];
    this.plainProtocols = [];
    this.plainCities = [];
  }

  setProtocols(protocolArray: IProtocol[]) {
    let itemId = 0;
    protocolArray.forEach((item) => {
      // eslint-disable-next-line no-plusplus
      itemId++;

      item.value = item.protocol;
      item.id = itemId;
      this.plainProtocols.push(item);
      this.protocols.push(item);
    });
  }

  setCountries(countryArray: ICountry[]) {
    let itemId = 0;
    countryArray.forEach((item) => {
      // eslint-disable-next-line no-plusplus
      itemId++;

      item.value = item.country;
      item.id = itemId;
      this.countries.push(item);
      this.plainCountries.push(item);
    });
  }

  isDomainLoaded() {
    return this.countries.length > 1 && this.protocols.length > 1;
  }

  getProtocols() {
    return this.plainProtocols;
  }

  getCountries() {
    return this.plainCountries;
  }
}

export const DomainStore = new DomainStoreImpl();
