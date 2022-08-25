import {createDestination} from '../chmock/destinations.js';

export default class DestinationsModel {
  destinations = Array.from({length:7}, (v,i) => createDestination(i));

  getDestinations = () => this.destinations;
}
