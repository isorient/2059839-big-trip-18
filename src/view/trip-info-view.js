import AbstractView from '../framework/view/abstract-view.js';
import {getPrettyDate} from '../utils/dates.js';

const MAX_CITIES_NUM = 3;

const getThirdCity = (route) => {
  let thirdCity = null;

  route.tripCities.forEach((city) => {
    thirdCity = (city !== route.firstCity && city !== route.lastCity) ? city : thirdCity;
  });
  return thirdCity;
};

const createTripInfoTemplate = (tripInfo) => {
  const routeThirdCity = (tripInfo.route.tripCities.length === MAX_CITIES_NUM) ? getThirdCity(tripInfo.route) : '...';

  return (
    `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${tripInfo.route.firstCity} &mdash; ${routeThirdCity} &mdash; ${tripInfo.route.lastCity}</h1>
  
      <p class="trip-info__dates">${getPrettyDate(tripInfo.startDate)}&nbsp;&mdash;&nbsp;${getPrettyDate(tripInfo.endDate)}</p>
    </div>
  
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripInfo.totalCost}</span>
    </p>
  </section>`
  );
};

export default class TripInfoView extends AbstractView {
  #tripInfo = null;

  constructor (tripInfo) {
    super();
    this.#tripInfo = tripInfo;
  }

  get template() {
    return createTripInfoTemplate(this.#tripInfo);
  }
}
