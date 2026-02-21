import { Email } from '../../../types/email'
import formatDate from '../../dateFormatter'
import type { WasteRemovalNotification } from '../../../types/subscription'

const yellow = ' #f8bc45'
const logoPath = '../public/images/logo.png'

const getUrl = (params: { host: string; route: string; id?: string }) => {
  const { host, route, id } = params
  const url = new URL(`${host}${route}${id ? `/${id}` : ''}`)
  return url.toString()
}

type EmailParams = {
  notification: WasteRemovalNotification
  host: string
  brandName: string
  subject: string
  html: string
  emailFrom: string
}
export function prepareEmailObj(params: EmailParams) {
  const { notification, subject, html, brandName, emailFrom, host } = params

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
    // headers: {
    //   'List-Unsubscribe': `<${getUrl({ host, route: 'my/subscriptions/unsubscribe', id: notification.listUnsubscribeToken })}>`,
    //   'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    // },
  }
  return emailObj
}

type PrepareEmailHtml = {
  notification: WasteRemovalNotification
  host: string
  brandName: string
}

export function prepareEmailHtml(params: PrepareEmailHtml) {
  const { notification, host, brandName } = params

  const emailHtml = notification.data
    .map((loc) => {
      const byLocationHtml = loc.eventsByLocation
        .map((evByLocation) => {
          const { wasteType, eventsByWasteType } = evByLocation
          const byWasteTypeHtml = eventsByWasteType
            .map(
              (evByWasteType, idx) => `
        <tr style="color: #ccc; line-height: 1.1">
          <td style="${idx === eventsByWasteType.length - 1 ? '' : 'padding-bottom: 16px'}; padding-left: 8px">
            <table>
              <tr><td>Дата и время: ${formatDate(evByWasteType.date)}</td></tr>
              <tr><td>Организатор: ${evByWasteType.agentName}</td></tr>
              <tr>
                <td>
                  <a style="display: inline-block; padding-top: 4px; text-decoration: none; color:${yellow};" 
                     href="${getUrl({ host, route: 'events', id: evByWasteType.eventId })}">Подробнее</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>`,
            )
            .join('')

          return `
        <tr>
          <td style="padding-bottom: 8px">
            <table style="font-size: 16px; color: #fff;">
              <tr><th align="left" style="padding: 0 0 16px 8px;">Тип вторсырья: ${wasteType}</th></tr>
              ${byWasteTypeHtml}
            </table>
          </td>
        </tr>`
        })
        .join('')

      return `
      <tr>
        <td style="padding: 24px 0">
          <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="color: #fff; text-align: left" width="100%">
            <tr><th style="font-size: 24px; padding-bottom: 16px">Населенный пункт: ${loc.locationName}</th></tr>
            ${byLocationHtml}
          </table>
        </td>
      </tr>`
    })
    .join('')

  const content = `
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Список событий по приему вторсырья </title>
    </head>
    <body style="font-family: Arial, Helvetica, sans-serif; color: #fff">
      <table
        role="presentation"
        width="100%"
        border="0"
        cellspacing="20"
        cellpadding="0"
        style="
          border-radius: 10px;
          background: #223c4a;
          max-width: 600px;
          margin: auto;
        "
      >
          <tr>
            <td align="center" style="padding: 10px 0px; color: #fff">
              <a href="${host}" style="display: inline-block; text-decoration: none; color: #adce5d;">
                <table role="presentation">
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
            <td
              align="center"
              style="font-size: 32px; font-weight: bold;"
            >
              Информируем вас о предстоящих событиях по сбору вторсырья в вашем населенном пункте
            </td>
          </tr>
          ${emailHtml}
          <tr>
            <td
              align="center"
              style="padding: 0px 0px 10px 0px; font-size: 14px; color: #ccc"
            >
              Если вы не хотите получать подобные уведомления, нажмите
              <br /><a
                href="{{unsubscribe_url}}"
                style="
                  display: inline-block;
                  padding-top: 4px;
                  color: #ccc;
                  text-decoration: underline;
                "
                >отписаться</a
              >.
            </td>
        </tr>
      </table>
    </body>
  </html>
  `
  return content
}
