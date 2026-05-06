export function getInitialValues() {
  return {
    wasteLocation: null,
    wasteType: '',
    quantity: '',
    contactPhone: '',
    comment: '',
    passDocumet: false,
    notificationCities: [],
    notificationCitiesCheckbox: false,
    notificationRadius: '',
    notificationRadiusCheckbox: false,
  }
}

export function getNormalizedValues(values) {
  const normalizedValues = {}
  Object.assign(normalizedValues, values)

  const {
    main_text_matched_substrings,
    secondary_text_matched_substrings,
    ...withoutMatchedSubstrings
  } = values.wasteLocation.structured_formatting

  const wasteLocation = {
    description: values.wasteLocation.description,
    place_id: values.wasteLocation.place_id,
    structured_formatting: withoutMatchedSubstrings,
  }

  normalizedValues.wasteLocation = wasteLocation

  const notificationCities = values.notificationCities.map((item) => {
    const normalizedItem = {}
    normalizedItem.description = item.description
    normalizedItem.place_id = item.place_id
    normalizedItem.structured_formatting = item.structured_formatting
    return normalizedItem
  })
  normalizedValues.notificationCities = notificationCities

  return normalizedValues
}
