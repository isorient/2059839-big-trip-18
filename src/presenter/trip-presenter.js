import {
  SortType,
  UserAction,
  UpdateType,
  FilterType
} from '../constants.js';

import {
  render,
  remove,
  RenderPosition
} from '../framework/render.js';

import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import PointEmptyListView from '../view/point-empty-list-view.js';

import PointPresenter from './point-presenter.js';
import PointNewPresenter from './point-new-presenter.js';

export default class TripPresenter {
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;

  #tripContainer = null;

  #pointListComponent = new PointListView();
  #pointEmptyListComponent = null;
  #sortComponent = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  #pointPresenter = new Map();
  #pointNewPresenter = null;

  constructor (tripContainer, pointsModel, offersModel, destinationsModel, filterModel) {
    this.#tripContainer = tripContainer;

    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points () {
    this.#filterType = this.#filterModel.filter;
    this.#pointsModel.filterPoints(this.#filterType);
    return this.#pointsModel.sortPoints(this.#currentSortType);
  }


  init = () => {
    this.#renderTripBoard();
  };

  createPoint = (destroyCallback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter = new PointNewPresenter(
      this.#pointListComponent.element,
      this.#handleViewAction,
      destroyCallback,
      this.#offersModel.offers,
      this.#destinationsModel.destinations
    );
    this.#pointNewPresenter.init();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);

    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPointEmptyList () {
    this.#pointEmptyListComponent = new PointEmptyListView(this.#filterType);
    render(this.#pointEmptyListComponent, this.#tripContainer);
  }

  #renderPoint = (point, offers, destinations) => {
    const pointPresenter = new PointPresenter(
      this.#pointListComponent.element,
      this.#handleViewAction,
      this.#handleModeChange
    );
    pointPresenter.init(point, offers, destinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (points, offers, destinations) => {
    points.forEach((point) => this.#renderPoint(point, offers, destinations));
  };

  #renderTripBoard = () => {
    if (this.points.length === 0) {
      return this.#renderPointEmptyList();
    }

    render(this.#pointListComponent, this.#tripContainer);
    this.#renderPoints(this.points, this.#offersModel.offers, this.#destinationsModel.destinations);
    this.#renderSort();
  };

  #clearTripBoard = ({resetSortType = false} = {}) => {
    if (this.#pointNewPresenter !== null) {
      this.#pointNewPresenter.destroy();
    }

    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#pointEmptyListComponent);

    if (this.#pointEmptyListComponent) {
      remove(this.#pointEmptyListComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #handleModeChange = () => {
    if (this.#pointNewPresenter !== null) {
      this.#pointNewPresenter.destroy();
    }

    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTripBoard({resetRenderedTaskCount: true});
    this.#renderTripBoard();
  };

  #handleViewAction = (actionType, updateType, updatedPoint) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoints(updateType, updatedPoint);
        this.#pointPresenter.get(updatedPoint.id).init(updatedPoint, this.#offersModel.offers, this.#destinationsModel.destinations);
        break;
      case UserAction.ADD_POINT:
        return this.#pointsModel.addPoint(updateType, updatedPoint);
      case UserAction.DELETE_POINT:
        return this.#pointsModel.deletePoint(updateType, updatedPoint);
    }
  };

  #handleModelEvent = (updateType, updatedPoint) => {
    switch (updateType) {
      case UpdateType.PATCH:
        return this.#pointPresenter.get(updatedPoint.id).init(updatedPoint, this.#offersModel.offers, this.#destinationsModel.destinations);
      case UpdateType.MINOR:
        this.#clearTripBoard();
        this.#renderTripBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearTripBoard({resetSortType: true});
        this.#renderTripBoard();
        break;
    }
  };
}
