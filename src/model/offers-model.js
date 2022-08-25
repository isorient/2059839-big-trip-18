import {getOffersList} from '../chmock/offers.js';

export default class OffersModel {
  offers = getOffersList();

  getOffers = () => this.offers;
}
