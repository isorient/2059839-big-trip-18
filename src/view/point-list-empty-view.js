import {createElement} from '../render.js';

const createPointEmptyListTemplate = () => '<p class="trip-events__msg">Click New Event to create your first point</p>';

class PointEmptyListView {
  #element = null;

  get template() {
    return createPointEmptyListTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

export default PointEmptyListView;
