import gql from 'graphql-tag'

export default gql`
  type Query {
    getAds(queryParams: QueryParams): [AdOutput]
    getAdsWithMessageCount: [AdsWithMessageCountOutput]
  }

  type Mutation {
    createAd(ad: Ad!): AdOutput
    updateAd(id: String!, newValues: Ad!): AdOutput
    deleteAd(id: String!): AdOutput
    deleteAds(ids: [String!]!): DeleteManyOutput
  }

  type UserOutputForAd {
    _id: String!
    name: String!
  }

  type AdOutput {
    _id: String!
    title: String!
    wasteLocation: LocationOutput!
    wasteType: String!
    contactPhone: String
    quantity: Int!
    user: UserOutputForAd!
    comment: String
    passDocumet: Boolean
    notificationCitiesCheckbox: Boolean
    notificationCities: [LocationOutput!]
    notificationRadius: String
    notificationRadiusCheckbox: Boolean
    expires: Date!
    createdAt: Date!
  }

  type AdsWithMessageCountOutput {
    document: AdOutput!
    messageCount: Int
  }

  input Ad {
    title: String!
    wasteLocation: Location!
    wasteType: String!
    quantity: Int!
    contactPhone: String!
    comment: String
    passDocumet: Boolean
    notificationCitiesCheckbox: Boolean
    notificationCities: [Location!]
    notificationRadius: String
    notificationRadiusCheckbox: Boolean
  }

  input QueryParams {
    city: String
    wasteType: String
  }
`
