import {
  FilterType,
  SortType,
  UpdateType,
  DataSource
} from '../constants.js';
import {
  isPointInThePast,
  isPointInTheFuture,
  getDatetimeDuration,
  getDatesDifference
} from '../utils/dates.js';

import Observable from '../framework/observable.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.PAST]: (points) => points.filter((point) => isPointInThePast(point.dateTo)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointInTheFuture(point.dateFrom)),
};

const filterPoints = (points) => Object.entries(filter).map(
  ([filterName, filterPointsList]) => ({
    type: filterName,
    name: filterName,
    count: filterPointsList(points).length,
  }),
);

const sortPointsByDateAsc = (targetPoint, pointToCompare) => getDatesDifference(targetPoint.dateFrom, pointToCompare.dateFrom);

const sortPointsByTimeDesc = (targetPoint, pointToCompare) => {
  const pointToCompareDuration = getDatetimeDuration(pointToCompare.dateFrom, pointToCompare.dateTo);
  const targetPointDuration = getDatetimeDuration(targetPoint.dateFrom, targetPoint.dateTo);
  return pointToCompareDuration.$ms - targetPointDuration.$ms;
};

const sortPointsByPriceDesc = (targetPoint, pointToCompare) => Number(pointToCompare.basePrice - targetPoint.basePrice);

export default class PointsModel extends Observable {
  #rawPoints = [];
  #filteredPoints = filter[FilterType.EVERYTHING](this.#rawPoints);
  #pointsDefaultSortOrder = PointsModel.sortPoints;
  #pointsApiService = null;

  constructor (pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#pointsDefaultSortOrder;
  }

  get filterLabels() {
    return filterPoints(this.#rawPoints);
  }

  init = async () => {
    try {
      const points = await this.#pointsApiService.points;
      this.#rawPoints = points.map(this.#adaptToClient);
    } catch (err) {
      this.#rawPoints = [];
    }

    this._notify(UpdateType.INIT, undefined, DataSource.POINTS);
  };

  sortPoints = (sortType = sortPointsByDateAsc) => {
    switch (sortType) {
      case SortType.DAY:
        return this.#filteredPoints.sort(sortPointsByDateAsc);
      case SortType.TIME:
        return this.#filteredPoints.sort(sortPointsByTimeDesc);
      case SortType.PRICE:
        return this.#filteredPoints.sort(sortPointsByPriceDesc);
    }
  };

  filterPoints = (filterType) => {
    this.#filteredPoints = filter[filterType](this.#rawPoints);
    return this.#filteredPoints;
  };

  updatePoint = async (updateType, updatedPoint) => {
    const index = this.#rawPoints.findIndex((task) => task.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(updatedPoint);
      const changedPoint = this.#adaptToClient(response);
      this.#rawPoints = [
        ...this.#rawPoints.slice(0, index),
        changedPoint,
        ...this.#rawPoints.slice(index + 1),
      ];

      this._notify(updateType, changedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  };

  addPoint = async (updateType, pointToAdd) => {
    try {
      const response = await this.#pointsApiService.addPoint(pointToAdd);
      const newPoint = this.#adaptToClient(response);
      this.#rawPoints = [newPoint,...this.#rawPoints];
      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t add point');
    }
  };

  deletePoint = async (updateType, pointToDelete) => {
    const index = this.#rawPoints.findIndex((task) => task.id === pointToDelete.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#pointsApiService.deletePoint(pointToDelete);
      this.#rawPoints = [
        ...this.#rawPoints.slice(0, index),
        ...this.#rawPoints.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete task');
    }
  };

  #adaptToClient = (point) => {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: new Date(point['date_from']),
      dateTo: new Date(point['date_to']),
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  };
}
