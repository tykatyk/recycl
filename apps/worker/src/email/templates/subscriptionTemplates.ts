import type {
  WasteLocationCounter,
  SubscriptionVariantName,
} from '../..//subscription/types'
import { subscriptionVariantNames } from '@recycl/shared/dist/server/subscription'
import { getHost, getFullHtml, delimiter } from '@recycl/shared/dist/email'

const { wasteAvailable, wasteRemoval } = subscriptionVariantNames

const removalEventsRoute = 'events'
const removalAdsRoute = 'ads'

const getUrl = (params: {
  wasteName: string
  locationId: string
  subscriptionName: string
}) => {
  const host = getHost()

  const { wasteName, locationId, subscriptionName } = params

  const query = encodeURI(
    `wasteType=${wasteName}$location=${locationId}&sortBy=createdAd&sortOrder=desc`,
  )

  switch (subscriptionName) {
    case wasteAvailable:
      return new URL(`${host}/${removalAdsRoute}/?${query}`).toString()

    case wasteRemoval:
      return new URL(`${host}/${removalEventsRoute}/?${query}`).toString()

    default:
      throw new Error('Unknown subscription name')
  }
}

export const getSubscriptionTitleAndHeader = (
  subscriptionName: SubscriptionVariantName,
) => {
  let title = ''
  let header = ''

  switch (subscriptionName) {
    case wasteAvailable:
      title = 'Новые объявления о наличии вторсырья'
      header = 'Информируем вас о новых объявлениях о появлении вторсырья'
      return { title, header }

    case wasteRemoval:
      title = 'Передвижные пункты приема отходов в вашем регионе'
      header = 'Информируем вас о передвижных пунктах приема вторсырья'
      return { title, header }

    default:
      throw new Error('Unknown subscription name')
  }
}

export const getSubscriptionHtml = (params: {
  locations: WasteLocationCounter[]
  subscriptionName: SubscriptionVariantName
}) => {
  const { locations, subscriptionName } = params
  const { title, header } = getSubscriptionTitleAndHeader(subscriptionName)

  const newAdsCountByLocation = locations
    .map((location, locationIdx) => {
      const { locationName, locationId, adCounters } = location
      const newAdsCountByWasteTypes = adCounters
        .map((wasteType, wasteTypeIdx) => {
          const { wasteName, newAdsCount } = wasteType
          return `<tr>
                    <td style="padding:0 0 4px 8px">
                      Тип отходов: ${wasteName}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 0 4px 8px">
                      Новых объявлений: ${newAdsCount}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 0 4px 8px">
                      <a href="${getUrl({ wasteName, locationId, subscriptionName })}" style="color:#adce5d;">Посмотреть</a>
                    </td>
                  </tr>
                  ${wasteTypeIdx !== adCounters.length - 1 ? delimiter : ''}
                      `
        })
        .join('')

      return `<table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%">
                    <tr>
                      <td style="padding:0 0 8px 0; font-weight:bold;">Населенный пункт: ${locationName}</td>
                    </tr>
                    ${newAdsCountByWasteTypes}
                    <tr><td height='32' style='line-height:32px; font-size:0;'></td></tr>
                  </table>`
    })
    .join('')

  const content = `<tr>
                <td>${newAdsCountByLocation}</td>
              </tr>`
  return getFullHtml({ content, title, header })
}
