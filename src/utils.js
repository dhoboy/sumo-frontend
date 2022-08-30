export const monthMap = {
  1: "January",
  3: "March",
  5: "May",
  7: "July",
  9: "September",
  11: "November",
  January: 1,
  March: 3,
  May: 5,
  July: 7,
  September: 9,
  November: 11,
  january: 1,
  march: 3,
  may: 5,
  july: 7,
  september: 9,
  november: 11,
};

// TODO: Update with d3 number format
export const formatPercent = (num) => {
  return (num * 100).toFixed(2) + "%";
};
