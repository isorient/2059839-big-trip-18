import {
  FilterType,
  SortType
} from '../constants.js';
import {
  isPointInThePast,
  isPointInTheFuture,
  getDatetimeDuration,
  compareDates
} from '../utils/dates.js';

import createPoint from '../chmock/points.js';

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

const sortPointsByDateAsc = (targetPoint, pointToCompare) => compareDates(targetPoint.dateFrom, pointToCompare.dateFrom);

const sortPointsByTimeDesc = (targetPoint, pointToCompare) => {
  const pointToCompareDuration = getDatetimeDuration(pointToCompare.dateFrom, pointToCompare.dateTo);
  const targetPointDuration = getDatetimeDuration(targetPoint.dateFrom, targetPoint.dateTo);
  return pointToCompareDuration.$ms - targetPointDuration.$ms;
};

const sortPointsByPriceDesc = (targetPoint, pointToCompare) => pointToCompare.basePrice - targetPoint.basePrice;

export default class PointsModel extends Observable {
  #rawPoints = Array.from({length:5}, (_,index) => createPoint(index));
  // #rawPoints = [];
  #filteredPoints = filter[FilterType.EVERYTHING](this.#rawPoints);
  #pointsDefaultSortOrder = this.#filteredPoints.sort(sortPointsByDateAsc);
  #pointsApiService = null;

  constructor (pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;

    this.#pointsApiService.points.then((points) => {
      console.log(points);
      console.log(points.map(this.#adaptToClient));
    });
  }

  get points() {
    return this.#pointsDefaultSortOrder;
  }

  get filterLabels() {
    return filterPoints(this.#rawPoints);
  }

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

  updatePoints = (updateType, updatedPoint) => {
    const index = this.#rawPoints.findIndex((task) => task.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#rawPoints = [
      ...this.#rawPoints.slice(0, index),
      updatedPoint,
      ...this.#rawPoints.slice(index + 1),
    ];

    this._notify(updateType, updatedPoint);
  };

  addPoint = (updateType, updatedPoint) => {
    this.#rawPoints = [
      updatedPoint,
      ...this.#rawPoints,
    ];

    this._notify(updateType, updatedPoint);
  };

  deletePoint = (updateType, updatedPoint) => {
    const index = this.#rawPoints.findIndex((task) => task.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#rawPoints = [
      ...this.#rawPoints.slice(0, index),
      ...this.#rawPoints.slice(index + 1),
    ];

    this._notify(updateType);
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
