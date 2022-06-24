import React from 'react'
import { makeStyles, Typography, Container, Button } from '@material-ui/core'
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

export default function InformationPlacementRulesPage() {
  const classes = useStyles()

  return (
    <Layout title="Правила размещения информации | Recycl">
      <Container className={classes.container}>
        <Typography
          variant="h1"
          align="center"
          className={classes.h1}
          id="information-placement-rules"
        >
          ПРАВИЛА РОЗМІЩЕННЯ ІНФОРМАЦІЇ НА САЙТІ RECYCL.COM
        </Typography>
        <article style={{ textAlign: 'justify' }}>
          <section className={classes.section}>
            <Typography
              variant="h2"
              gutterBottom
              align="center"
              className={classes.h2}
              id="general-demands"
            >
              1. ЗАГАЛЬНІ ВИМОГИ
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>1.1</span> Публікація
              інформації (Контенту) повинна здійснюватися у повній відповідності
              до вимог чинного законодавства України, Угоди користувача та цих
              Правил.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>1.2</span> Користувач гарантує,
              що:
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>1.2.1</span> відходи,
              інформація про які публікується в Оголошенні, є вільними від
              претензій третіх осіб та є власністю такого Користувача або він
              має право ними розпоряджатись;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>1.2.2</span> пункти
              прийому/збору Відходів, інформація про які публікується в
              Оголошенні, є власністю Користувача та/або діють від імені чи в
              інтересах Користувача;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>1.2.3</span> має право
              публікувати інформацію про такі Відходи та/або пункти
              прийому/збору таких Відходів.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>1.3</span> Розміщуючи
              інформацію про Сировину, що підлягає обов'язковій сертифікації в
              Україні, або про види діяльності, що підлягають ліцензуванню,
              Користувач несе відповідальність за наявність у нього дозвільних
              документів.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>1.4</span> У разі обґрунтованих
              підозр в тому, що Оголошення по своїй суті містить інформацію про
              заборонені товари або спонукає до незаконної діяльності,
              Адміністрація сайту має право заблокувати доступ до такої
              інформації без попередження.
            </Typography>
          </section>
          <section className={classes.section}>
            <Typography
              variant="h2"
              gutterBottom
              align="center"
              className={classes.h2}
              id="information-submission"
            >
              2. ПОДАЧА ІНФОРМАЦІЇ
            </Typography>
            <Typography gutterBottom>
              <span className={classes.subtitle}>2.1.1</span> Адміністрація має
              право не публікувати Оголошення у разі, якщо:
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>2.1.2</span> в інформації
              містяться посилання на зовнішні сайти, за винятком посилань на
              відеоогляди;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>2.1.3</span> в інформації
              містяться будь-які елементи (код), які змінюють зовнішній вигляд
              сторінки товару/послуги та/або управляють поведінкою браузерів
              інших користувачів;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>2.1.4</span> в тексті
              використовуються слова, набрані ВЕЛИКИМИ літерами (за винятком
              абревіатур) або тексти, в яких використовується розрядка
              (написання слів із пробілами між буквами);
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>2.1.5</span> в тексті є безліч
              граматичних, пунктуаційних або синтаксичних помилок або опис на
              трансліті;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>2.1.6</span> оформлення
              Оголошень вводить покупця в оману (наявність та місце розташування
              Відходів чи пунктів прийому/збору Відходів неактуальні; зображення
              та опис Відходів не відповідають дійсності; інформація містить
              суб'єктивну думку чи аргументи без підстави тощо).
            </Typography>
          </section>
          <section className={classes.section}>
            <Typography
              variant="h2"
              gutterBottom
              align="center"
              className={classes.h2}
              id="content-of-information"
            >
              3. ЗМІСТ ІНФОРМАЦІЇ
            </Typography>
            <Typography gutterBottom>
              <span className={classes.subtitle}>3.1</span> Адміністрація має
              право повністю або частково обмежити доступ до інформації у разі,
              якщо вона містить:
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.1.1</span> дані інших
              Користувачів, конфіденційну інформацію про фізичних осіб (їх
              персональні дані), а також матеріали, що містять державну,
              банківську таємницю;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.1.2</span> інформацію, яка не
              відповідає тематиці Сайту і не пов'язана з веденням господарської
              діяльності, а також про діяльність громадських організацій,
              благодійність тощо;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.1.3</span> інформацію, що
              порушує права інтелектуальної власності третіх осіб (авторське
              право, права на знаки для товарів і послуг, патентне право,
              комерційну таємницю тощо), в тому числі використання торгових
              марок, зображень, текстів та іншої інформації без згоди власника
              авторських прав (автора);
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.1.4</span> інформацію, що
              порушує особисті (немайнові) права, у т.ч. що містять відомості,
              які посягають на недоторканність приватного життя, або ображають
              честь, гідність чи ділову репутацію, фізичних або юридичних осіб;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.1.5</span> матеріали, які
              містять необґрунтовані звинувачення на адресу людини або компанії,
              а також наклеп або загрози;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.1.6</span> ненормативну
              лексику, вульгарні та образливі вирази;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.1.7</span> заклики до
              страйку, протесту, до насильства та протиправних дій, пропаганду
              ненависті, насильства, дискримінації, расизму, ксенофобії,
              міжнаціональних конфліктів;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.1.8</span> інформацію, яка
              містить елементи жорстокості, насильства, порнографії, цинізму,
              приниження людської честі та гідності;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.1.9</span> інформацію,
              спрямовану на надання послуг сексуального характеру (в тому числі,
              але не обмежуючись, стриптизу, еротичного масажу тощо) і торгівлю
              людьми;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.1.10</span> зображення:
              частково або повністю оголених інтимних частин тіла людини, а
              також зображення чоловіків/жінок, які демонструють застосування
              товарів 18+. Зображення товарів 18+, які мають схожість з
              інтимними частинами тіла людини повинні бути заретушованими.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.1.11</span> словесний опис
              інтимних частин тіла у вульгарній формі, опис або зображення
              сексуальних відносин;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.1.12</span> інформацію про
              способи шахрайства, обману, зловживання довірою, а також про
              способи порушення або обходу чинного законодавства;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.1.13</span> інформацію, що
              являє собою незаконні комерційні пропозиції (спам-розсилки);
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.1.14</span> інформація про
              разові заходи;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.1.15</span> недобросовісну,
              недостовірну, неетичну інформацію, приховану рекламу, а також
              інформацію, яка завдає шкоди діловій репутації конкурентів
              Користувача;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.1.16</span> відомості про те,
              що Користувач здійснює маніпуляції з налаштуваннями Сайту і
              оформленням Оголошень, а також інші дії, спрямовані на уникнення
              зняття плати за використання Сервісів;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.1.17</span> інформацію, що
              пропагує: війну, національну та релігійну ворожнечу, зміну шляхом
              насильства конституційного ладу або територіальної цілісності
              України, фашизм та неофашизм, принижує або ображає націю чи
              особистість за національною ознакою; інформацію, що містить
              виправдовування, визнання правомірною, заперечення збройної
              агресії Російської Федерації проти України, у тому числі шляхом
              представлення збройної агресії Російської Федерації проти України
              як внутрішнього конфлікту, громадянського конфлікту, громадянської
              війни, заперечення тимчасової окупації частини території України;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.1.18</span> інформацію, що
              глорифікує: символіку, що використовується (лась) під час збройної
              агресії Російської Федерації проти України; осіб, які здійснювали
              збройну агресію Російської Федерації проти України, представників
              збройних формувань Російської Федерації, іррегулярних незаконних
              збройних формувань, озброєних банд та груп найманців, створених,
              підпорядкованих, керованих та фінансованих Російською Федерацією,
              а також представників окупаційної адміністрації Російської
              Федерації, яку складають її державні органи та інші структури,
              функціонально відповідальні за управління тимчасово окупованими
              територіями України, та представників підконтрольних Російській
              Федерації самопроголошених органів, які узурпували виконання
              владних функцій на тимчасово окупованих територіях України, у тому
              числі шляхом їх визначення як "повстанці", "ополченці", "ввічливі
              військові люди" тощо;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.1.19</span> інформацію, що
              містить зображення осіб та/або є результатом творчої та іншої
              діяльності осіб, які виправдовують, визнають правомірною,
              підтримують або заперечують збройну агресію Російської Федерації
              проти України.
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>3.1.20</span> будь-яку іншу
              інформацію, яка порушує законодавство України і ці Правила.
            </Typography>
          </section>
          <section className={classes.section}>
            <Typography
              variant="h2"
              gutterBottom
              align="center"
              className={classes.h2}
              id="content-of-information"
            >
              4. НАЗВА КОМПАНІЇ
            </Typography>
            <Typography gutterBottom>
              <span className={classes.subtitle}>4.1</span> Назва компанії не
              повинна:
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>4.1.1</span> містити посилання
              на сторонні сайти, телефонний номер, назву торгової марки чи
              бренду, якщо права на дану ТМ не належать Користувачу;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>4.1.2</span> складатись тільки
              з імені фізичної особи;
            </Typography>
            <Typography paragraph>
              <span className={classes.subtitle}>4.1.3</span> вводити
              Користувачів в оману;
            </Typography>
          </section>
        </article>
      </Container>
    </Layout>
  )
}
