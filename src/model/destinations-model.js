import {createDestination} from '../chmock/destinations.js';

export default class DestinationsModel {
  #destinations = Array.from({length:7}, (_,index) => createDestination(index));

  get destinations() {
    return this.#destinations;
  }
}
