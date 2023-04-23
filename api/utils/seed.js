function generateAPICallsWithMissingParams (obj) {
  const apiCalls = []

  // Get array of object keys
  const keys = Object.keys(obj)

  // Loop over all possible combinations of missing keys
  for (let i = 0; i < Math.pow(2, keys.length); i++) {
    const missingKeys = []
    for (let j = 0; j < keys.length; j++) {
      if (i & (1 << j)) {
        missingKeys.push(keys[j])
      }
    }

    // Create new object with missing keys
    const newObj = {}
    for (let j = 0; j < keys.length; j++) {
      if (!missingKeys.includes(keys[j])) {
        newObj[keys[j]] = obj[keys[j]]
      }
    }

    // remove case where there is no missing keys
    if (missingKeys.length === 0) {
      continue
    }
    // Add new API call to array
    apiCalls.push(newObj)
  }

  return apiCalls
}

export default generateAPICallsWithMissingParams
