export function getInitialValues(event) {
  return {
    location: event?.location || null,
    wasteType: event?.wasteType || '',
    date: event?.date || 'ДД.ММ.ГГГ',
    startTime: event?.startTime || '',
    endTime: event?.endTime || '',
    phone: event?.phone || '',
    comment: event?.comment || '',
  }
}
