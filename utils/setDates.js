import dayjs from "dayjs";

const setDates = (date) => {
  const dayOfWeek = dayjs(date).format("dddd");
  const dayMonth = dayjs(date).format("MMM D");
  const daySchema = new Date(date);
  const dayMonthYear = dayjs(date).format("dddd, MMMM D");

  return {
    dayOfWeek,
    dayMonth,
    daySchema,
    dayMonthYear,
  };
};

export default setDates;
