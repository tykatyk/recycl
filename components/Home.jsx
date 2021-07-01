import React from 'react'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography'
import Header from './Header.jsx'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700]
  },
  card: {
    height: "25em"
  },
  content: {
    padding: theme.spacing(8, 0, 6)
  }
}))

const tiers = [
  {
    title: "Для сборщиков и переработчиков",
    description: [
      "Находите новых поставщиков/клиентов",
      "Находите отходы, мониторя заявки на вывоз",
      "Расширяйте номенклатуру поставок продавая продукцию/сырье заинтересованным партнерам",
      "Экономьте на логистике"
    ]
  },
  {
    title: "Для бизнеса и общественности",
    description: [
      "Находите места приема отходов",
      "Подавайте заявки на вывоз и участие в сортировке",
      "Привлекайте новых клиентов, устанавливая места для раздельного сбора и гарантированно избавляйтесь от отходов",
      "Экономьте на утилизации, сдавая отходы тем, кому они нужны"
    ]
  }
]

export default function Home() {
  const classes = useStyles()
  return (
    <React.Fragment>
    <Header />
    <Container maxWidth="md" component="main" className={classes.content}>
      <Grid container spacing={5} alignItems="flex-end">
        {tiers.map((tier) => (
          <Grid item key={tier.title} xs={12} md={6}>
            <Card className={classes.card}>
              <CardHeader
                title={tier.title}
                titleTypographyProps={{ align: 'center' }}
                className={classes.cardHeader}
              />
              <CardContent>
                <ul>
                  {tier.description.map((line) => (
                    <Typography component="li" variant="subtitle1" align="center" key={line}>
                      {line}
                    </Typography>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
    </React.Fragment>

  )
}
