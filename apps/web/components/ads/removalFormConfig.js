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

  return normalizedValues
}
