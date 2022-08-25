import {createElement} from '../render.js';
import {POINT_TYPES} from '../constants.js';
import {getPrettyDatetime} from '../utils.js';

const prepareWrapperTypesList = (selectedType) => {
  const typeElement = POINT_TYPES.map(
    (eventType) => {
      const isChecked = eventType === selectedType
        ? 'checked'
        : '';

      return (
        `<div class="event__type-item">
          <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${isChecked}>
          <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType}</label>
        </div>`
      );
    }
  )
    .join('');

  return (
    `<label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${selectedType}.png" alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${typeElement}
      </fieldset>
    </div>`
  );
};

const prepareDestinationList = () => (
  //TODO добавить список направлений не хардкодом
  `<datalist id="destination-list-1">
    <option value="Amsterdam"></option>
    <option value="Geneva"></option>
    <option value="Chamonix"></option>
  </datalist>`
);
const prepareDestinationField = (eventType, selectedDestination) => (
  `<div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
      ${eventType}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${selectedDestination.name}" list="destination-list-1">
    ${prepareDestinationList()}
  </div>`
);

const prepareTimeField = (dateFrom, dateTo) => (
  `<div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getPrettyDatetime(dateFrom)}">
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getPrettyDatetime(dateTo)}">
  </div>`
);

const preparePrice = (price) => (
  `<div class="event__field-group  event__field-group--price">
  <label class="event__label" for="event-price-1">
    <span class="visually-hidden">Price</span>
    &euro;
  </label>
  <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
  </div>`
);

const prepareOffers = (selectedOffers, offersBySelectedType) => {
  if (offersBySelectedType.length > 0) {
    const offerElement = offersBySelectedType.map((offer) => {
      const isChecked = selectedOffers.includes(offer.id)
        ? 'checked'
        : '';

      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-o${offer.id}" ${isChecked}>
          <label class="event__offer-label" for="event-offer-${offer.id}">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`
      );
    }
    )
      .join('');

    return (
      `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${offerElement}
        </div>
      </section>`
    );
  }
};

const prepareDestinationPhoto = (destinationPhoto) => {
  if (destinationPhoto.length > 0) {
    const photoElement = destinationPhoto.map( (el) => (`<img class="event__photo" src="${el.src}" alt="${el.description}"></img>`)
    )
      .join('');
    return (
      `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${photoElement}
        </div>
      </div>`
    );
  }
};

const prepareDestinationDetails = (selectedDestination) => (
  `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${selectedDestination.description}</p>
    ${prepareDestinationPhoto(selectedDestination.pictures)}
  </section>`
);

const createPointEditTemplate = (point = {}, offersData, destinationData) => {
  const { type: selectedType } = point;
  const selectedDestination = destinationData.find((el) => el.id === point.destination);
  const { offers: offersBySelectedType } = offersData.find((el) => el.type === point.type);
  const { offers: selectedOffers } = point;

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            ${prepareWrapperTypesList(selectedType)}
          </div>

          ${prepareDestinationField(selectedType, selectedDestination)}
          ${prepareTimeField(point.dateFrom, point.dateTo)}
          ${preparePrice(point.basePrice)}
  
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${prepareOffers(selectedOffers, offersBySelectedType)}
          ${prepareDestinationDetails(selectedDestination)}
        </section>
      </form>
    </li>`
  );
};

export default class PointEditView {
  constructor(point, offersData, destinationData) {
    this.point = point;
    this.offersData = offersData;
    this.destinationData = destinationData;
  }

  getTemplate() {
    return createPointEditTemplate(this.point, this.offersData, this.destinationData);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
