export const formatDate = (dateString, format = 'DD/MM/YYYY hh:mm')  => {
  if (!dateString) {
    return ''
  }
  const date = new Date(dateString);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  // Add leading zero to month, day, hours, minutes, seconds if necessary
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  // Replace format placeholders with corresponding date parts
  format = format.replace('YYYY', year);
  format = format.replace('MM', month);
  format = format.replace('DD', day);
  format = format.replace('hh', hours);
  format = format.replace('mm', minutes);
  format = format.replace('ss', seconds);

  return format;
}

export const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export const numberWithCommas = (num = '') => {
  const sign = Math.sign(num); // Determine the sign of the number

  // Remove non-digits and convert to string
  const numString = String(num).replace(/\D/g, "");

  // Add commas to the string representation of the absolute value
  const formattedString = numString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Add the sign back to the formatted string
  return sign === -1 ? "-" + formattedString : formattedString;
};

export function parseToNumber(str) {
  return parseFloat(str.replaceAll(',', '')) || 0;
}