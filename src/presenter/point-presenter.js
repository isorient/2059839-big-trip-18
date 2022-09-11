import {
  render,
  replace,
  remove
} from '../framework/render.js';
import {isEscPressed} from '../utils/common.js';

import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';

export default class PointPresenter {
  #pointListContainer = null;

  #point = null;
  #pointComponent = null;
  #pointEditComponent = null;

  constructor (pointListContainer) {
    this.#pointListContainer = pointListContainer;
  }

  init = (point, offers, destinations) => {
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView(this.#point, offers, destinations);
    this.#pointEditComponent = new PointEditView(this.#point, offers, destinations);

    this.#pointComponent.setEditClickHandler(this.#handleEditClick);

    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setFormClickHandler(this.#handleFormClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      return render(this.#pointComponent, this.#pointListContainer);
    }

    if (this.#pointListContainer.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#pointListContainer.contains(prevPointEditComponent.element)) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };

  #replaceFromPointToEditForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #replaceFromEditFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if(isEscPressed(evt)) {
      evt.preventDefault();
      this.#replaceFromEditFormToPoint();
    }
  };

  #handleEditClick = () => {
    this.#replaceFromPointToEditForm();
  };

  #handleFormSubmit = () => {
    this.#replaceFromEditFormToPoint();
  };

  #handleFormClick = () => {
    this.#replaceFromEditFormToPoint();
  };
}
