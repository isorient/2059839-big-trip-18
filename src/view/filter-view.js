import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, currentFilterType) => (
  `<div class="trip-filters__filter">
    <input 
      id="filter-${filter.name}" 
      class="trip-filters__filter-input visually-hidden" 
      type="radio" 
      name="trip-filter" 
      value="${filter.name}" 
      ${filter.type === currentFilterType ? 'checked' : ''} 
      ${!filter.name === 'everything' && filter.count === 0 ? 'disabled' : ''}
    > 
    <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.name}</label>
  </div>`
);

const getFilterButton = () => '<button class="visually-hidden" type="submit">Accept filter</button>';

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}

      ${getFilterButton()}
    </form>`
  );
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor (filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    this._callback.filterTypeChange(evt.target.value);
  };
}
