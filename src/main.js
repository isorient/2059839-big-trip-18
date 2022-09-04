import {render} from './framework/render.js';
import FilterView from './view/filter-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';

const tripInfoContainerElement = document.querySelector('.trip-main');
const filterContainerElement = tripInfoContainerElement.querySelector('.trip-controls__filters');
const tripContainerElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const tripPresenter = new TripPresenter(tripContainerElement, pointsModel, offersModel, destinationsModel);

render(new FilterView(), filterContainerElement);

tripPresenter.init();
