import dayjs from 'dayjs'
export function getInitialValues(event) {
  return {
    location: event?.location || null,
    wasteType: event?.wasteType || '',
    date: event?.date || '',
    startTime: event?.startTime || '',
    endTime: event?.endTime || '',
    phone: event?.phone || '',
    comment: event?.comment || '',
  }
}

//ToDo привести цю функцію у відповідність з аналогічною функцією в removalFormConfig
export function getNormalizedValues(values) {
  const normalizedValues = {}
  Object.assign(normalizedValues, values)

  const location = {
    place_id: values.location.place_id,
    main_text: values.location.structured_formatting.main_text,
  }
  normalizedValues.location = location

  const wasteType = JSON.parse(values.wasteType)
  normalizedValues.wasteType = wasteType

  return normalizedValues
}
