import getOffersList from '../chmock/offers.js';

export default class OffersModel {
  #offers = getOffersList();

  get offers() {
    return this.#offers;
  }
}
