import createPoint from '../chmock/points.js';
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
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
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

export default class PointsModel {
  #rawPoints = Array.from({length:33}, (_,index) => createPoint(index));
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
        return this.#pointsDefaultSortOrder;
      case SortType.TIME:
        return this.#rawPoints.sort(sortPointsByTimeDesc);
      case SortType.PRICE:
        return this.#rawPoints.sort(sortPointsByPriceDesc);
    }
  };

  updatePoint = (updatedPoint) => {
    updatePoint(this.#pointsDefaultSortOrder, updatedPoint);
    return updatePoint(this.#rawPoints, updatedPoint);
  };
}
