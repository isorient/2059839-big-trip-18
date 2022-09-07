import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, isChecked) => (
  `<div class="trip-filters__filter">
    <input 
      id="filter-${filter.name}" 
      class="trip-filters__filter-input visually-hidden" 
      type="radio" 
      name="trip-filter" 
      value="${filter.name}" 
      ${isChecked ? 'checked' : ''} 
      ${!filter.name === 'everything' && filter.count === 0 ? 'disabled' : ''}
    > 
    <label class="trip-filters__filter-label" for="filter-past">${filter.name}</label>
  </div>`
);

const getFilterButton = () => '<button class="visually-hidden" type="submit">Accept filter</button>';

const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
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

  constructor (filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
