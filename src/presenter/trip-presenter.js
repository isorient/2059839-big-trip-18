import {render} from '../render.js';
import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';

export default class TripPresenter {
  pointListComponent = new PointListView();

  init(tripContainer) {
    render(new SortView(), tripContainer);
    render(this.pointListComponent, tripContainer);
    render(new PointEditView(), this.pointListComponent.getElement(), 'AFTERBEGIN');

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.pointListComponent.getElement());
    }
  }
}
