import { addMonths, differenceInDays } from "date-fns";

// For DD-MM-YYYY
export const formatToReadableDateDDMMYYYY = (isoDate) => {
  const date = new Date(isoDate);
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

// export const formatToReadableDateDDMMYYYY = (date) => {
//   const day = date.getDate();
//   const month = date.getMonth() + 1; // Months are 0-based
//   const year = date.getFullYear();

//   return `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`;
// };

//format dd-mm-yyyy
export const convertDateFormat = (date) => {
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
};

// export const convertDateTimeFormat = (dateTime) => {
//   const [date, time] = dateTime.split("T"); // Split date and time
//   const [year, month, day] = date.split("-");
//   const [hours, minutes] = time.split(":");

//   return `${day}-${month}-${year} ${hours}:${minutes}`;
// };

export const convertDateTimeFormat = (dateTime) => {
  const dateObj = new Date(dateTime);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const year = String(dateObj.getFullYear()).slice(2); // Get last 2 digits of year
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export const getRemainingDays = (dateTime) => {
  const givenDate = new Date(dateTime);
  givenDate.setDate(givenDate.getDate() + 14); // Add 15 days

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset today's time for accurate comparison

  const diffTime = givenDate - today; // Get difference in milliseconds
  const remainingDays = Math.max(
    0,
    Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  ); // Convert to days

  return remainingDays;
};

/// remaining date for home count down

export const calculateRemainingTime = (createdAt) => {
  const startingDate = new Date(createdAt);
  const targetDate = addMonths(startingDate, 2);
  const now = new Date();

  // If target date is in the past, return 0 for all
  if (targetDate <= now) {
    return {
      Days: 0,
      Hours: 0,
      Minutes: 0,
      Seconds: 0,
    };
  }

  // Midnight today
  const midnight = new Date();
  midnight.setHours(23, 59, 59, 999);

  const remainingHours = midnight.getHours() - now.getHours();
  const remainingMinutes = midnight.getMinutes() - now.getMinutes();
  const remainingSeconds = midnight.getSeconds() - now.getSeconds();

  const daysLeft = differenceInDays(targetDate, now);

  return {
    Days: daysLeft,
    Hours: remainingHours,
    Minutes: remainingMinutes,
    Seconds: remainingSeconds,
  };
};
