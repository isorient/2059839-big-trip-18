import {
  render,
  replace,
  RenderPosition
} from '../framework/render.js';
import {isEscPressed} from '../utils/common.js';

import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import PointEmptyListView from '../view/point-list-empty-view.js';


export default class TripPresenter {
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #tripContainer = null;

  #pointListComponent = new PointListView();
  #pointEmptyListComponent = new PointEmptyListView();
  #sortComponent = new SortView();

  #points = [];
  #offers = [];
  #destinations = [];

  constructor (tripContainer, pointsModel, offersModel, destinationsModel) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init () {
    this.#points = [...this.#pointsModel.points];
    this.#offers = [...this.#offersModel.offers];
    this.#destinations = [...this.#destinationsModel.destinations];

    this.#renderTripBoard();
  }

  #renderSort () {
    render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPointEmptyList () {
    render(this.#pointEmptyListComponent, this.#tripContainer);
  }

  #renderPoint (point, offers, destinations) {
    const pointComponent = new PointView(point, offers, destinations);
    const pointEditComponent = new PointEditView(point, offers, destinations);

    const replaceFromPointToEditForm = () => replace(pointEditComponent, pointComponent);

    const replaceFromEditFormToPoint = () => replace(pointComponent, pointEditComponent);

    const onEscKeydown = (evt) => {
      if(isEscPressed(evt)) {
        evt.preventDefault();
        replaceFromEditFormToPoint();
        document.removeEventListener('keydown', onEscKeydown);
      }
    };

    pointComponent.setEditClickHandler(() => {
      replaceFromPointToEditForm();
      document.addEventListener('keydown', onEscKeydown);
    });

    pointEditComponent.setFormSubmitHandler(() => {
      replaceFromEditFormToPoint();
      document.removeEventListener('keydown', onEscKeydown);
    });

    pointEditComponent.setFormClickHandler(() => {
      replaceFromEditFormToPoint();
      document.removeEventListener('keydown', onEscKeydown);
    });

    render(pointComponent, this.#pointListComponent.element);
  }

  #renderPoints () {
    this.#points.forEach((point) => this.#renderPoint(point, this.#offers, this.#destinations));
  }

  #renderPointList () {
    render(this.#pointListComponent, this.#tripContainer);
    this.#renderPoints();
  }

  #renderTripBoard () {
    if (this.#points.length === 0) {
      return this.#renderPointEmptyList();
    }

    this.#renderSort();
    this.#renderPointList();
  }
}
