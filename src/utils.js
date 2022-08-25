import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getPrettyNumber = (number) => {
  if (number.toString().length === 1) {
    number = `0${number}`;
  }
  return number;
};

const createDatetime = () => `${getRandomInteger(1000, 3000)}-${getPrettyNumber(getRandomInteger(1, 12))}-${getPrettyNumber(getRandomInteger(1, 30))}T${getPrettyNumber(getRandomInteger(0, 23))}:${getPrettyNumber(getRandomInteger(0, 59))}:${getPrettyNumber(getRandomInteger(0, 59))}.${getPrettyNumber(getRandomInteger(0, 999))}Z`;

const getPrettyDate = (eventPeriod) => dayjs(eventPeriod).format('MMM D');
const getPrettyTime = (eventPeriod) => dayjs(eventPeriod).format('HH:mm');
const getPrettyDatetime = (eventPeriod) => dayjs(eventPeriod).format('DD/MM/YY HH:mm');

const getDatetimeDuration = (startPeriod, endPeriod) => {
  const minuteDifference = dayjs(endPeriod).diff( dayjs(startPeriod), 'm');
  const datetimeDuration = dayjs.duration(minuteDifference, 'm');

  let outputFormat = 'mm[M]';
  //смотрим есть ли сутки в минутах
  outputFormat = (minuteDifference >= 1440) ? 'DD[D] HH[H] mm[M]' : outputFormat ;
  //смотрим есть ли часы
  outputFormat = (1440 > minuteDifference >= 60) ? 'HH[H] mm[M]' : outputFormat ;

  return datetimeDuration.format(outputFormat);
};

export {
  getRandomInteger,
  createDatetime,
  getPrettyDate,
  getPrettyTime,
  getPrettyDatetime,
  getDatetimeDuration
};
