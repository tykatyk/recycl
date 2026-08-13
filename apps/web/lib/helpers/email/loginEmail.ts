//https://next-auth.js.org/providers/email#customizing-emails

import { default as theme } from '../../../lib/helpers/themeStub'

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */

const wrongLetterText =
  'Если запрос на вход отправлялся не вами, просто проигнорируйте данное письмо.'
const signInText = 'Войти'

export function getLoginEmailContent(url: string) {
  return `
    <tr>
      <td
        align="center"
        style="border-radius: 5px; padding: 20px 0;"
      >
        <a
          href="${url}"
          target="_blank"
          style="
            color: ${theme.palette.text.primary};
            background-color:${theme.palette.primary.main};
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
    <tr>
      <td
        align="center"
        style="padding: 0px 0px 10px 0px; color: ${theme.palette.text.primary}"
      >
        ${wrongLetterText}
      </td>
    </tr>
  `
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
export function text({ url, host }: { url: string; host: string }) {
  return `Для входа в учетную запись на сайте ${host} перейдите по ссылке\n${url}\n\n`
}
