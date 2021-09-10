import { gql } from '@apollo/client'

export const CREATE_REMOVAL_APPLICATION = gql`
  mutation SomeMutation($application: RemovalApplication) {
    createRemovalApp(application: $application) {
      _id
      wasteType
      quantity
      passDocumet
      description
      notificationCitiesCheckbox
      notificationRadius
      notificationRadiusCheckbox
    }
  }
`
