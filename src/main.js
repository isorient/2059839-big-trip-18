import {render} from './render.js';
import FilterView from './view/filter-view.js';
import TripPresenter from './presenter/trip-presenter.js';

const tripInfoContainerElement = document.querySelector('.trip-main');
const filterContainerElement = tripInfoContainerElement.querySelector('.trip-controls__filters');
const tripContainerElement = document.querySelector('.trip-events');
const tripPresenter = new TripPresenter();

render(new FilterView(), filterContainerElement);

tripPresenter.init(tripContainerElement);
