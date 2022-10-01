import {
  UserAction,
  UpdateType
} from '../constants.js';

import {
  render,
  replace,
  remove
} from '../framework/render.js';
import {isEscPressed} from '../utils/common.js';
import {areDatesEqual} from '../utils/dates.js';

import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;
  #onDataChange = null;
  #changeMode = null;

  #point = null;
  #offers = null;
  #destinations = null;
  #mode = Mode.DEFAULT;

  #pointComponent = null;
  #pointEditComponent = null;

  constructor (pointListContainer, onDataChange, changeMode) {
    this.#pointListContainer = pointListContainer;
    this.#onDataChange = onDataChange;
    this.#changeMode = changeMode;
  }

  init = (point, offers, destinations) => {
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView(this.#point, this.#offers, this.#destinations);

    this.#pointComponent.setEditClickHandler(this.#onEditClick);
    this.#pointComponent.setFavoriteClickHandler(this.#onFavoriteClick);

    this.#initEditForm();

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevPointEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceEditFormByPoint();
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  #initEditForm = () => {
    this.#pointEditComponent = new PointEditView(this.#point, this.#offers, this.#destinations);

    this.#pointEditComponent.setFormSubmitHandler(this.#onFormSubmit);
    this.#pointEditComponent.setDeleteClickHandler(this.#onDeleteClick);
    this.#pointEditComponent.setFormClickHandler(this.#onFormClick);
  };

  #replacePointByEditForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceEditFormByPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  };

  #onEscKeyDown = (evt) => {
    if(isEscPressed(evt)) {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceEditFormByPoint();
    }
  };

  #onEditClick = () => {
    this.#initEditForm();
    this.#replacePointByEditForm();
  };

  #onFormSubmit = (point) => {
    const isMinorUpdate = !areDatesEqual(point.dateFrom, this.#point.dateFrom) || !areDatesEqual(point.dateTo, this.#point.dateTo) || point.basePrice !== this.#point.basePrice;

    this.#onDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      point
    );
  };

  #onDeleteClick = (point) => {
    this.#onDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #onFormClick = (point) => {
    this.#onDataChange(point);
    this.#replaceEditFormByPoint();
  };

  #onFavoriteClick = () => {
    this.#onDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite:!this.#point.isFavorite}
    );
  };
}
