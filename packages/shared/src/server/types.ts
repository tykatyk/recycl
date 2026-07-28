export type Lng = number
export type Lat = number
export type BBox = [number, number, number, number]
export type MapCenter = { lat: number; lng: number }

interface WasteAdBaseFeature {
  weight: number
  placeId: string
  placeDescription: string
}

export interface IndividualWasteAdFeature extends WasteAdBaseFeature {
  adId: string
  title: string
}

export interface AggregatedWasteAdFeature extends WasteAdBaseFeature {
  totalAds: number
  wasteType: string
}

export type AdFeature = IndividualWasteAdFeature | AggregatedWasteAdFeature

export type WasteAdClusterProperties = {
  totalWeight: number
}

interface CollectionPointBaseFeature {
  placeId: string
  placeDescription: string
}

export interface IndividualCollectionPointFeature extends CollectionPointBaseFeature {
  adId: string
  wasteTypes: string[]
  variant: string
  phone: string
  comment?: string
}
export interface AggregatedCollectionPointFeature extends CollectionPointBaseFeature {
  totalAds: number
  wasteType: string
}

export type CollectionPointFeature =
  | IndividualCollectionPointFeature
  | AggregatedCollectionPointFeature
