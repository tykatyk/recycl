import React from 'react'
import { Typography, Divider, makeStyles } from '@material-ui/core'
import Link from './Link.jsx'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    color: 'black',
    maxWidth: 150,
  },
  divider: {
    marginBottom: '0.35em',
  },
  link: {
    alignSelf: 'flex-start',
  },
}))

export default function MapInfoWindow(props) {
  const classes = useStyles()
  const { cityId, wasteTypeId, totalProposals, totalWeight } = props

  return (
    <div className={classes.root}>
      <Typography
        variant="body2"
        color="inherit"
      >{`Предложений: ${totalProposals}.`}</Typography>
      <Typography
        variant="body2"
        color="inherit"
        gutterBottom={true}
      >{`Общий вес: ${totalWeight} кг.`}</Typography>
      <Divider className={classes.divider} />
      <Link
        className={classes.link}
        href={`/applications?city=${cityId}&wasteType=${wasteTypeId}`}
      >
        Посмотреть
      </Link>
    </div>
  )
}
