import dayjs from "dayjs";

const setDates = (date) => {
  const dayOfWeek = dayjs(date).format("dddd");
  const dayMonth = dayjs(date).format("MMM D");
  const daySchema = new Date(date);

  return {
    dayOfWeek,
    dayMonth,
    daySchema,
  };
};

export default setDates;
