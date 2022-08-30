import createPoint from '../chmock/points.js';

export default class PointsModel {
  #points = Array.from({length:33}, (_,index) => createPoint(index));

  get points() {
    return this.#points;
  }
}
