import type {
  WasteLocationCounter,
  SubscriptionVariantName,
} from '../../../types/subscription'
import { subscriptionVariantNames } from '../../subscriptions'

const { wasteAvailable, wasteRemoval } = subscriptionVariantNames

const removalEventsRoute = 'events'
const removalApplicationsRoute = 'applications'

const host = process.env.HOST || ''
const white = ' #ffffff'

const getUrl = (params: {
  wasteName: string
  locationId: string
  subscriptionName: string
}) => {
  const { wasteName, locationId, subscriptionName } = params

  const query = `wasteType=${wasteName}$location=${locationId}&sortBy=createdAd&sortOrder=desc`

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
      title = 'Список новых объявлений о наличии вторсыръя'
      header =
        'Информируем вас о новых объявлениях о наличии отходов для переработки'
      return { title, header }

    case wasteRemoval:
      title = 'Список новых объявлений о наличии вторсыръя'
      header =
        'Информируем вас о новых объявлениях о наличии отходов для переработки'
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
                        <td style="padding:8px">
                          Тип отходов: ${wasteName}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px">
                          Новых объявлений: ${newAdsCount}
                        </td>
                      </tr>
                      <tr style="padding:8px">
                        <a href="${getUrl({ wasteName, locationId, subscriptionName })}">Посмотреть</a>
                      </tr>
                      ${wasteTypeIdx !== adCounters.length - 1 ? "<td height='8' style='line-height:8px; font-size:0;'></td>" : ''}
                      `
        })
        .join('')

      return `<table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%">
                    <tr>
                      <td style="padding:16px 8px">Населенный пункт: ${locationName}</td>
                    </tr>
                    ${newAdsCountByWasteTypes}
                    <tr><td height="24"></td></tr>
                    ${locationIdx !== locations.length - 1 ? "<td height='24' style='line-height:24px; font-size:0;'></td>" : ''}
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
  const brandName = process.env.BRAND || ''
  const unsubscribeText =
    'Если вы не хотите получать подобные уведомления, нажмите'
  const unsubscribe = 'Oтписаться'

  const { content, title, header } = data

  return `
   <html>
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
    </head>
    <body style="font-family: Arial, Helvetica, sans-serif; color:${white}">
      <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%">
        <tr>
          <td align="center>
            <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="600" style="border-radius: 10px; background: #223c4a;">
              <tr>
                <td align="center" style="padding: 10px 0px; color:${white}>
                  <a href="${host}" title="${brandName}" style="display: inline-block; text-decoration: none; color: #adce5d;">
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
                <td align="center" style="font-size: 32px; font-weight: bold; padding: 10px 0px;">
                  ${header}
                </td>
              </tr>
              ${content}
              <tr>
                <td height="32"></td>
              </tr>
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
    </body>
  </html>
  `
}
