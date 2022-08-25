import {render} from '../render.js';
import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';

export default class TripPresenter {
  pointListComponent = new PointListView();

  init(tripContainer, pointsModel, offersModel, destinationsModel) {
    this.pointsModel = pointsModel;
    this.offersModel = offersModel;
    this.destinationsModel = destinationsModel;
    this.pointsList = [...this.pointsModel.getPoints()];
    this.offersList = [...offersModel.getOffers()];
    this.destinationsList = [...destinationsModel.getDestinations()];

    render(new SortView(), tripContainer);
    render(this.pointListComponent, tripContainer);
    render(new PointEditView(this.pointsList[0], this.offersList, this.destinationsList), this.pointListComponent.getElement(), 'AFTERBEGIN');

    for (let i = 0; i < this.pointsList.length; i++) {
      render(new PointView(this.pointsList[i], this.offersList, this.destinationsList), this.pointListComponent.getElement());
    }
  }
}
