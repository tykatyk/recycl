import { Email } from '../../../types/email'
import formatDate from '../../dateFormatter'
import type { WasteRemovalNotification } from '../../../types/subscription'

const host = process.env.HOST || ''
const brandName = process.env.BRAND || ''
const emailFrom = process.env.EMAIL_FROM || ''

const yellow = ' #f8bc45'
const white = ' #ffffff'
const logoPath = '../public/images/logo.png'
const title = 'Список событий по приему вторсырья '
const header =
  'Информируем вас о предстоящих событиях по сбору вторсырья в вашем населенном пункте'
const unsubscribeText =
  'Если вы не хотите получать подобные уведомления, нажмите'
const unsubscribe = 'Oтписаться'

const getUrl = (params: { host: string; route: string; id?: string }) => {
  const { host, route, id } = params
  const url = new URL(`${host}${route}${id ? `/${id}` : ''}`)
  return url.toString()
}

type EmailParams = {
  notification: WasteRemovalNotification
  subject: string
  html: string
}
export function prepareEmailObj(params: EmailParams) {
  const { notification, subject, html } = params

  const receiverName = notification.receiverName ?? notification.receiverEmail

  const emailObj: Email = {
    html,
    subject,
    from: {
      name: brandName,
      email: emailFrom,
    },
    to: [
      {
        name: receiverName,
        email: notification.receiverEmail,
      },
    ],
  }
  return emailObj
}

export function prepareHtml(notification: WasteRemovalNotification) {
  const emailHtml = notification.data
    .map((loc) => {
      const byLocationHtml = loc.eventsByLocation
        .map((evByLocation) => {
          const { wasteType, eventsByWasteType } = evByLocation
          const byWasteTypeHtml = eventsByWasteType
            .map(
              (evByWasteType, idx) => `
        <tr>
          <td style="color:${white}; line-height: 1.1; ${idx === eventsByWasteType.length - 1 ? '' : 'padding-bottom: 16px;'} padding-left: 8px">
            <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%">
              <tbody>
                <tr><td>Дата и время: ${formatDate(evByWasteType.date)}</td></tr>
                <tr><td>Организатор: ${evByWasteType.agentName}</td></tr>
                <tr>
                  <td>
                    <a style="display: inline-block; padding-top: 4px; text-decoration: none; color:${yellow};" 
                      href="${getUrl({ host, route: '/events', id: evByWasteType.eventId })}">Подробнее</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>`,
            )
            .join('')

          return `
        <tr>
          <td style="padding-bottom: 8px">
            <table role="presentation" border="0" cellspacing="0" cellpadding="0 width="100%"
              style="font-size: 16px">
              <tbody>
                <tr><td align="left" style="padding: 0 0 16px 8px;">Тип вторсырья: ${wasteType}</td></tr>
                ${byWasteTypeHtml}
              </tbody>
            </table>
          </td>
        </tr>`
        })
        .join('')

      return `
      <tr>
        <td style="padding: 24px 0">
          <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%" style="color:${white}; text-align: left">
            <tbody>
              <tr><td style="font-size: 24px; padding-bottom: 16px">Населенный пункт: ${loc.locationName}</td></tr>
              ${byLocationHtml}
            </tbody>
          </table>
        </td>
      </tr>`
    })
    .join('')

  const content = `
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
              ${emailHtml}
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
  return content
}
