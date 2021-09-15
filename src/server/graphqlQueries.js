import { gql } from '@apollo/client'

export const CREATE_REMOVAL_APPLICATION = gql`
  mutation CreateRemovalApplication($application: RemovalApplication) {
    createRemovalApplication(application: $application) {
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

export const GET_REMOVAL_APPLICATIONS = gql`
  query GetRemovalApplications {
    getRemovalApplications {
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

export const GET_WASTE_TYPES = gql`
  query GetWasteTypes {
    getWasteTypes {
      _id
      name
    }
  }
`
