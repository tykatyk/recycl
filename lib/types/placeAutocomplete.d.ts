export interface StructuredFormatting {
  main_text: string
  secondary_text: string
}
export interface RawPlaceType {
  place_id: string
  structured_formatting: StructuredFormatting
}
export interface PlaceType {
  place_id: string
  main_text: string
}
