import React from 'react'
import {
  makeStyles,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core'
import Layout from './layouts/Layout.jsx'
import Link from './uiParts/Link.jsx'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    maxWidth: 800,
  },
  h1: {
    fontSize: '3rem',
    marginBottom: '3rem',
    fontWeight: 'bold',
    color: '#adce5d',
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#adce5d',
  },
  section: {
    marginBottom: '3rem',
  },
  subtitle: {
    fontWeight: 'bold',
    color: '#adce5d',
  },
  list: {
    paddingLeft: '2em',
    listStyle: 'disc',
    marginBottom: theme.spacing(2),
    fontSize: '1rem',
    lineHeight: '1.5',
    letterSpacing: '0.00938em',
  },
  tableContainer: {
    marginBottom: '1em',
  },
  table: {
    minWidth: 650,
  },
  link: {
    fontSize: '1rem',
    lineHeight: '1.5',
    letterSpacing: '0.00938em',
    color: '#adce5d',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}))

const authCookies = [
  {
    name: 'next-auth.callback-url',
    purpose:
      'Вказує url, куди перенаправляться запит при вході користувача в систему ',
    type: 'Сесійна',
    storageTime: 'До закриття браузера',
  },
]

const technicalCookies = [
  {
    name: 'next-auth.csrf-token',
    purpose: 'Запобігає здійсненню міжсайтових атак',
    type: 'Сесійна',
    storageTime: 'До закриття браузера',
  },
  {
    name: 'next-auth.session-token',
    purpose: 'Зберігає інформацію про поточну сесію користувача',
    type: 'Постійна',
    storageTime: '1 місяць',
  },
]

const operationalCookies = [
  {
    name: 'cookieConsent',
    purpose: 'Вказує чи погодились ви з використанням cookie',
    type: 'Постійна',
    storageTime: '31 день',
  },
]

export default function CookiePolicyPage() {
  const classes = useStyles()

  return (
    <Layout title="Политика использования cookie файлов | Recycl">
      <Container className={classes.container}>
        <Typography
          variant="h1"
          align="center"
          className={classes.h1}
          id="cookie-policy"
        >
          Політика використання cookie файлів
        </Typography>
        <article style={{ textAlign: 'justify' }}>
          <section className={classes.section}>
            <Typography
              variant="h2"
              gutterBottom
              align="center"
              className={classes.h2}
              id="what-are-cookies"
            >
              ЩО ТАКЕ COOKIES
            </Typography>
            <Typography paragraph>
              Cookie – це невеликий текстовий файл, який веб-сайт зберігає на
              вашому комп’ютері або мобільному пристрої, коли ви відвідуєте
              сайт.
            </Typography>
            <Typography paragraph>
              Файли cookies можуть бути власними і сторонніми. Власні файли
              cookies – це ті, які встановлюються виключно веб-сайтом, який ви
              відвідуєте. Тільки цей веб-сайт може їх прочитати. На відміну від
              власних файлів сторонні файли cookies встановлюються зовнішніми
              службами, які використовує веб сайт.{' '}
            </Typography>
            <Typography paragraph>
              Також файли cookies бувають постійними і сесійними. Постійні файли
              cookies – це ті, які не видаляються автоматично, коли ви
              закриваєте веб-переглядач, на відміну від сесійного cookies, який
              видаляється, коли ви закриваєте браузер.
            </Typography>
            <Typography paragraph>
              При відвідуванні нашого сайту, вам буде запропоновано прийняти або
              відмовитися від файлів cookies. Мета – дозволити сайту запам’ятати
              ваші налаштування (наприклад, ім’я користувача, мова тощо)
              протягом певного періоду часу. Таким чином, вам не доведеться
              повторно вводити їх на різних сторінках сайту під час того самого
              відвідування.
            </Typography>
            <Typography paragraph>
              Файли cookies також можна використовувати для створення анонімної
              статистики про перегляд веб-сайтів.
            </Typography>
          </section>
          <section className={classes.section}>
            <Typography
              variant="h2"
              gutterBottom
              align="center"
              className={classes.h2}
              id="which-cookies-we-use"
            >
              ЯКІ COOKIES МИ ВИКОРИСТОВУЄМО
            </Typography>
            <Typography paragraph>
              Цей веб сайт здебільшого використовує власні файли cookies, тобто
              ті, які встановлюються та контролюються цим сайтом, а не будь-якою
              зовнішньою організацією.
            </Typography>
            <Typography paragraph>
              Однак, щоб переглянути деякі з наших сторінок, вам доведеться
              прийняти cookies від зовнішніх організацій.
            </Typography>
            <Typography gutterBottom className={classes.subtitle}>
              <strong>ВЛАСНІ COOKIES</strong>
            </Typography>
            <Typography>
              Ми використовуємо 2 типи власних файлів cookies:
            </Typography>
            <ul className={classes.list}>
              <li>
                cookies налаштувань - зберігають дані про налаштування
                користувача
              </li>
              <li>
                операційні cookies – призначені для забезпечення роботи сайту
              </li>
            </ul>
            <Typography gutterBottom className={classes.subtitle}>
              <strong>Cookies налаштувань</strong>
            </Typography>
            <Typography>Вони зберігають інформацію про:</Typography>
            <ul className={classes.list}>
              <li>
                чи ви погодилися з політикою використання файлів cookies цього
                сайту
              </li>
              <li>
                чи ви відповіли на наше спливаюче вікно опитування, щоб вас
                більше не запитували
              </li>
            </ul>
            <Typography gutterBottom className={classes.subtitle}>
              <strong>Операційні cookies</strong>
            </Typography>
            <Typography>
              Деякі файли cookies, які ми повинні включити, щоб певні
              веб-сторінки функціонували. З цієї причини вони не потребують
              вашої згоди. Зокрема:
            </Typography>
            <ul className={classes.list}>
              <li>aутентифікаційні cookies</li>
              <li>технічні cookies, необхідні певним ІТ-системам</li>
            </ul>
            <TableContainer
              component={Paper}
              className={classes.tableContainer}
            >
              <Table
                className={classes.table}
                aria-label="Види операційних cookies"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Назва</TableCell>
                    <TableCell>Призначення</TableCell>
                    <TableCell>Тип</TableCell>
                    <TableCell>Час зберігання</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {operationalCookies.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell>{row.purpose}</TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.storageTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography gutterBottom className={classes.subtitle}>
              <strong>Аутентифікаційні cookies</strong>
            </Typography>
            <Typography paragraph>
              Вони зберігаються, коли ви входите на цей сайт, використовуючи
              нашу{' '}
              <Link href="/auth/login" className={classes.link}>
                службу аутентифікації
              </Link>
              . Здійснивши вхід, ви приймаєте нашу{' '}
              <Link href="/privacy-policy" className={classes.link}>
                політику конфіденційності
              </Link>
              .
            </Typography>
            <TableContainer
              component={Paper}
              className={classes.tableContainer}
            >
              <Table
                className={classes.table}
                aria-label="Види аутентифікаційних cookies"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Назва</TableCell>
                    <TableCell>Призначення</TableCell>
                    <TableCell>Тип</TableCell>
                    <TableCell>Час зберігання</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {authCookies.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell>{row.purpose}</TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.storageTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography gutterBottom className={classes.subtitle}>
              <strong>Технічні cookies</strong>
            </Typography>

            <TableContainer
              component={Paper}
              className={classes.tableContainer}
            >
              <Table
                className={classes.table}
                aria-label="Види технічних cookies"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Назва</TableCell>
                    <TableCell>Призначення</TableCell>
                    <TableCell>Тип</TableCell>
                    <TableCell>Час зберігання</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {technicalCookies.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell>{row.purpose}</TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.storageTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography gutterBottom className={classes.subtitle}>
              <strong>СТОРОННІ COOKIES</strong>
            </Typography>
            <Typography paragraph>
              Деякі з наших сторінок відображають вміст від зовнішніх
              постачальників контенту, напр. Google. Щоб переглянути контент
              зовнішніх постачальників, спершу потрібно прийняти їхні положення
              та умови використання. Це стосується і політики щодо файлів
              cookies, яку ми не контролюємо. Але якщо ви не переглядаєте цей
              вміст, на вашому пристрої не встановлюються сторонні файли
              cookies.
            </Typography>
            <Typography>
              Зовнішні постачальники контенту на цьому сайті:
            </Typography>
            <ul className={classes.list} style={{ marginBottom: 0 }}>
              <li>
                <Link
                  href="https://policies.google.com/terms?gl=UA&hl=uk"
                  className={classes.link}
                >
                  Google
                </Link>
              </li>
              <li>
                <Link
                  href="https://geolocation-db.com/terms"
                  className={classes.link}
                >
                  Geolocation DB
                </Link>
              </li>
            </ul>

            <Typography paragraph>
              Ці служби знаходяться поза нашим контролем і можуть у будь-який
              час змінити свої умови надання послуг, а також призначення та
              використання файлів cookies.
            </Typography>
          </section>
          <section className={classes.section}>
            <Typography
              variant="h2"
              gutterBottom
              align="center"
              className={classes.h2}
              id="how-to-manage-cookies"
            >
              ЯК ВИ МОЖЕТЕ КЕРУВАТИ ФАЙЛАМИ COOKIES НА ВАШОМУ ПРИСТРОЇ
            </Typography>
            <Typography gutterBottom className={classes.subtitle}>
              <strong>Видалення файлів cookies</strong>
            </Typography>
            <Typography paragraph>
              Ви можете видалити всі файли cookies, які вже є на вашому
              пристрої, очистивши історію перегляду браузера. Це видалить усі
              файли cookies з усіх веб-сайтів, які ви відвідували. Але майте на
              увазі, що ви також можете втратити деяку збережену інформацію
              (наприклад, збережені дані для входу, налаштування сайту).
            </Typography>
            <Typography gutterBottom className={classes.subtitle}>
              <strong>Керування файлами cookies для певних сайтів</strong>
            </Typography>
            <Typography paragraph>
              Для більш детального контролю над файлами cookies для певних
              сайтів перевірте налаштування конфіденційності та файлів cookies у
              вашому веб-переглядачі.
            </Typography>
            <Typography gutterBottom className={classes.subtitle}>
              <strong>Блокування файлів cookies</strong>
            </Typography>
            <Typography paragraph>
              Ви можете налаштувати більшість сучасних браузерів, щоб запобігти
              розміщенню файлів cookies на вашому пристрої, але тоді вам,
              можливо, доведеться вручну налаштовувати деякі параметри щоразу,
              коли ви відвідуєте сайт чи сторінку. Деякі служби та функції
              можуть взагалі не працювати належним чином (наприклад, вхід у
              профіль).
            </Typography>
          </section>
        </article>
      </Container>
    </Layout>
  )
}
