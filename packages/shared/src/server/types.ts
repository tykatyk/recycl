import { Types } from 'mongoose'

export type Lng = number
export type Lat = number

interface WasteAdPoint {
  weight: number
  wasteLocation: {
    description: string
    position: {
      coordinates: [Lng, Lat]
    }
  }
}

export interface WasteAdIndividualPoint extends WasteAdPoint {
  adId: string
  title: string
}

export interface WasteAdCollectivePoint extends WasteAdPoint {
  totalAds: number
}

export type FeatureProperties = WasteAdIndividualPoint | WasteAdCollectivePoint

export type ClusterProperties = {
  totalWeight: number
}

export type BBox = [number, number, number, number]
