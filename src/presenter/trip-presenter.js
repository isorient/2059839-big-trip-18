import {
  render,
  replace
} from '../framework/render.js';
import {isEscPressed} from '../utils/common.js';

import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import PointEmptyListView from '../view/point-list-empty-view.js';


export default class TripPresenter {
  #pointListComponent = new PointListView();
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #pointsList = null;
  #offersList = null;
  #destinationsList = null;
  #tripContainer = null;

  constructor (tripContainer, pointsModel, offersModel, destinationsModel) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  #renderPoint (point, offers, destinations) {
    const pointComponent = new PointView(point, offers, destinations);
    const pointEditComponent = new PointEditView(point, offers, destinations);

    const replaceFromPointToEditForm = () => replace(pointEditComponent, pointComponent);

    const replaceFromEditFormToPoint = () => replace(pointComponent, pointEditComponent);

    const onEscKeydown = (evt) => {
      if(isEscPressed(evt)) {
        evt.preventDefault();
        replaceFromEditFormToPoint();
        document.removeEventListener('keydown', onEscKeydown);
      }
    };

    pointComponent.setEditClickHandler(() => {
      replaceFromPointToEditForm();
      document.addEventListener('keydown', onEscKeydown);
    });

    pointEditComponent.setFormSubmitHandler(() => {
      replaceFromEditFormToPoint();
      document.removeEventListener('keydown', onEscKeydown);
    });

    pointEditComponent.setFormClickHandler(() => {
      replaceFromEditFormToPoint();
      document.removeEventListener('keydown', onEscKeydown);
    });

    render(pointComponent, this.#pointListComponent.element);
  }

  #renderPointsList () {
    if (this.#pointsList.length === 0) {
      return render(new PointEmptyListView(), this.#tripContainer);
    }

    render(new SortView(), this.#tripContainer);
    render(this.#pointListComponent, this.#tripContainer);

    for (let i = 0; i < this.#pointsList.length; i++) {
      this.#renderPoint(
        this.#pointsList[i],
        this.#offersList,
        this.#destinationsList
      );
    }
  }

  init () {
    this.#pointsList = [...this.#pointsModel.points];
    this.#offersList = [...this.#offersModel.offers];
    this.#destinationsList = [...this.#destinationsModel.destinations];

    this.#renderPointsList();
  }
}
