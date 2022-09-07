import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(duration);
dayjs.extend(isSameOrAfter);


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

const isPointInThePast = (dateTo) => dateTo && dayjs(dateTo).isBefore(dayjs(), 'D');
const isPointInTheFuture = (dateFrom) => dateFrom && dayjs(dateFrom).isSameOrAfter(dayjs(), 'D');

export {
  getPrettyDate,
  getPrettyTime,
  getPrettyDatetime,
  getDatetimeDuration,
  isPointInThePast,
  isPointInTheFuture
};
