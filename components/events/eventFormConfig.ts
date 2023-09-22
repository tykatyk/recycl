import type { EventValues, NormalizedEventValues } from '../../lib/types/event'
import type {
  NormalizedPlaceType,
  PlaceType,
} from '../../lib/types/placeAutocomplete'
import type { WasteType } from '../../lib/types/waste'

export function getInitialValues(
  event: EventValues | null = null
): EventValues {
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
export function getNormalizedValues(
  values: EventValues
): NormalizedEventValues {
  const rawLocation = values.location as PlaceType
  const location: NormalizedPlaceType = {
    place_id: rawLocation.place_id,
    main_text: rawLocation.structured_formatting?.main_text,
  }
  const wasteType: WasteType = JSON.parse(values.wasteType)

  return { ...values, location, wasteType }
}
