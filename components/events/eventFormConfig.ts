import { values } from 'lodash'
import type { EventValues } from '../../lib/types/event'
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
  values: EventValues,
  wasteTypesData
): EventValues {
  const wasteName: string = wasteTypesData.getWasteTypes.find(
    (el) => el._id === values.wasteType
  ).name

  let normalizedValues = { ...values }
  const wasteType = { _id: values.wasteType as string, name: wasteName }
  normalizedValues.wasteType = wasteType

  return normalizedValues
}
