import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';

import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsApiService from './points-api-service.js';

const tripInfoContainerElement = document.querySelector('.trip-main');
const filterContainerElement = tripInfoContainerElement.querySelector('.trip-controls__filters');
const tripContainerElement = document.querySelector('.trip-events');
const addPointButtonElement = tripInfoContainerElement.querySelector('.trip-main__event-add-btn');

const AUTHORIZATION = 'Basic jv54vUVvkBk7tPTO';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel(pointsApiService);
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(filterContainerElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(tripContainerElement, pointsModel, offersModel, destinationsModel, filterModel);

const onNewPointFormClose = () => {
  addPointButtonElement.disabled = false;
};

const onNewPointFormClick = () => {
  tripPresenter.createPoint(onNewPointFormClose);
  addPointButtonElement.disabled = true;
};

addPointButtonElement.addEventListener('click', onNewPointFormClick);

filterPresenter.init();
tripPresenter.init();
