import {
  SortType,
  UserAction,
  UpdateType
} from '../constants.js';

import {
  render,
  remove,
  RenderPosition
} from '../framework/render.js';

import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import PointEmptyListView from '../view/point-list-empty-view.js';

import PointPresenter from './point-presenter.js';

export default class TripPresenter {
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #tripContainer = null;

  #pointListComponent = new PointListView();
  #pointEmptyListComponent = new PointEmptyListView();
  #sortComponent = null;

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
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points () {
    // return this.#pointsModel.points;
    return this.#pointsModel.sortPoints(this.#currentSortType);
  }

  init = () => {
    this.#offers = [...this.#offersModel.offers];
    this.#destinations = [...this.#destinationsModel.destinations];

    this.#renderTripBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);

    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPointEmptyList () {
    render(this.#pointEmptyListComponent, this.#tripContainer);
  }

  #renderPoint = (point, offers, destinations) => {
    const pointPresenter = new PointPresenter(
      this.#pointListComponent.element,
      // this.#handlePointChange,
      this.#handleViewAction,
      this.#handleModeChange
    );
    pointPresenter.init(point, offers, destinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point, this.#offers, this.#destinations));
  };

  #renderPointList = () => {
    render(this.#pointListComponent, this.#tripContainer);
    this.#renderPoints(this.points);
  };

  // TODO delete
  // #clearPointList = () => {
  //   this.#pointPresenter.forEach((presenter) => presenter.destroy());
  //   this.#pointPresenter.clear();
  // };

  #renderTripBoard = () => {
    if (this.points.length === 0) {
      return this.#renderPointEmptyList();
    }

    render(this.#pointListComponent, this.#tripContainer);
    this.#renderPoints(this.points);
    this.#renderSort();
  };

  #clearTripBoard = ({resetSortType = false} = {}) => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#pointEmptyListComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #sortPoints = (sortType) => {
    this.#points = [...this.#pointsModel.sortPoints(sortType)];
    this.#currentSortType = sortType;
  };

  //на смену этому колбеку пришел handleViewAction
  #handlePointChange = (updatedPoint) => {
    this.#points = [...this.#pointsModel.updatePoint(updatedPoint)];
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint, this.#offers, this.#destinations);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    // this.#clearPointList();
    // this.#renderPointList();
    this.#clearTripBoard({resetRenderedTaskCount: true});
    this.#renderTripBoard();
  };

  #handleViewAction = (actionType, updateType, updatedPoint) => {
    console.log(actionType, updateType, updatedPoint);
    console.log('actionType',actionType);
    console.log('updateType',updateType);
    console.log('updatedPoint',updatedPoint);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        // return this.#pointsModel.updatePoint(updateType, updatedPoint);
        this.#pointsModel.updatePoints(updateType, updatedPoint);
        this.#pointPresenter.get(updatedPoint.id).init(updatedPoint, this.#offers, this.#destinations);
        break;
      case UserAction.ADD_POINT:
        return this.#pointsModel.addPoint(updateType, updatedPoint);
      case UserAction.DELETE_POINT:
        return this.#pointsModel.deletePoint(updateType, updatedPoint);
    }
  };

  #handleModelEvent = (updateType, updatedPoint) => {
    console.log(updateType, updatedPoint);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        return this.#pointPresenter.get(updatedPoint.id).init(updatedPoint, this.#offers, this.#destinations);
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this.#clearTripBoard();
        this.#renderTripBoard();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearTripBoard({resetSortType: true});
        this.#renderTripBoard();
        break;
    }
  };
}
