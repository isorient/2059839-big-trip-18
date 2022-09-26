import {FilterType} from '../constants.js';

import AbstractView from '../framework/view/abstract-view.js';

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events',
  [FilterType.FUTURE]: 'There are no future',
};

const createPointEmptyListTemplate = (filterType) => `<p class="trip-events__msg">${NoPointsTextType[filterType]}</p>`;

export default class PointEmptyListView extends AbstractView {
  #filterType = null;

  constructor (filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createPointEmptyListTemplate(this.#filterType);
  }
}
