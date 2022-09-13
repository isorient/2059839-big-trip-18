import {
  render,
  RenderPosition
} from '../framework/render.js';
import {updateItem} from '../utils/common.js';

import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import PointEmptyListView from '../view/point-list-empty-view.js';

import PointPresenter from './point-presenter.js';
<<<<<<< HEAD
import { SortType } from '../constants.js';
=======
>>>>>>> 70321ab766b2c6e5a7e0a37dd5f7e5f361f06bd7

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
<<<<<<< HEAD
  #currentSortType = SortType.DAY;
=======
>>>>>>> 70321ab766b2c6e5a7e0a37dd5f7e5f361f06bd7

  #pointPresenter = new Map();

  constructor (tripContainer, pointsModel, offersModel, destinationsModel) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init = () => {
    this.#points = [...this.#pointsModel.points];
    this.#offers = [...this.#offersModel.offers];
    this.#destinations = [...this.#destinationsModel.destinations];

    this.#renderTripBoard();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
<<<<<<< HEAD

    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderPointEmptyList () {
    render(this.#pointEmptyListComponent, this.#tripContainer);
  }

  #renderPoint = (point, offers, destinations) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent.element, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point, offers, destinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = () => {
    this.#points.forEach((point) => this.#renderPoint(point, this.#offers, this.#destinations));
  };

  #renderPointList = () => {
    render(this.#pointListComponent, this.#tripContainer);
    this.#renderPoints();
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

=======
  };

  #renderPointEmptyList () {
    render(this.#pointEmptyListComponent, this.#tripContainer);
  }

  #renderPoint = (point, offers, destinations) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent.element, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point, offers, destinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = () => {
    this.#points.forEach((point) => this.#renderPoint(point, this.#offers, this.#destinations));
  };

  #renderPointList = () => {
    render(this.#pointListComponent, this.#tripContainer);
    this.#renderPoints();
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

>>>>>>> 70321ab766b2c6e5a7e0a37dd5f7e5f361f06bd7
  #renderTripBoard = () => {
    if (this.#points.length === 0) {
      return this.#renderPointEmptyList();
    }

    this.#renderSort();
    this.#renderPointList();
  };

<<<<<<< HEAD
  #sortPoints = (sortType) => {
    this.#points = [...this.#pointsModel.sortPoints(sortType)];
    this.#currentSortType = sortType;
  };

=======
>>>>>>> 70321ab766b2c6e5a7e0a37dd5f7e5f361f06bd7
  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint, this.#offers, this.#destinations);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };
<<<<<<< HEAD

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPointList();
  };
=======
>>>>>>> 70321ab766b2c6e5a7e0a37dd5f7e5f361f06bd7
}
