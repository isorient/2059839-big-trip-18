import {
  render,
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
  #sortComponent = new SortView();

  #points = [];
  #offers = [];
  #destinations = [];

  constructor (tripContainer, pointsModel, offersModel, destinationsModel) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init = () => {
    this.#points = [...this.#pointsModel.points];
    this.#offers = [...this.#offersModel.offers];
    this.#destinations = [...this.#destinationsModel.destinations];

    this.#renderTripBoard();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPointEmptyList () {
    render(this.#pointEmptyListComponent, this.#tripContainer);
  }

  #renderPoint = (point, offers, destinations) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent.element);
    pointPresenter.init(point, offers, destinations);
  };

  #renderPoints = () => {
    this.#points.forEach((point) => this.#renderPoint(point, this.#offers, this.#destinations));
  };

  #renderPointList = () => {
    render(this.#pointListComponent, this.#tripContainer);
    this.#renderPoints();
  };

  #renderTripBoard = () => {
    if (this.#points.length === 0) {
      return this.#renderPointEmptyList();
    }

    this.#renderSort();
    this.#renderPointList();
  };
}
