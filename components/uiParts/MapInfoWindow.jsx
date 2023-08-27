import React from 'react'
import { styled } from '@mui/material/styles'
import { Typography, Divider } from '@mui/material'
import Link from './Link'

const PREFIX = 'MapInfoWindow'

const classes = {
  root: `${PREFIX}-root`,
  link: `${PREFIX}-link`,
}

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: 'flex',
    flexDirection: 'column',
    color: 'black',
    maxWidth: 150,
  },

  [`& .${classes.link}`]: {
    alignSelf: 'flex-start',
  },
}))

export default function MapInfoWindow(props) {
  const { cityId, wasteTypeId, totalProposals, totalWeight } = props

  return (
    <Root className={classes.root}>
      <Typography
        variant="body2"
        color="inherit"
      >{`Предложений: ${totalProposals}.`}</Typography>
      <Typography
        variant="body2"
        color="inherit"
        gutterBottom={true}
      >{`Общий вес: ${totalWeight} кг.`}</Typography>
      <Link
        className={classes.link}
        href={`/applications?city=${cityId}&wasteType=${wasteTypeId}`}
      >
        Посмотреть
      </Link>
    </Root>
  )
}
