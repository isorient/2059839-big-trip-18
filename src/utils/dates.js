import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(duration);
dayjs.extend(isSameOrAfter);

//словарь, показывающий кол-во минут в единице времени
const MinuteConverter = {
  DAY: 1440,
  HOUR: 60
};

const getPrettyDate = (eventPeriod) => dayjs(eventPeriod).format('MMM D');
const getPrettyTime = (eventPeriod) => dayjs(eventPeriod).format('HH:mm');
const getPrettyDatetime = (eventPeriod) => dayjs(eventPeriod).format('DD/MM/YY HH:mm');

const compareDates = (targetDate, dateToCompare, format = 'minute') => dayjs(targetDate).diff(dayjs(dateToCompare), format);

const getDatetimeDuration = (startPeriod, endPeriod) => dayjs.duration( compareDates(endPeriod, startPeriod, 'minute'), 'minute');

const getFormattedDatetimeDuration = (startPeriod, endPeriod) => {
  const minuteDifference = compareDates(endPeriod, startPeriod, 'minute');
  const datetimeDuration = dayjs.duration(minuteDifference, 'minute');

  let outputFormat = 'mm[M]';
  //смотрим есть ли сутки в минутах
  outputFormat = (minuteDifference >= MinuteConverter.DAY) ? 'DD[D] HH[H] mm[M]' : outputFormat ;
  //смотрим есть ли часы
  outputFormat = (MinuteConverter.DAY > minuteDifference >= MinuteConverter.HOUR) ? 'HH[H] mm[M]' : outputFormat ;

  return datetimeDuration.format(outputFormat);
};

const isPointInThePast = (dateTo) => dateTo && dayjs(dateTo).isBefore(dayjs(), 'D');
const isPointInTheFuture = (dateFrom) => dateFrom && dayjs(dateFrom).isSameOrAfter(dayjs(), 'D');

export {
  getPrettyDate,
  getPrettyTime,
  getPrettyDatetime,
  getDatetimeDuration,
  getFormattedDatetimeDuration,
  isPointInThePast,
  isPointInTheFuture,
  compareDates
};
