import React from 'react'
import { styled } from '@mui/material/styles'
import { Typography, Box, Paper } from '@mui/material'
import Layout from './layouts/Layout'

const PREFIX = 'SupportUsPage'

const classes = {
  root: `${PREFIX}-root`,
  item: `${PREFIX}-item`,
  header: `${PREFIX}-header`,
}

const StyledLayout = styled(Layout)(({ theme }) => ({
  [`& .${classes.root}`]: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },

  [`& .${classes.item}`]: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    '& > :last-child': {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },

  [`& .${classes.header}`]: {
    marginBottom: theme.spacing(5),
  },
}))

export default function SupportUsPage() {
  const btcWallet = '6Le-cZ8dAAAAABgRwLZP_IVBeV8ZJueinte6rm5n'
  const ethWallet = '2lkadg9xlkj#laclk98255xkjagsdf'
  const card = '1234 5678 9112 3456'
  return (
    <StyledLayout title="Помочь проекту | Recycl">
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
    </StyledLayout>
  )
}
