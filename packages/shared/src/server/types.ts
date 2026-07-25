export type Lng = number
export type Lat = number

export type MapCenter = { lat: number; lng: number }

interface WasteAdPoint {
  weight: number
  placeId: string
  placeDescription: string
}

export interface WasteAdIndividualPoint extends WasteAdPoint {
  adId: string
  title: string
}

export interface WasteAdCollectivePoint extends WasteAdPoint {
  totalAds: number
  wasteType: string
}

export type FeatureProperties = WasteAdIndividualPoint | WasteAdCollectivePoint

export type WasteAdClusterProperties = {
  totalWeight: number
}

export type BBox = [number, number, number, number]

//CollectionPoints

interface CollectionPointFeature {
  placeId: string
  placeDescription: string
}

export interface IndividualCollectionPointFeature extends CollectionPointFeature {
  adId: string
  wasteTypes: string[]
  variant: string
  phone: string
  comment?: string
  // title: string
}
export interface AggregatedCollectionPointFeature extends CollectionPointFeature {
  totalAds: number
  wasteType: string
}

export type CollectionPointFeatureProperties =
  | IndividualCollectionPointFeature
  | AggregatedCollectionPointFeature
