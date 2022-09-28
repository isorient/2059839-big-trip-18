import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';

import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import PointsApiService from './api/points-api-service.js';
import OffersApiService from './api/offers-api-service.js';
import DestinationsApiService from './api/destinations-api-service.js';

const tripInfoContainerElement = document.querySelector('.trip-main');
const filterContainerElement = tripInfoContainerElement.querySelector('.trip-controls__filters');
const tripContainerElement = document.querySelector('.trip-events');
const addPointButtonElement = tripInfoContainerElement.querySelector('.trip-main__event-add-btn');

const AUTHORIZATION = 'Basic jv54vUVvkBk7tPTO';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);
const offersApiService = new OffersApiService(END_POINT, AUTHORIZATION);
const destinationsApiService = new DestinationsApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel(pointsApiService);
const offersModel = new OffersModel(offersApiService);
const destinationsModel = new DestinationsModel(destinationsApiService);
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
pointsModel.init()
  .finally(() => {
    addPointButtonElement.addEventListener('click', onNewPointFormClick);
  });
destinationsModel.init();
offersModel.init();

