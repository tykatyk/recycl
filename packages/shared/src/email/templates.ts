const white = ' #ffffff'

export const getHost = () => {
  if (!process.env.HOST) {
    throw new Error('process.env.HOST is not defined')
  }
  return process.env.HOST
}

type FullHtmlData = { content: string; title: string; header?: string }

export const delimiter = `
  <tr>
    <td height='16' style='line-height:16px; font-size:0;'></td>
  </tr>
  `

export const getFullHtml = (data: FullHtmlData) => {
  const logoPath = '../public/images/logo.png'
  const brandName = process.env.BRAND || '' //ToDo: refactor
  const unsubscribeText =
    'Если вы не хотите получать подобные уведомления, нажмите'
  const unsubscribe = 'Oтписаться'

  const { content, title, header } = data

  const logo = `
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
  `

  const heading = header
    ? `
   <tr>
    <td align="center" style="font-size: 24px; font-weight: bold; padding-bottom: 24px;">
      ${header}
    </td>
   </tr>
  `
    : ''

  const footer = `
  ${delimiter}
  <tr>
    <td align="center" style="padding: 0px 0px 10px 0px; font-size: 12px; color: #ccc">
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
  `

  const fullHtml = `
   <html>
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
    </head>
    <body style="font-family: Arial, Helvetica, sans-serif; color:${white}">
      <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%" style="background: #223c4a;">
        <tr>
          <td align="center">
            <table role="presentation" border="0" cellspacing="0" cellpadding="0" >
              <tr>
                <td width="600" style="padding:16px;">
                  <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%">
                    ${logo}
                    ${heading}
                    ${content}
                    ${footer}
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
