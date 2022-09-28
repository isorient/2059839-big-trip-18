const FilterType = {
  EVERYTHING:'everything',
  PAST:'past',
  FUTURE:'future'
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const DataSource = {
  POINTS: 'POINTS',
  OFFERS: 'OFFERS',
  DESTINATIONS: 'DESTINATIONS',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export {
  FilterType,
  SortType,
  UserAction,
  UpdateType,
  DataSource,
  TimeLimit
};
