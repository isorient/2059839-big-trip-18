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

export {
  POINT_TYPES,
  DESTINATIONS_LIST,
  FilterType,
  SortType
};
