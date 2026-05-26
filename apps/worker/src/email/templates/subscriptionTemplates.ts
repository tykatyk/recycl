import type {
  WasteLocationCounter,
  SubscriptionVariantName,
} from '../..//subscription/types'
import { subscriptionVariantNames } from '@recycl/shared/dist/server/subscription'

const { wasteAvailable, wasteRemoval } = subscriptionVariantNames

const removalEventsRoute = 'events'
const removalApplicationsRoute = 'applications'

const white = ' #ffffff'

const getHost = () => {
  if (!process.env.HOST) {
    throw new Error('process.env.HOST is not defined')
  }
  return process.env.HOST
}

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
      return new URL(`${host}/${removalApplicationsRoute}/?${query}`).toString()

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
                  ${wasteTypeIdx !== adCounters.length - 1 ? "<td height='16' style='line-height:16px; font-size:0;'></td>" : ''}
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

type FullHtmlData = { content: string; title: string; header: string }

const getFullHtml = (data: FullHtmlData) => {
  const logoPath = '../public/images/logo.png'
  const brandName = process.env.BRAND || '' //ToDo: refactor
  const unsubscribeText =
    'Если вы не хотите получать подобные уведомления, нажмите'
  const unsubscribe = 'Oтписаться'

  const { content, title, header } = data

  const fullHtml = `
   <html>
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
    </head>
    <body style="font-family: Arial, Helvetica, sans-serif; color:${white}">
      <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%">
        <tr>
          <td align="center">
            <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="600" style="border-radius: 10px; background: #223c4a;">
              <tr>
                <td style="padding:16px;">
                  <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%">
                    <tr>
                      <td align="center" style="color:#adce5d;"\>
                        <a href="${getHost()}" title="${brandName}" style="display: inline-block; text-decoration: none; color: #adce5d;">
                          <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%">
                            <tr>
                              <td>
                                <img
                                  src="${logoPath}"
                                  alt="Logo"
                                  width="30"
                                  style="display: block; border: 0"
                                />
                              </td>
                              <td
                                style="
                                  font-size: 24px;
                                  font-weight: bold;
                                  letter-spacing: 0;
                                "
                              >
                                ${brandName}
                              </td>
                            </tr>
                          </table>
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size: 24px; font-weight: bold; padding-bottom: 24px;">
                        ${header}
                      </td>
                    </tr>
                    ${content}
                    <tr>
                      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 14px; color: #ccc">
                        ${unsubscribeText}
                        <br />
                        <a href="{{unsubscribe_url}}" title="${unsubscribe}"
                          style="
                            display: inline-block;
                            padding-top: 4px;
                            color: #ccc;
                            text-decoration: underline;
                          ">
                          ${unsubscribe.toLowerCase()}
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `
  return fullHtml
}
