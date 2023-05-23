import moment from 'moment'
import {
  Timestamp
} from 'firebase/firestore'

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

export const snapshotToArray = (snapshot) => {
  const data = [];
  if (snapshot) {
    snapshot.forEach((doc) => {
      data.push(doc.data());
    });
  }
  return data;
};


export const formatDate = (date, format = 'DD/MM/YYYY hh:mm') => {
  if (!date) {
    return
  }
  if (date.seconds && date.nanoseconds) {
    date = new Timestamp(date.seconds , date.nanoseconds).toDate();
  }
  if (
    ['boolean', 'undefined'].indexOf(typeof date) === -1 &&
    (!Number(date) || Number(date) > 24339600000)
  ) {
    const tmpDate = moment(date)
    if (date && String(tmpDate) !== 'Invalid Date') {
      return tmpDate.format(format)
    }
  }

  return date
}