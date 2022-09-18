import {getRandomInteger} from '../utils/common.js';
import {DESTINATIONS_LIST} from '../constants.js';

const destinationsDescriptionList = [
  'It is a beautiful city, a true asian pearl, with crowded streets.',
  'Welcome outside. Its like Russia, but worse, I guess.',
  'This is a nice city, but I want to Italy, perdona me.',
  'Kill me softly, kill me slowly - I get lost here.',
  'God save Corey Taylor and this city.'
];

const photosDescriptionList = [
  'Its impossible, tell the sun to leave the sky, Its just impossible',
  'Its impossible, ask a baby not to cry, Its just impossible',
  'Can the ocean keep from rushing to the shore? Its just impossible',
  'If I had you could I ever want for more? Its just impossible',
  'And tomorrow, should you ask me for the world - Somehow Id get it',
  'I would sell my very soul And not regret it for to live without your love'
];

const createDestination = (index) => (
  {
    'id': index,
    'description': destinationsDescriptionList[getRandomInteger(0, destinationsDescriptionList.length - 1)],
    'name': DESTINATIONS_LIST[index],
    'pictures': [
      {
        'src': `http://picsum.photos/300/200?r=${getRandomInteger(1000,10000)}`,
        'description': photosDescriptionList[getRandomInteger(0, photosDescriptionList.length - 1)]
      }
    ]
  }
);

export {
  createDestination
};
