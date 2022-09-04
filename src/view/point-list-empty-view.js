import AbstractView from '../framework/view/abstract-view.js';

const createPointEmptyListTemplate = () => '<p class="trip-events__msg">Click New Event to create your first point</p>';

export default class PointEmptyListView extends AbstractView {
  get template() {
    return createPointEmptyListTemplate();
  }
}
