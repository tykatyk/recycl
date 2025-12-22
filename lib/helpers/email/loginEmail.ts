//https://next-auth.js.org/providers/email#customizing-emails

import { ThemeColors } from '../../types/themeColors'

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */

const brandName = 'Recycl'
const welcomeText = 'Для входа в учетную запись перейдите по ссылке'
const wrongLetterText =
  'Если запрос на вход отправлялся не вами, просто проигнорируйте данное письмо.'
const signInText = 'Войти'
const logoPath = '../../public/images/logo.png'

export function html(params: {
  url: string
  host: string
  theme: ThemeColors
}) {
  const { url, host, theme } = params

  const escapedHost = host.replace(/\./g, '&#8203;.')

  return `
  <body style="font-family: 'Roboto', sans-serif">
    <table
      role="presentation"
      width="100%"
      border="0"
      cellspacing="20"
      cellpadding="0"
      style="
        background:${theme.background};
        max-width: 600px;
        margin: auto;
        border-radius: 10px;
      "
    >
      <tr>
        <td align="center" style="padding: 10px 0px; color: ${theme.text}">
          <a
            href="${escapedHost}"
            style="display: inline-block; text-decoration: none"
          >
            <table role="presentation">
              <tr>
                <td style="color:${theme.text}">
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
                    color:${theme.brand};
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
          style="font-size: 16px; font-weight: bold; color: #fff"
        >
          ${welcomeText}
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 20px 0">
          <table role="presentation" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td
                align="center"
                style="border-radius: 5px; background-color:${theme.secondary}"
              >
                <a
                  href="${url}"
                  target="_blank"
                  style="
                    color: ${theme.buttonText};
                    font-size: 18px;
                    text-decoration: none;
                    border-radius: 5px;
                    padding: 10px 20px;
                    display: inline-block;
                    font-weight: bold;
                  "
                >
                  ${signInText}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td
          align="center"
          style="padding: 0px 0px 10px 0px; font-size: 16px; color: ${theme.text}"
        >
          ${wrongLetterText}
        </td>
      </tr>
    </table>
  </body>
  `
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
export function text({ url, host }: { url: string; host: string }) {
  return `Для входа в учетную запись на сайте ${host} перейдите по ссылке\n${url}\n\n`
}
