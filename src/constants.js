const POINT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

const DESTINATIONS_LIST = [
  'Chamonix',
  'Amsterdam',
  'Geneva',
  'Loloburg',
  'Kekland',
  'Zorroville'
];

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
};

export {
  POINT_TYPES,
  DESTINATIONS_LIST,
  FilterType,
  SortType,
  UserAction,
  UpdateType
};
