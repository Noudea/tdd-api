function isValidPhoneNumber (phoneNumber) {
  const phoneNumberRegex = /^(0|\+33|0033)\d{9}$/
  return phoneNumberRegex.test(phoneNumber)
}

function isDateString (str) {
  // Regular expression to match date string in format YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/

  return regex.test(str)
}

const isISBNValid = (isbn13) => {
  if (!isbn13 || isbn13.length !== 13) {
    return false
  }
  return true
}

export default { isValidPhoneNumber, isDateString, isISBNValid }
