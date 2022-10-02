import {
  SortType,
  UserAction,
  UpdateType,
  FilterType,
  DataSource,
  TimeLimit
} from '../constants.js';

import {
  render,
  remove,
  RenderPosition
} from '../framework/render.js';

import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

import LoadingView from '../view/loading-view.js';
import SortView from '../view/sort-view.js';
import PointEmptyListView from '../view/point-empty-list-view.js';
import PointListView from '../view/point-list-view.js';

import PointPresenter from './point-presenter.js';
import PointNewPresenter from './point-new-presenter.js';
import TripInfoPresenter from './trip-info-presenter.js';

export default class TripPresenter {
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;

  #tripContainerElement = null;
  #tripInfoContainerElement = null;

  #loadingComponent = new LoadingView();
  #sortComponent = null;
  #pointEmptyListComponent = null;
  #pointListComponent = new PointListView();

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  #isLoading = true;
  #arePointsLoaded = false;
  #areOffersLoaded = false;
  #areDestinationsLoaded = false;

  #pointPresenter = new Map();
  #pointNewPresenter = null;
  #tripInfoPresenter = null;

  constructor (tripContainerElement, tripInfoContainerElement, pointsModel, offersModel, destinationsModel, filterModel) {
    this.#tripContainerElement = tripContainerElement;
    this.#tripInfoContainerElement = tripInfoContainerElement;

    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#onModelChange);
    this.#offersModel.addObserver(this.#onModelChange);
    this.#destinationsModel.addObserver(this.#onModelChange);
    this.#filterModel.addObserver(this.#onModelChange);
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
    if (this.#pointEmptyListComponent !== null) {
      remove(this.#pointEmptyListComponent);
      render(this.#pointListComponent, this.#tripContainerElement);
    }

    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    this.#pointNewPresenter = new PointNewPresenter(
      this.#pointListComponent.element,
      this.#onViewChange,
      destroyCallback,
      this.#offersModel.offers,
      this.#destinationsModel.destinations
    );

    this.#pointNewPresenter.init();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);

    this.#sortComponent.setSortTypeChangeHandler(this.#onSortTypeChange);
    render(this.#sortComponent, this.#tripContainerElement, RenderPosition.AFTERBEGIN);
  };

  #renderPointEmptyList = () => {
    this.#pointEmptyListComponent = new PointEmptyListView(this.#filterType);
    render(this.#pointEmptyListComponent, this.#tripContainerElement);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#tripContainerElement, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (point, offers, destinations) => {
    const pointPresenter = new PointPresenter(
      this.#pointListComponent.element,
      this.#onViewChange,
      this.#onModeChange
    );
    pointPresenter.init(point, offers, destinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (points, offers, destinations) => {
    points.forEach((point) => this.#renderPoint(point, offers, destinations));
  };

  #renderTripInfo = () => {
    if (this.#tripInfoPresenter) {
      this.#tripInfoPresenter.destroy();
    }

    this.#tripInfoPresenter = new TripInfoPresenter(this.#tripInfoContainerElement);

    this.#tripInfoPresenter.init(
      this.#pointsModel.points,
      this.#offersModel.offers,
      this.#destinationsModel.destinations
    );
  };

  #renderTripBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.points.length === 0) {
      this.#renderPointEmptyList();
      return;
    }

    render(this.#pointListComponent, this.#tripContainerElement);
    this.#renderPoints(this.points, this.#offersModel.offers, this.#destinationsModel.destinations);
    this.#renderSort();
    this.#renderTripInfo();
  };

  #clearTripBoard = ({resetSortType = false} = {}) => {
    if (this.#pointNewPresenter !== null) {
      this.#pointNewPresenter.destroy();
    }

    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    this.#tripInfoPresenter.destroy();
    this.#tripInfoPresenter = null;

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#pointEmptyListComponent) {
      remove(this.#pointEmptyListComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #updateLoadingStatus = (dataSourceName) => {
    switch (dataSourceName) {
      case DataSource.POINTS:
        this.#arePointsLoaded = true;
        break;
      case DataSource.OFFERS:
        this.#areOffersLoaded = true;
        break;
      case DataSource.DESTINATIONS:
        this.#areDestinationsLoaded = true;
        break;
    }

    if (this.#arePointsLoaded && this.#areOffersLoaded && this.#areDestinationsLoaded) {
      this.#isLoading = false;
    }
  };

  #onModeChange = () => {
    if (this.#pointNewPresenter !== null) {
      this.#pointNewPresenter.destroy();
    }

    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTripBoard();
    this.#renderTripBoard();
  };

  #onViewChange = async (actionType, updateType, updatedPoint) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(updatedPoint.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, updatedPoint);
        } catch (err) {
          this.#pointPresenter.get(updatedPoint.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointNewPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, updatedPoint);
        } catch (err) {
          this.#pointNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(updatedPoint.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, updatedPoint);
        } catch (err) {
          this.#pointPresenter.get(updatedPoint.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #onModelChange = (updateType, updatedPoint, modelName) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(updatedPoint.id).init(updatedPoint, this.#offersModel.offers, this.#destinationsModel.destinations);
        this.#renderTripInfo();
        break;
      case UpdateType.MINOR:
        this.#clearTripBoard();
        this.#renderTripBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearTripBoard({resetSortType: true});
        this.#renderTripBoard();
        break;
      case UpdateType.INIT:
        this.#updateLoadingStatus(modelName);

        if (!this.#isLoading) {
          remove(this.#loadingComponent);
          this.#renderTripBoard();
        }
        break;
    }
  };

}
