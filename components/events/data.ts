export type EventsData ={
    id: number
    date: string
    time: string
    locations: string
    wasteTypes: string
  }
 
  export const active: EventsData[] = [
    {
        id: 1,
        date: '15 августа',
        time: '11:00',
        locations: 'Бар',
        wasteTypes: 'Металлолом',
      },
      {
        id: 2,
        date: '16 августа',
        time: '09:00',
        locations: 'Винница',
        wasteTypes: 'Стекло',
      },
      {
        id: 3,
        date: '3 января',
        time: '15:00',
        locations: 'Черкасы',
        wasteTypes: 'Шины',
      },
  ]

  export const inactive: EventsData[] = [
    {
      id: 1,
      date: '8 сентября',
      time: '11:00',
      locations: 'Голодьки',
      wasteTypes: 'Аккумуляторы',
    },
    {
      id: 2,
      date: '5 сентября',
      time: '09:00',
      locations: 'Киев',
      wasteTypes: 'Стекло',
    },
    {
      id: 3,
      date: '3 октября',
      time: '15:00',
      locations: 'Льово',
      wasteTypes: 'Стекло',
    },
  ]