import createPoint from '../chmock/points.js';
import Observable from '../framework/observable.js';
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

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.PAST]: (points) => points.filter((point) => isPointInThePast(point.dateTo)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointInTheFuture(point.dateFrom)),
};

const filterPoints = (points) => Object.entries(filter).map(
  ([filterName, filterPointsList]) => ({
    name: filterName,
    count: filterPointsList(points).length,
  }),
);

const updatePoint = (items, update) => {
  console.log('items', items);
  console.log('update', update);
  const index = items.findIndex((item) => {
    console.log('item', item);
    return item.id === update.id;
  }
  );

  if (index === -1) {
    return items;
    // throw new Error('Can\'t update unexisting point');
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};

const sortPointsByDateAsc = (targetPoint, pointToCompare) => compareDates(targetPoint.dateFrom, pointToCompare.dateFrom);

const sortPointsByTimeDesc = (targetPoint, pointToCompare) => {
  const pointToCompareDuration = getDatetimeDuration(pointToCompare.dateFrom, pointToCompare.dateTo);
  const targetPointDuration = getDatetimeDuration(targetPoint.dateFrom, targetPoint.dateTo);
  return pointToCompareDuration.$ms - targetPointDuration.$ms;
};

const sortPointsByPriceDesc = (targetPoint, pointToCompare) => pointToCompare.basePrice - targetPoint.basePrice;

export default class PointsModel extends Observable {
  #rawPoints = Array.from({length:5}, (_,index) => createPoint(index));
  #pointsDefaultSortOrder = this.#rawPoints.slice().sort(sortPointsByDateAsc);


  get points() {
    return this.#pointsDefaultSortOrder;
  }

  get filterLabels() {
    return filterPoints(this.#pointsDefaultSortOrder);
  }

  sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.DAY:
        // return this.#pointsDefaultSortOrder;
        console.log('sortType day',sortType);
        return this.#rawPoints.sort(sortPointsByDateAsc);
      case SortType.TIME:
        console.log('sortType time',sortType);
        return this.#rawPoints.sort(sortPointsByTimeDesc);
      case SortType.PRICE:
        console.log('sortType price',sortType);
        return this.#rawPoints.sort(sortPointsByPriceDesc);
    }
  };

  updatePoint = (updateType, updatedPoint) => {
    updatePoint(this.#pointsDefaultSortOrder, updatedPoint);
    this._notify(updateType, updatedPoint);
    return updatePoint(this.#rawPoints, updatedPoint);
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
}
