import {render} from '../render.js';
import {isEscPressed} from '../utils.js';

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

  //в демке объявление renderPoint через стрелку - объявила через FD для единообразия, контекст проверяла - из зе сейм. Оставляем или нужна стрелка?
  #renderPoint (point, offers, destinations) {
    const pointComponent = new PointView(point, offers, destinations);
    const pointEditComponent = new PointEditView(point, offers, destinations);

    const replacePointToEditForm = () => this.#pointListComponent.element.replaceChild(pointEditComponent.element, pointComponent.element);

    const replaceEditFormToPoint = () => this.#pointListComponent.element.replaceChild(pointComponent.element, pointEditComponent.element);

    const onEscKeydown = (evt) => {
      if(isEscPressed(evt)) {
        evt.preventDefault();
        replaceEditFormToPoint();
        document.removeEventListener('keydown', onEscKeydown);
      }
    };

    const onFormSubmit = (evt) => {
      evt.preventDefault();
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeydown);
    };

    const onFormRollUpButtonClick = () => {
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeydown);
    };

    const onPointRollUpButtonClick = () => {
      replacePointToEditForm();
      document.addEventListener('keydown', onEscKeydown);
    };

    pointComponent.element.querySelector('.event__rollup-btn')
      .addEventListener('click', onPointRollUpButtonClick);

    pointEditComponent.element
      .querySelector('form')
      .addEventListener('submit', onFormSubmit);

    pointEditComponent.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', onFormRollUpButtonClick);

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
