import {
  getPrettyDatetime,
  getStartDatetime,
  getEndDatetime,
  getDatesDifference
} from '../utils/dates.js';

import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  'id': null,
  'type': 'flight',
  'dateFrom': getStartDatetime(),
  'dateTo': getEndDatetime(),
  'destination': 1,
  'basePrice': '',
  'isFavorite': false,
  'offers': []
};

const formFieldSetting = {
  price:{
    isRequired: true,
    minValue: 0
  },
};

const prepareWrapperTypesList = (selectedType, offers, isDisabled) => {
  const typeElement = offers.map((offerItem) => offerItem.type)
    .sort()
    .map((offer) => {
      const isChecked = offer === selectedType
        ? 'checked'
        : '';

      return (
        `<div class="event__type-item">
          <input id="event-type-${offer}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer}" ${isChecked}>
          <label class="event__type-label  event__type-label--${offer}" for="event-type-${offer}">${offer}</label>
        </div>`
      );
    })
    .join('');

  return (
    `<div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${selectedType}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle" type="checkbox" ${isDisabled ? 'disabled' : ''}>

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${typeElement}
        </fieldset>
      </div>
    </div>`
  );
};

const prepareDestinationList = (selectedDestinationName, destinations) => (destinations.map((destinationItem) => destinationItem.name)
  .sort()
  .map((destination) => `<option value="${destination}" ${destination === selectedDestinationName ? 'selected' : ''}>${destination}</option>`)
  .join('')
);


const prepareDestinationField = (pointType, selectedDestination, destinations, isDisabled) => (
  `<div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
      ${pointType}
    </label>
    <select class="event__input  event__input--destination" id="event-destination-1" name="event-destination" value="${selectedDestination.name}"  ${isDisabled ? 'disabled' : ''}>
    ${prepareDestinationList(selectedDestination.name, destinations)}
    </select>
  </div>`
);

const prepareTimeField = (dateFrom, dateTo, isDisabled) => (
  `<div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getPrettyDatetime(dateFrom)}" ${isDisabled ? 'disabled' : ''}>
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getPrettyDatetime(dateTo)}" ${isDisabled ? 'disabled' : ''}>
  </div>`
);

const preparePrice = (price, isDisabled) => (
  `<div class="event__field-group  event__field-group--price">
  <label class="event__label" for="event-price-1">
    <span class="visually-hidden">Price</span>
    &euro;
  </label>
  <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}" min="${formFieldSetting.price.minValue}" ${formFieldSetting.price.isRequired ? 'required' : ''} ${isDisabled ? 'disabled' : ''}>
  </div>`
);

const prepareOffers = (selectedOffers, availableOffers, isDisabled) => {
  if (availableOffers.length === 0 || availableOffers === null || availableOffers === undefined) {
    return '';
  }

  const offerElement = availableOffers.map((offer) => {
    const isChecked = selectedOffers.includes(offer.id)
      ? 'checked'
      : '';

    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${isChecked} ${isDisabled ? 'disabled' : ''}>
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
};

const prepareDestinationPhoto = (photosList) => {
  if (photosList.length === 0 || photosList === null || photosList === undefined) {
    return '';
  }

  const photoElement = photosList.map( (item) => (`<img class="event__photo" src="${item.src}" alt="${item.description}"></img>`))
    .join('');
  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${photoElement}
      </div>
    </div>`
  );
};

const prepareDestinationDetails = (selectedDestination) => (
  `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${selectedDestination.description}</p>
    ${prepareDestinationPhoto(selectedDestination.pictures)}
  </section>`
);

const prepareSaveButton = (isSaving, isDisabled) => (`<button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>`);

const prepareResetButton = (isNewPoint, isDeleting, isDisabled) => {
  const deleteButtonText = isDeleting ? 'Deleting...' : 'Delete' ;
  const buttonText = isNewPoint ? 'Cancel' : deleteButtonText ;

  return `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${buttonText}</button>`;
};

const prepareRollUpButton = (isNewPoint, isDisabled) => {
  if (isNewPoint) {
    return '';
  }

  return (
    `<button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
    <span class="visually-hidden">Open event</span>
    </button>`
  );
};

const createPointEditTemplate = (point, offers, destinations) => {
  const isNewPoint = point.id === null || point.id === undefined;
  const {
    dateFrom,
    dateTo,
    type,
    destination,
    basePrice,
    offers: selectedOffers,
    isDisabled,
    isSaving,
    isDeleting
  } = point;
  const selectedDestination = destinations.find((item) => item.id === destination);
  const { offers: availableOffers } = offers.find((item) => item.type === type);

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          ${prepareWrapperTypesList(type, offers, isDisabled)}

          ${prepareDestinationField(type, selectedDestination, destinations, isDisabled)}
          ${prepareTimeField(dateFrom, dateTo, isDisabled)}
          ${preparePrice(basePrice, isDisabled)}
  
          ${prepareSaveButton(isSaving, isDisabled)}
          ${prepareResetButton(isNewPoint, isDeleting, isDisabled)}
          ${prepareRollUpButton(isNewPoint, isDisabled)}
        </header>
        <section class="event__details">
          ${prepareOffers(selectedOffers, availableOffers, isDisabled)}
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
    this.element.querySelector('form').addEventListener('submit', this.#onFormSubmit);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onFormDeleteClick);
  };

  setFormClickHandler = (callback) => {
    this._callback.formClick = callback;
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#onFormClick);
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
    this.element.querySelector('.event__type-list').addEventListener('click', this.#onTypeListClick);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#onDestinationChange);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#onPriceChange);
    this.element.querySelector('.event__available-offers')?.addEventListener('click', this.#onOffersClick);
  };

  #setDatepicker = () => {
    this.#startDatePicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onClose: this.#onStartDateChange,
      },
    );

    this.#endDatePicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        onClose: this.#onEndDateChange,
      },
    );
  };

  #onStartDateChange = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });

    const datesDifference = getDatesDifference(this._state.dateTo, this._state.dateFrom);

    if (datesDifference < 0) {
      this.updateElement({
        dateTo: getEndDatetime(this._state.dateFrom),
      });
    }

  };

  #onEndDateChange = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });

    const datesDifference = getDatesDifference(this._state.dateTo, this._state.dateFrom);
    if (datesDifference < 0) {
      this.updateElement({
        dateFrom: this._state.dateTo,
      });
    }
  };

  #onFormSubmit = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #onFormDeleteClick = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(PointEditView.parseStateToPoint(this._state));
  };

  #onFormClick = (evt) => {
    evt.preventDefault();
    this._callback.formClick(PointEditView.parseStateToPoint(this._state));
  };

  #onTypeListClick = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    this.updateElement({
      type: evt.target.value,
      offers:[],
    });
  };

  #onDestinationChange = (evt) => {
    const newDestination = this.#destinationData.find((item) => item.name === evt.target.value);
    if (newDestination !== undefined) {
      this.updateElement({
        destination: newDestination.id,
      });
    }
  };

  #onPriceChange = (evt) => {
    this._setState({
      basePrice: Number(evt.target.value),
    });
  };

  #onOffersClick = (evt) => {
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

  static parsePointToState = (point) => (
    {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    }
  );

  static parseStateToPoint = (state) => {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  };
}
