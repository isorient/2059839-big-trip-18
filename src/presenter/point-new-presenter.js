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

  #onDataChange = null;
  #destroyCallback = null;

  constructor (pointListContainer, onDataChange, destroyCallback, offers, destinations) {
    this.#pointListContainer = pointListContainer;
    this.#onDataChange = onDataChange;
    this.#destroyCallback = destroyCallback;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  init = () => {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new PointEditView(undefined, this.#offers, this.#destinations);
    this.#pointEditComponent.setFormSubmitHandler(this.#onFormSubmit);
    this.#pointEditComponent.setDeleteClickHandler(this.#onDeleteClick);

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  destroy = () => {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  };

  setSaving = () => {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  #onEscKeyDown = (evt) => {
    if(isEscPressed(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };

  #onFormSubmit = (point) => {
    this.#onDataChange( UserAction.ADD_POINT, UpdateType.MINOR, point);
    this.destroy();
  };

  #onDeleteClick = () => {
    this.destroy();
  };
}
