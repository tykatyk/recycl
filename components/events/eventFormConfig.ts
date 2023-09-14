import {
  InitialEventValues,
  RawEventValues,
  EventValues,
} from '../../lib/types/event'
import { PlaceType } from '../../lib/types/placeAutocomplete'
import { WasteType } from '../../lib/types/waste'

export function getInitialValues(event: InitialEventValues | null = null) {
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
export function getNormalizedValues(values: RawEventValues): EventValues {
  const location: PlaceType = {
    place_id: values.location.place_id,
    main_text: values.location.structured_formatting.main_text,
  }
  const wasteType: WasteType = JSON.parse(values.wasteType)

  return { ...values, location, wasteType }
}
