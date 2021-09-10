import { gql } from '@apollo/client'

export const CREATE_REMOVAL_APPLICATION = gql`
  mutation SomeMutation($application: RemovalApplication) {
    createRemovalApp(application: $application) {
      _id
      wasteLocation {
        description
        place_id
      }
      wasteType
      quantity
      passDocumet
      description
      notificationCitiesCheckbox
      notificationCities {
        description
        place_id
      }
      notificationRadius
      notificationRadiusCheckbox
    }
  }
`
