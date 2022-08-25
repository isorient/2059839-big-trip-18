import {
  getRandomInteger
} from '../utils.js';

import {
  POINT_TYPES
} from '../constants.js';

const createPoint = (i) => (
  {
    'id': i,
    'type': POINT_TYPES[getRandomInteger(0,POINT_TYPES.length - 1)],
    'dateFrom': '2022-08-23T09:13:46.849Z',
    'dateTo': '2022-08-28T09:17:46.849Z',
    'destination': getRandomInteger(1,4),
    'basePrice': getRandomInteger(1,10000),
    'isFavorite': Boolean(getRandomInteger(0,1)),
    'offers': [
      1,
      2
    ]
  }
);

export {createPoint};
