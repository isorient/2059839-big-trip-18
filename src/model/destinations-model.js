import {
  UpdateType,
  DataSource
} from '../constants.js';

import Observable from '../framework/observable.js';

export default class DestinationsModel extends Observable {
  #destinations = null;
  #destinationsApiService = null;

  constructor (destinationsApiService) {
    super();
    this.#destinationsApiService = destinationsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  init = async () => {
    try {
      const destinations = await this.#destinationsApiService.destinations;
      this.#destinations = destinations.map(this.#adaptToClient);
    } catch (err) {
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT, undefined, DataSource.DESTINATIONS);
  };

  #adaptToClient = (destination) => ({...destination});
}
