export type PlaceType = {
  place_id: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

export type NormalizedPlaceType = {
  place_id: string
  main_text: string
}
