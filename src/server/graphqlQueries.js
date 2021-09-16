import { gql } from '@apollo/client'

export const CREATE_REMOVAL_APPLICATION = gql`
  mutation CreateRemovalApplication($application: RemovalApplication) {
    createRemovalApplication(application: $application) {
      _id
      wasteLocation {
        description
        place_id
        structured_formatting {
          main_text
          main_text_matched_substrings {
            length
            offset
          }
          secondary_text
        }
      }
      wasteType
      quantity
      comment
      passDocumet
      notificationCitiesCheckbox
      notificationCities {
        description
        place_id
        structured_formatting {
          main_text
          main_text_matched_substrings {
            length
            offset
          }
          secondary_text
        }
      }
      notificationRadius
      notificationRadiusCheckbox
    }
  }
`

export const GET_REMOVAL_APPLICATION = gql`
  query GetRemovalApplication($id: String!) {
    getRemovalApplication(id: $id) {
      _id
      wasteLocation {
        description
        place_id
        structured_formatting {
          main_text
          main_text_matched_substrings {
            length
            offset
          }
          secondary_text
        }
      }
      wasteType
      quantity
      comment
      passDocumet
      notificationCitiesCheckbox
      notificationCities {
        description
        place_id
        structured_formatting {
          main_text
          main_text_matched_substrings {
            length
            offset
          }
          secondary_text
        }
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
        structured_formatting {
          main_text
          main_text_matched_substrings {
            length
            offset
          }
          secondary_text
        }
      }
      wasteType
      quantity
      comment
      passDocumet
      notificationCitiesCheckbox
      notificationCities {
        description
        place_id
        structured_formatting {
          main_text
          main_text_matched_substrings {
            length
            offset
          }
          secondary_text
        }
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
