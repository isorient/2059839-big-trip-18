import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(duration);
dayjs.extend(isSameOrAfter);

const minuteConverter = {
  DAY: 1440,
  HOUR: 60
};

const getPrettyDate = (eventPeriod) => dayjs(eventPeriod).format('MMM D');
const getPrettyTime = (eventPeriod) => dayjs(eventPeriod).format('HH:mm');
const getPrettyDatetime = (eventPeriod) => dayjs(eventPeriod).format('DD/MM/YY HH:mm');

const getCurrentDatetime = () => dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

const getDatesDifference = (targetDate, dateToCompare, format = 'minute') => dayjs(targetDate).diff(dayjs(dateToCompare), format);

const areDatesEqual = (targetDate, dateToCompare) => dayjs(targetDate).isSame(dayjs(dateToCompare, 'day'));

const getDatetimeDuration = (startPeriod, endPeriod) => dayjs.duration( getDatesDifference(endPeriod, startPeriod, 'minute'), 'minutes');

const getFormattedDatetimeDuration = (startPeriod, endPeriod) => {
  const minuteDifference = getDatesDifference(endPeriod, startPeriod, 'minute');
  const datetimeDuration = dayjs.duration(minuteDifference, 'minutes');

  if (minuteDifference >= minuteConverter.DAY) {
    return datetimeDuration.format('DD[D] HH[H] mm[M]');
  }

  if (minuteDifference >= minuteConverter.HOUR && minuteDifference < minuteConverter.DAY) {
    return datetimeDuration.format('HH[H] mm[M]');
  }

  return datetimeDuration.format('mm[M]');
};

const isPointInThePast = (dateTo) => dateTo && dayjs(dateTo).isBefore(dayjs(), 'D');
const isPointInTheFuture = (dateFrom) => dateFrom && dayjs(dateFrom).isSameOrAfter(dayjs(), 'D');

export {
  getPrettyDate,
  getPrettyTime,
  getPrettyDatetime,
  getCurrentDatetime,
  getDatetimeDuration,
  getFormattedDatetimeDuration,
  isPointInThePast,
  isPointInTheFuture,
  getDatesDifference,
  areDatesEqual
};
