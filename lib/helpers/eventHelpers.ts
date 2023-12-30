import { ReactNode } from 'react'
import dayjs from 'dayjs'
import type { Event } from '../types/event'

export function getInitialValues(event?: Event, userPhone: string = ''): Event {
  return {
    user: event?.user || '',
    location: event?.location || null,
    waste: event?.waste || '',
    date: event ? dayjs(event.date) : null,
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

type ColumnHeader = {
  id: string
  headerName: ReactNode | string
  headerAlign?: 'left' | ' right' | 'center'
  width: number
}

export function getColumns(
  getHeader: () => ReactNode | 'Дата',
): ColumnHeader[] {
  return [
    {
      id: 'checkbox',
      headerName: 'Выбрать',
      width: 70,
    },
    {
      id: 'date',
      headerName: getHeader(),
      width: 150,
    },
    {
      id: 'time',
      headerName: 'Время',
      width: 150,
      headerAlign: 'center',
    },
    {
      id: 'location',
      headerName: 'Место',
      width: 170,
    },
    {
      id: 'wasteType',
      headerName: 'Тип отходов',
      width: 200,
      headerAlign: 'center',
    },
  ]
}
