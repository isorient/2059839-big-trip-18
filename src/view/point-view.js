import {
  getPrettyDate,
  getPrettyTime,
  getDatetimeDuration
} from '../utils/dates.js';
import AbstractView from '../framework/view/abstract-view.js';

const getEventSchedule = (startDate, endDate) => (
  `<div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="${startDate}">${getPrettyTime(startDate)}</time>
      &mdash;
      <time class="event__end-time" datetime="${endDate}">${getPrettyTime(endDate)}</time>
    </p>
    <p class="event__duration">${getDatetimeDuration(startDate, endDate)}</p>
  </div>`
);

const getOfferItems = (point, offersData) => {
  const offerByType = offersData.find((el) => el.type === point.type);

  const resultElement = point.offers.map(
    (offerId) => {
      const lololo = offerByType.offers.find( (elem) => elem.id === offerId );

      return (`<li class="event__offer">
        <span class="event__offer-title">${lololo.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${lololo.price}</span>
        </li>`);
    })
    .join('');

  return resultElement;
};

const getSelectedOffers = (point, offersData) => {
  if (point.offers.length > 0) {
    return (
      `<h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${getOfferItems(point, offersData)}
      </ul>`
    );
  }
};

const getEventDate = (startDate) => (`<time class="event__date" datetime="${startDate}">${getPrettyDate(startDate)}</time>`);

const getEventIcon = (eventType) => (
  `<div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType}.png" alt="Event type icon"></img>
  </div>`
);

const getEventTitle = (eventType, eventDestination) => (`<h3 class="event__title">${eventType} ${eventDestination}</h3>`);

const getEventPrice = (eventBasePrice) => (
  `<p class="event__price">
    &euro;&nbsp;<span class="event__price-value">${eventBasePrice}</span>
  </p>`
);

const getFavoriteButton = (isFavorite) => {
  const favoriteClassName = isFavorite
    ? ' event__favorite-btn--active'
    : '' ;

  return (
    `<button class="event__favorite-btn${favoriteClassName}" type="button">
      <span class="visually-hidden">'Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>`
  );
};

const getRollupButton = () => (
  `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`
);

const createPointTemplate = (point, offersData, destinationData) => {
  const destination = destinationData.find( (el) => el.id === point.destination);

  return (
    `<li class="trip-events__item">
    <div class="event">
      ${getEventDate(point.dateFrom)}
      ${getEventIcon(point.type)}
      ${getEventTitle(point.type, destination.name)}
      ${getEventSchedule(point.dateFrom, point.dateTo)}
      ${getEventPrice(point.basePrice)}
      
      ${getSelectedOffers(point, offersData)}
      ${getFavoriteButton(point.isFavorite)}
      ${getRollupButton()}
    </div>
  </li>`
  );
};

export default class PointView extends AbstractView {
  #point = null;
  #offersData = null;
  #destinationData = null;

  constructor(point, offersData, destinationData) {
    super();
    this.#point = point;
    this.#offersData = offersData;
    this.#destinationData = destinationData;
  }

  get template() {
    return createPointTemplate(this.#point, this.#offersData, this.#destinationData);
  }

  setEditClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
