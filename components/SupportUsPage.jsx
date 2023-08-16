import React from 'react'
import { makeStyles, Typography, Box, Paper } from '@material-ui/core'
import Layout from './layouts/Layout'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  item: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    '& > :last-child': {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
  header: {
    marginBottom: theme.spacing(5),
  },
}))

export default function SupportUsPage() {
  const classes = useStyles()
  const btcWallet = '6Le-cZ8dAAAAABgRwLZP_IVBeV8ZJueinte6rm5n'
  const ethWallet = '2lkadg9xlkj#laclk98255xkjagsdf'
  const card = '1234 5678 9112 3456'
  return (
    <Layout title="Помочь проекту | Recycl">
      <div className={classes.root}>
        <Typography variant="h6" className={classes.header} align="center">
          Если вы хотите помочь проекту, то можете сделать это одним из
          перечисленных ниже способов:
        </Typography>
        <Paper>
          <Box className={classes.item}>
            <Typography variant="body2" align="center">
              Банковская карта
            </Typography>
            <Typography align="center">{card}</Typography>
          </Box>
          <Box className={classes.item}>
            <Typography variant="body2" align="center">
              Bitcoin
            </Typography>
            <Typography align="center">{btcWallet}</Typography>
          </Box>
          <Box className={classes.item}>
            <Typography variant="body2" align="center">
              Etherum
            </Typography>
            <Typography align="center">{ethWallet}</Typography>
          </Box>
        </Paper>
      </div>
    </Layout>
  )
}
