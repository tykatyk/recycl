import dayjs from 'dayjs'
import type { Event } from '../../lib/types/event'

export function getInitialValues(event?: Event, userPhone: string = ''): Event {
  return {
    location: event?.location || null,
    waste: event?.waste || '',
    date: event ? dayjs(event.date) : '',
    phone: event?.phone || userPhone,
    comment: event?.comment || '',
  }
}

//ToDo привести цю функцію у відповідність з аналогічною функцією в removalFormConfig
export function getNormalizedValues(values: Event): Event {
  if (!values.location) return values

  const normalizedLocation = {
    description: values.location.description,
    place_id: values.location?.place_id,
    structured_formatting: {
      main_text: values.location?.structured_formatting.main_text,
      secondary_text: values.location?.structured_formatting.secondary_text,
    },
  }
  const normalizedValues = { ...values, location: normalizedLocation }

  return normalizedValues
}
