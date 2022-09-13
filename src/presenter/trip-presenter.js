import {
  render,
  RenderPosition
} from '../framework/render.js';
import {updateItem} from '../utils/common.js';

import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import PointEmptyListView from '../view/point-list-empty-view.js';

import PointPresenter from './point-presenter.js';
import { SortType } from '../constants.js';

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
  #currentSortType = SortType.DAY;

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

  #renderTripBoard = () => {
    if (this.#points.length === 0) {
      return this.#renderPointEmptyList();
    }

    this.#renderSort();
    this.#renderPointList();
  };

  #sortpoints = (sortType) => {
    this.#points = [...this.#pointsModel.sortPoints(sortType)];
    this.#currentSortType = sortType;
  };

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint, this.#offers, this.#destinations);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    // - Сортируем задачи
    // - Очищаем список
    // - Рендерим список заново
  };
}
