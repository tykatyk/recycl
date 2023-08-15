import React from 'react'
import { makeStyles, Typography, Container } from '@material-ui/core'
import Layout from './layouts/Layout'
import Link from './uiParts/Link'

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
  h3: {
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

export default function PrivacyPolicyPage() {
  const classes = useStyles()

  return (
    <Layout title="Политика приватности | Recycl">
      <Container className={classes.container}>
        <Typography
          variant="h1"
          align="center"
          className={classes.h1}
          id="privacy-policy"
        >
          ПОЛІТИКА КОНФІДЕНЦІЙНОСТІ
        </Typography>
        <article style={{ textAlign: 'justify' }}>
          <section className={classes.section}>
            <Typography
              variant="h2"
              gutterBottom
              align="center"
              className={classes.h2}
              id="general-terms"
            >
              1. ЗАГАЛЬНА ЧАСТИНА
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>1.1</span> Ця Політика описує
              встановлений порядок обробки персональних даних, зібраних на сайті{' '}
              <Link
                className={classes.link}
                href={`${process.env.NEXT_PUBLIC_URL}`}
              >{`${process.env.NEXT_PUBLIC_URL}`}</Link>
              , які дозволяють Користувачам реєструватися на Сайті, публікувати
              або переглядати опубліковані оголошення, та використовувати інші
              сервіси цього Сайту.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>1.2</span> Ми обробляємо
              персональні дані користувачів відповідно до Закону України «Про
              захист персональних даних» та з урахуванням принципів та правил
              Регламента General Data Protection Regulation (GDPR) Європейського
              Союзу. Ця Політика конфіденційності розроблена відповідно до
              положень цих документів.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>1.3</span> Власником та
              розпорядником бази персональних даних користувачів є компанія
              Recycl World Company (далі Компанія) зареєстрована за адресою:
              01234, Україна, м. Київ, бульвар Шевченка, буд. 34.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>1.4</span> Використовуючи Сайт,
              користувач надає свою згоду на обробку своїх персональних даних, а
              також дає свою згоду на передачу своїх персональних даних третім
              особам, в тому числі на передачу персональних даних за кордон, в
              будь-яку третю країну, в відповідності з цією Політикою
              конфіденційності та Угодою користувача.
            </Typography>
          </section>
          <section className={classes.section}>
            <Typography
              variant="h2"
              gutterBottom
              align="center"
              className={classes.h2}
              id="which-technologies-do-we-use"
            >
              2. ЯКІ ТЕХНОЛОГІЇ ВИКОРИСТОВУЮТЬСЯ ДЛЯ ЗБОРУ ДАНИХ
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>2.1</span> В процесі роботи
              Сайту Компанія може збирати інформацію за допомогою таких
              технологій як кукіс (куки, cookies), пікселі (pixels) та
              локального сховища в барузері.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>2.2</span> Кукіс (cookies) - це
              невеликі текстові файли, які зберігають інформацію безпосередньо
              на пристрої користувача.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>2.3</span> Пікселі (pixels) -
              невеликі цифрові зображення, які є частиною коду на веб-сторінках,
              які дозволяють іншому серверу вимірювати переглядання
              веб-сторінки, і часто використовуються в поєднанні з кукіс
              (cookies). Код відстежує як, коли і на якій сторінці піксель
              завантажений, щоб вказати, що користувач взаємодіє зі сторінкою
              або частиною сторінки Сайту.
            </Typography>
          </section>
          <section className={classes.section}>
            <Typography
              variant="h2"
              gutterBottom
              align="center"
              className={classes.h2}
              id="which-personal-info-can-be-gathered"
            >
              3. ЯКА ПЕРСОНАЛЬНА ІНФОРМАЦІЯ МОЖЕ ЗБИРАТИСЬ ТА ОБРОБЛЯТИСЬ
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.1</span> Інформація про
              реєстрацію: адреса електронної пошти, логін та пароль, ім’я,
              прізвище, по батькові (у разі наявності), паспортні дані,
              реєстраційний номер облікової картки-платника податків, дату
              народження та/або вік, стать, сімейний стан, інші контакті дані за
              бажанням Користувача (наприклад, місце та/або адреса роботи),
              фотографії, які Користувач може завантажувати у свій обліковий
              запис, дані уповноваженої особи компанії, найменування компанії,
              реквізити компанії, контактні телефони, адреса місцезнаходження
              компанії, інформація про веб-сайти Користувачів.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.2</span> Інформація, що
              доступна з профайлів Користувача у соціальних мережах та сторонніх
              служб аутентифікації: реєструючись на Сайті, або здійснюючи вхід
              на Сайт за допомогою сторонніх служб аутентифікації та соціальних
              мереж, Користувач надає Компанії згоду на збір та обробку
              інформації, що доступна із відповідних профайлів, а також на
              публікацію у відповідних соціальних мережах відомостей про дії
              Користувача на Сайті.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.3</span> Користувачі несуть
              відповідальність за всю інформацію, що розміщується ними на сайті
              та в загальнодоступних облікових записах соціальних мереж.
              Користувач повинен усвідомити всі ризики, пов'язані з тим, що він
              оприлюднює адресу або інформацію про точне місце свого
              розташування.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.4</span> Інформація в
              оголошеннях: в рамках діяльності цього Сайту, Компанія може
              розміщувати інформацію, в тому числі особистого і контактного
              характеру, необхідну для спілкування користувачів між собою.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.5</span> Інформація, що
              необхідна для реклами та просування: в процесі роботи Сайту
              Компанія може збирати особисту інформацію, щодо участі
              користувачів у маркетингових акціях, організованих на Сайті, або
              на сторонніх сайтах Компанією. Компанія може також обробляти
              інформацію пов'язану з ефективністю рекламних кампаній, в тому
              числі перегляди оголошень на Сайті, та на сайтах третіх осіб.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.6</span> Інформація, що
              необхідна для обслуговування користувачів: при зверненні до
              відділу обслуговування користувачів, Компанія, при необхідності,
              може збирати особисту інформацію, необхідну для виконання запиту
              Користувача і отримання зворотного зв'язку. Компанія може також
              зв'язатися з Користувачем, використовуючи існуючу контактну
              інформацію облікового запису, надану для цієї мети. Компанія може
              також збирати іншу інформацію про спілкування з Користувачами,
              наприклад, будь-які запити до служби підтримки, що подаються
              Користувачами, або будь-який зворотний зв'язок, що надається ними,
              зокрема, у формі відгуків, залишених Користувачами. Компанія може
              також обробляти відгуки в якості даних, що стосуються Користувача
              – автора відгуку, та Користувача, відносно якого було залишено
              відгук.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.7</span> Інформація веб-сайту
              : Компанія може автоматично отримувати і реєструвати на своїх
              серверах інформацію з браузера користувача або будь-якого
              пристрою, включаючи дані про пристрої Користувачів, IP-адресу,
              геолокацію Користувача, програмне забезпечення і апаратні
              атрибути, сторінки, які запитує Користувач, дані, які містяться в
              базах даних браузера, включаючи SQL бази даних, мобільні
              ідентифікатори (включаючи ідентифікатори мобільних пристроїв, такі
              як Google Advertisement ID, IFA or IFV), інформацію про
              використання додатків, та/або інформацію про інші використовувані
              пристрої, або інформацію системного рівня. Це може відбуватися на
              Сайті або на сервісах третіх осіб.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.8</span> Інформація, отримана
              в результаті опитувань: Компанія може збирати та зберігати
              інформацію, що отримана в результаті опитувань, які проводяться
              Компанією, або залученими підрядниками, - третіми особами, а саме
              інформацію щодо статі, віку, сімейного стану, особистих вподобань
              та ін.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.9</span> Інформація, що
              додається: Компанія може також додати інформацію, отриману на
              законних підставах від ділових партнерів або третіх сторін, до
              існуючих даних Компанії про своїх користувачів.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.10</span> Інформація про
              рейтинги та відгуки, які ви надаєте іншим користувачам після вашої
              взаємодії з ними, а також про рейтинги та відгуки, які ви
              отримуєте від інших користувачів. Ми робимо це для того, щоб
              виміряти задоволеність користувачів щодо досвіду транзакцій,
              забезпечення оптимального та ефективного рівня спілкування між
              користувачами, а також для перевірки та запобігання небажаній
              активності та поведінці в контексті діяльності, що здійснюється на
              Сайті. Ця інформація дозволяє нам вживати необхідних заходів для
              підтримання високих стандартів при наданні послуг.
            </Typography>
          </section>
          <section className={classes.section}>
            <Typography
              variant="h2"
              gutterBottom
              align="center"
              className={classes.h2}
              id="what-is-the-purpose-of-personal-information-gathering"
            >
              4. З ЯКОЮ МЕТОЮ ЗБИРАЄТЬСЯ ТА ОБРОБЛЯЄТЬСЯ ПЕРСОНАЛЬНА ІНФОРМАЦІЯ
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>4.1</span> Компанія може
              збирати та обробляти інформацію для:
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>4.1.1</span> забезпечення
              обслуговування користувачів, в тому числі для створення і
              управління обліковими записами, вирішення технічних труднощів і
              доступу до функцій Сайту;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>4.1.2</span> персоналізації
              пропозицій і досвіду, в тому числі реклами на своїх сервісах або
              сервісах третіх осіб;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>4.1.3</span> контролю
              активності користувачів, управління трафіком, та поліпшення
              сервісу на Сайті;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>4.1.4</span> зв'язку з
              користувачами, в тому числі з питань сервісу, обслуговування та
              дозволених маркетингових комунікацій через будь-які доступні
              канали зв'язку;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>4.1.5</span> забезпечення
              дотримання{' '}
              <Link href="/terms-of-service" className={classes.link}>
                Угоди користувача
              </Link>
              , недопущення шахрайства, образ та будь-яких інших неправомірних
              дій;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>4.1.6</span> аналізу та
              прогнозування особистих вподобань, інтересів, поведінки та
              місцезнаходження.
            </Typography>
          </section>
          <section className={classes.section}>
            <Typography
              variant="h2"
              gutterBottom
              align="center"
              className={classes.h2}
              id="what-is-term-of-personal-information-storage"
            >
              5. ЯКИЙ СТРОК ЗБЕРІГАННЯ ІНФОРМАЦІЇ
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>5.1</span> Компанія зберігає
              персональні дані користувачів настільки довго, наскільки це
              необхідно для досягнення цілей, заради яких вони були зібрані, в
              тому числі для виконання юридичних, бухгалтерських вимог, або
              вимог щодо звітності.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>5.2</span> Якщо у вашому
              обліковому записі не було активності більше 24 місяців, Компанія
              може видалити ваш обліковий запис, включаючи всі особисті дані, що
              в ньому зберігаються і ви більше не зможете отримати до нього
              доступ.
            </Typography>
          </section>
          <section className={classes.section}>
            <Typography
              variant="h2"
              gutterBottom
              align="center"
              className={classes.h2}
              id="protection-of-personal-information"
            >
              6. ЗАХИСТ ПЕРСОНАЛЬНИХ ДАНИХ
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>6.1</span> Ми застосовуємо усі
              наявні технічні, організаційні, правові засоби для забезпечення
              захисту Даних від неправомірного та/або несанкціонованого доступу,
              в тому числі від змін, видалення, надання, розповсюдження, а також
              інших неправомірних дій.
            </Typography>
          </section>
          <section className={classes.section}>
            <Typography
              variant="h2"
              gutterBottom
              align="center"
              className={classes.h2}
              id="passing-personal-info-to-third-parties"
            >
              7. ПЕРЕДАЧА ПЕРСОНАЛЬНОЇ ІНФОРМАЦІЇ ТРЕТІМ ОСОБАМ
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>7.1</span> Ми не надаємо
              особисту інформацію користувачів третім особам, за винятком
              випадків, коли на те є відповідний дозвіл користувача, або для:
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>7.1.1</span> надання послуг
              Компанії сторонніми постачальниками послуг. В таких випадках
              постачальники не мають повноважень використовувати отримані за
              допомогою Сайту персональні дані, інакше ніж для надання послуг
              Компанії, а самі персональні дані є предметом цієї Політики
              Конфіденційності.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>7.1.2</span> боротьби з
              шахрайством та зловживаннями на Сайті;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>7.1.3</span> розслідування
              передбачуваних порушень закону або недопущення випадків порушень
              Угоди користувача.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>7.2</span> Компанія може
              надавати персональні дані користувачів на запити компетентних
              органів, оформлених відповідно до вимог чинного законодавства, в
              тому числі відповідно до ст. 93 Кримінального процесуального
              кодексу України.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>7.3</span> Компанія може
              передавати певну знеособлену інформацію (дані, які не дозволяють
              ідентифікувати користувачів окремо) третім особам з метою кращого
              розуміння, яка реклама або послуги можуть зацікавити користувачів,
              поліпшення загальної якості та ефективності послуг на Сайті, або
              для забезпечення свого внеску в наукові дослідження, які, на думку
              Компанії, можуть приносити велику соціальну користь.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>7.4</span> У випадках передачі
              персональних даних третім особам, інформування Користувача про
              передачу його персональних даних залишається на розсуд Компанії.
            </Typography>
          </section>
          <section className={classes.section}>
            <Typography
              variant="h2"
              gutterBottom
              align="center"
              className={classes.h2}
              id="how-to-change-or-delete-personal-information"
            >
              8. ЯК ЗМІНИТИ АБО ВИДАЛИТИ ПЕРСОНАЛЬНІ ДАНІ
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>8.1</span> Розміщена інформація
              може бути змінена або видалена в особистому кабінеті користувача
              (пункт "Настройки") на веб-сторінці Сайту.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>8.2</span> Якщо Ваш обліковий
              запис був створений через провайдера ідентифікації (наприклад
              Google), Ви може відключити, або змінити дані облікового запису
              через налаштування ідентифікації провайдера (наприклад, на{' '}
              <Link
                href="https://myaccount.google.com/security"
                className={classes.link}
              >
                https://myaccount.google.com/security
              </Link>
              ).
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>8.3</span> Компанія може
              припинити обробку персональних даних Користувача у разі отримання
              письмового повідомлення про відкликання згоди на обробку
              персональних даних.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>8.4</span> Щоб видалити Ваші
              персональні дані, або у разі виникнення будь яких питань щодо
              персональних даних, будь ласка, надішліть запит із повідомленням
              про відкликання згоди на обробку персональних даних адміністрації
              Сайту через форму зворотного зв’язку, що розміщена за посиланням:{' '}
              <Link href="/contact-us" className={classes.link}>
                {`${process.env.NEXT_PUBLIC_URL}/contact-us`}
              </Link>
              , або направте запит за адресою Україна, м. Київ, бульвар
              Шевченка, буд. 34, 01234. Ми видалимо Ваші дані на протязі 30
              (тридцяти) календарних днів з дати отримання запиту.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>8.5</span> Для отримання більш
              детальної інформації щодо видалення персональних даних з певних
              зовнішніх служб, що діють на сайті, наприклад, Google Adwords будь
              ласка, відвідайте{' '}
              <Link
                href="http://www.networkadvertising.org"
                className={classes.link}
              >
                http://www.networkadvertising.org
              </Link>
              .
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>8.6</span> Для видалення файлів
              cookies із Вашого браузера, будь ласка зверніться до інструкції
              браузера.
            </Typography>
          </section>
          <section className={classes.section}>
            <Typography
              variant="h2"
              gutterBottom
              align="center"
              className={classes.h2}
              id="other-rights-regarding-personal-information"
            >
              9. ІНШІ ПРАВА КОРИСТУВАЧІВ ЩОДО ОБРОБКИ ЇХ ПЕРСОНАЛЬНИХ ДАНИХ
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>9.1</span> знати про
              місцезнаходження бази персональних даних, яка містить персональні
              дані користувачів, її призначення та найменування,
              місцезнаходження власника і розпорядників персональних даних, або
              дати відповідне доручення щодо отримання цієї інформації
              уповноваженими користувачами Сайту крім випадків, встановлених
              законом;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>9.2</span> отримувати
              інформацію про умови надання доступу до персональних даних,
              зокрема інформацію про третіх осіб, яким передаються персональні
              дані користувачів Сайту;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>9.3</span> доступ до своїх
              персональних даних;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>9.4</span> отримувати не
              пізніше як за тридцять календарних днів з дня надходження запиту,
              крім випадків, передбачених законом, відповідь про те,
              обробляються чи зберігаються його персональні дані, а також
              отримувати зміст таких персональних даних;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>9.5</span> пред'являти
              вмотивовану вимогу власнику персональних даних із запереченням
              проти обробки персональних даних;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>9.6</span> пред'являти
              вмотивовану вимогу щодо зміни або знищення персональних даних
              власником та/або розпорядником персональних даних, якщо ці дані
              обробляються незаконно чи є недостовірними;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>9.7</span> на захист
              персональних даних від незаконної обробки та випадкової втрати,
              знищення, пошкодження у зв'язку з умисним приховуванням,
              ненаданням чи несвоєчасним їх наданням, а також на захист від
              надання відомостей, що є недостовірними чи ганьблять честь,
              гідність та ділову репутацію;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>9.8</span> звертатися зі
              скаргами на обробку персональних даних до органів державної влади
              та посадових осіб, до повноважень яких належить забезпечення
              захисту персональних даних, або до суду;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>9.9</span> застосовувати засоби
              правового захисту в разі порушення законодавства про захист
              персональних даних;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>9.10</span> відкликати згоду на
              обробку персональних даних;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>9.11</span> знати механізм
              автоматичної обробки персональних даних;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>9.12</span> на захист від
              автоматизованого рішення, що має для користувачів Сайту правові
              наслідки.
            </Typography>
          </section>
          <section className={classes.section}>
            <Typography
              variant="h2"
              gutterBottom
              align="center"
              className={classes.h2}
              id="adding-changes-to-this-policy"
            >
              10. ВНЕСЕННЯ ЗМІН ДО ЦІЄЇ ПОЛІТИКИ
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>10.1</span> Компанія залишає за
              собою право оновлювати цю політику конфіденційності. Нова редакція
              Політики конфіденційності вступає в силу з моменту її розміщення в
              мережі Інтернет за вказаною в цьому пункті адресою, якщо інше не
              передбачено новою редакцією Політики конфіденційності. Чинна
              редакція Політики конфіденційності завжди знаходиться на сторінці
              за адресою{' '}
              <Link
                href={`${process.env.NEXT_PUBLIC_URL}privacy-policy`}
                className={classes.link}
              >{`${process.env.NEXT_PUBLIC_URL}/privacy-policy`}</Link>
              .
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>10.2</span> У разі якщо
              Компанією були внесені будь-які зміни в Політику Конфіденційності,
              з якими Користувач не згоден, він зобов'язаний припинити
              використання сервісів Сайту. Факт продовження використання Сайту є
              підтвердженням згоди і прийняття Користувачем відповідної редакції
              Політики Конфіденційності.
            </Typography>
          </section>
        </article>
      </Container>
    </Layout>
  )
}
