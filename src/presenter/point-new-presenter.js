import {
  UserAction,
  UpdateType
} from '../constants.js';

import {
  render,
  remove,
  RenderPosition
} from '../framework/render.js';
import {isEscPressed} from '../utils/common.js';

import PointEditView from '../view/point-edit-view.js';

export default class PointNewPresenter {
  #pointListContainer = null;

  #offers = null;
  #destinations = null;

  #pointEditComponent = null;

  #changeDataHandler = null;
  #destroyCallback = null;

  constructor (pointListContainer, changeDataHandler, destroyCallback, offers, destinations) {
    this.#pointListContainer = pointListContainer;
    this.#changeDataHandler = changeDataHandler;
    this.#destroyCallback = destroyCallback;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  init = () => {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new PointEditView(undefined, this.#offers, this.#destinations);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if(isEscPressed(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleFormSubmit = (point) => {
    this.#changeDataHandler(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: 100, ...point}
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };
}
