interface StructuredFormatting {
  main_text: string
  secondary_text: string
}

interface MainTextMatchedSubstrings {
  offset: number
  length: number
}

interface StructuredFormattingWithMatchedSubstrings extends StructuredFormatting {
  main_text_matched_substrings: readonly MainTextMatchedSubstrings[]
}

export interface PlaceType {
  description: string
  place_id: string
  structured_formatting: StructuredFormatting
}

export interface PlaceTypeWithMatchedSubstrings extends PlaceType {
  structured_formatting: StructuredFormattingWithMatchedSubstrings
}

export type Position = {
  lat: number
  lng: number
}
