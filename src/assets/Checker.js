const isCurrentMonthYear = (date) => {
  const currentDate = new Date();
  const dateConvert = new Date(date);
  return (
    dateConvert.getMonth() === currentDate.getMonth() &&
    dateConvert.getFullYear() === currentDate.getFullYear()
  );
};

const isToday = (date) => {
  const currentDate = new Date();
  const dateConvert = new Date(date);
  return (
    dateConvert.getDate() === currentDate.getDate() &&
    dateConvert.getMonth() === currentDate.getMonth() &&
    dateConvert.getFullYear() === currentDate.getFullYear()
  );
};

const isFuture = (date) => {
  const currentDate = new Date();
  const dateConvert = new Date(date);
  return dateConvert > currentDate;
};

const isPast = (date) => {
  const currentDate = new Date();
  const dateConvert = new Date(date);
  return dateConvert < currentDate;
};

const Checker = {
  isCurrentMonthYear,
  isToday,
  isFuture,
  isPast,
};

export default Checker;
