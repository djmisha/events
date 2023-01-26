import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const setDates = (date) => {
  const dayOfWeek = dayjs(date).format("dddd");
  const dayMonth = dayjs(date).format("MMM D");
  const daySchema = new Date(date);
  const dayMonthYear = dayjs(date).format("dddd, MMMM D");
  const fromNow = dayjs(date).fromNow();

  return {
    dayOfWeek,
    dayMonth,
    daySchema,
    dayMonthYear,
    fromNow,
  };
};

export default setDates;
