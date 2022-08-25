import {createPoint} from '../chmock/points.js';

export default class PointsModel {
  points = Array.from({length:13}, (v,i) => createPoint(i));

  getPoints = () => this.points;
}
