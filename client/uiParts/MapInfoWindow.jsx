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
  const { totalProposals, totalWeight, city, wasteType } = props

  return (
    <div className={classes.root}>
      <Typography
        variant="body2"
        color="inherit"
        gutterBottom={true}
      >{`Найдено ${totalProposals} предложений общим весом ${totalWeight} кг.`}</Typography>
      <Divider className={classes.divider} />
      <Link
        className={classes.link}
        href={`/applications?city=${city}&wasteType=${wasteType}`}
      >
        Посмотреть
      </Link>
    </div>
  )
}
