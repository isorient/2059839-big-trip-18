import {
  render,
  replace,
  remove,
  RenderPosition
} from '../framework/render.js';

import TripInfoView from '../view/trip-info-view.js';


export default class TripInfoPresenter {
  #tripInfo = null;
  #tripInfoContainerElement = null;

  #tripInfoComponent = null;

  constructor(tripInfoContainerElement) {
    this.#tripInfoContainerElement = tripInfoContainerElement;
  }

  init = (points, offers, destinations) => {
    this.#prepareTripInfo(points, offers, destinations);
    this.#renderTripInfo();
  };

  destroy = () => {
    remove(this.#tripInfoComponent);
  };

  #renderTripInfo = () => {
    const prevTripInfoComponent = this.#tripInfoComponent;
    this.#tripInfoComponent = new TripInfoView(this.#tripInfo);

    if (prevTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#tripInfoContainerElement, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  };

  #calculateTripTotalCost = (points, offers) => {
    let totalCost = 0;

    points.map((point) => {
      const offerByType = offers.find((offer) => offer.type === point.type);

      offerByType.offers.forEach((offer) => {
        if (point.offers.includes(offer.id)) {
          totalCost += offer.price;
        }
      });

      totalCost += point.basePrice;
    });

    return totalCost;
  };

  #getTripCities = (points, destinations) => {
    let firstCity = null;
    let lastCity = null;
    const tripCities = [];

    points.forEach((point, index) => {
      const pointDestination = destinations.find((destination) => destination.id === point.destination);
      firstCity = (index === 0) ? pointDestination.name : firstCity;
      lastCity = (index === points.length - 1) ? pointDestination.name : lastCity;

      if (!tripCities.includes(pointDestination.name)) {
        tripCities.push(pointDestination.name);
      }
    });

    return ({
      firstCity,
      lastCity,
      tripCities
    });
  };

  #getTripStartDate = (points) => points[0].dateFrom;

  #getTripEndDate = (points) => points[points.length - 1].dateTo;

  #prepareTripInfo = (points, offers, destinations) => {
    this.#tripInfo = {
      route: this.#getTripCities(points, destinations),
      startDate: this.#getTripStartDate(points),
      endDate: this.#getTripEndDate(points),
      totalCost: this.#calculateTripTotalCost(points, offers),
    };

    return this.#tripInfo;
  };

}
