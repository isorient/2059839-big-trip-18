import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../constants.js';

const createSortTemplate = (currentSortType) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <div class="trip-sort__item  trip-sort__item--${SortType.DAY}${currentSortType === SortType.DAY ? 'active' : ''}">
      <input id="sort-${SortType.DAY}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortType.DAY}" checked data-sort-type="${SortType.DAY}">
      <label class="trip-sort__btn" for="sort-${SortType.DAY}">Day</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--event">
      <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
      <label class="trip-sort__btn" for="sort-event">Event</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--${SortType.TIME}${currentSortType === SortType.TIME ? 'active' : ''}">
      <input id="sort-${SortType.TIME}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortType.TIME}" data-sort-type="${SortType.TIME}">
      <label class="trip-sort__btn" for="sort-${SortType.TIME}">Time</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--${SortType.PRICE}${currentSortType === SortType.PRICE ? 'active' : ''}">
      <input id="sort-${SortType.PRICE}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortType.PRICE}" data-sort-type="${SortType.PRICE}">
      <label class="trip-sort__btn" for="sort-${SortType.PRICE}">Price</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--offer">
      <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
      <label class="trip-sort__btn" for="sort-offer">Offers</label>
    </div>
  </form>`
);

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template () {
    return createSortTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName === 'LABEL') {
      return;
    }

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
