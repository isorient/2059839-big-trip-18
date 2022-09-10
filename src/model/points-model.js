import createPoint from '../chmock/points.js';
import {FilterType} from '../constants.js';
import {isPointInThePast, isPointInTheFuture} from '../utils/dates.js';

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

export default class PointsModel {
  #points = Array.from({length:48}, (_,index) => createPoint(index));

  get points() {
    return this.#points;
  }

  get filterLabels() {
    return filterPoints(this.#points);
  }
}
