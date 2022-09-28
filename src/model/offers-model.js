import {
  UpdateType,
  DataSource
} from '../constants.js';

import Observable from '../framework/observable.js';

export default class OffersModel extends Observable {
  #offers = null;
  #offersApiService = null;

  constructor (offersApiService) {
    super();
    this.#offersApiService = offersApiService;
  }

  get offers() {
    return this.#offers;
  }

  init = async () => {
    try {
      const offers = await this.#offersApiService.offers;
      this.#offers = offers.map(this.#adaptToClient);
    } catch (err) {
      this.#offers = [];
    }

    this._notify(UpdateType.INIT, undefined, DataSource.OFFERS);
  };

  #adaptToClient = (offer) => ({...offer});
}
