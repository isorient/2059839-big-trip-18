import {
  POINT_TYPES,
  DESTINATIONS_LIST
} from '../constants.js';
import {getPrettyDatetime} from '../utils/dates.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  'id': null,
  'type': null,
  'dateFrom': null,
  'dateTo': null,
  'destination': null,
  'basePrice': null,
  'isFavorite': false,
  'offers': []
};

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

const prepareDestinationList = () => {
  const destinationElement = DESTINATIONS_LIST.map((item) => `<option value="${item}"></option>`).join('');
  return (
    `<datalist id="destination-list-1">
      ${destinationElement}
    </datalist>`);
};
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
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${isChecked}>
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

const createPointEditTemplate = (point, offersData, destinationData) => {
  const { type: selectedType, offers: selectedOffers } = point;
  const selectedDestination = destinationData.find((el) => el.id === point.destination);
  const { offers: offersBySelectedType } = offersData.find((el) => el.type === point.type);

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

export default class PointEditView extends AbstractStatefulView {
  _state = null;
  #offersData = null;
  #destinationData = null;
  #startDatePicker = null;
  #endDatePicker = null;

  constructor(point = BLANK_POINT, offersData, destinationData) {
    super();
    this._state = PointEditView.parsePointToState(point);
    this.#offersData = offersData;
    this.#destinationData = destinationData;
    this.#setInnerHandlers();
    this.#setDatepicker();
  }

  get template() {
    return createPointEditTemplate(this._state, this.#offersData, this.#destinationData);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  };

  setFormClickHandler = (callback) => {
    this._callback.formClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formClickHandler);
  };

  reset = (point) => {
    this.updateElement(PointEditView.parsePointToState(point));
  };

  removeElement = () => {
    super.removeElement();

    if (this.#startDatePicker) {
      this.#startDatePicker.destroy();
      this.#startDatePicker = null;
    }

    if (this.#endDatePicker) {
      this.#endDatePicker.destroy();
      this.#endDatePicker = null;
    }
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormClickHandler(this._callback.formClick);
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('click', this.#typeListClickHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationInputHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('click', this.#offersClickHandler);
  };

  #setDatepicker = () => {
    this.#startDatePicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onChange: this.#startDateChangeHandler,
      },
    );

    this.#endDatePicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        onChange: this.#endDateChangeHandler,
      },
    );
  };

  #startDateChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #endDateChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(PointEditView.parseStateToPoint(this._state));
  };

  #formClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.formClick(PointEditView.parseStateToPoint(this._state));
  };

  #typeListClickHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    this.updateElement({
      type: evt.target.value,
      offers:[],
    });
  };

  #destinationInputHandler = (evt) => {
    const newDestination = this.#destinationData.find((el) => el.name === evt.target.value);
    if (newDestination !== undefined) {
      this.updateElement({
        destination: newDestination.id,
      });
    }
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      basePrice: Number(evt.target.value),
    });
  };

  #offersClickHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT'){
      return;
    }
    const currentOffers = this._state.offers.slice();
    const editedOfferId = Number(evt.target.id.replace('event-offer-',''));

    if (evt.target.checked) {
      currentOffers.push(editedOfferId);
    }

    if (!evt.target.checked) {
      currentOffers.splice(currentOffers.indexOf(editedOfferId), 1);
    }

    this.updateElement({
      offers: currentOffers
    });

  };

  static parsePointToState = (point) => ({...point});

  static parseStateToPoint = (state) => ({...state});
}
