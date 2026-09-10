import { wasteTypeNames } from '@recycl/shared/dist/constants'
export type Waste = {
  _id: string
  name: (typeof wasteTypeNames)[number]
}
