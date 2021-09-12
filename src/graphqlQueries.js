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
      comment
      passDocumet
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

export const GET_ALL_REMOVAL_APPLICATIONS = gql`
  query GetAllRemovalApplications {
    getAllRemovalApplications {
      _id
      wasteLocation {
        description
        place_id
      }
      wasteType
      quantity
      comment
      passDocumet
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
