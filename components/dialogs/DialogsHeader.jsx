import React from 'react'
import {
  Grid,
  Typography,
  Checkbox,
  Button,
  makeStyles,
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  header: {
    padding: theme.spacing(2),
  },
}))

export default function DialogsHeader(props) {
  const classes = useStyles()

  const { handleDelete, checked, handleToggle } = props
  let headerContent = null

  if (checked) {
    headerContent = (
      <Grid item xs={10} sm={11}>
        <Button onClick={handleDelete}>Удалить отмеченные</Button>
      </Grid>
    )
  } else {
    headerContent = (
      <>
        <Grid item xs={2}>
          <Typography variant="body2" color="textSecondary" noWrap>
            Пользователь
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body2" color="textSecondary" noWrap>
            Сообщение
          </Typography>
        </Grid>
      </>
    )
  }

  return (
    <Grid className={classes.header} alignItems="center" container item xs={12}>
      <Grid item xs={2} sm={1}>
        <Checkbox checked={checked} onChange={handleToggle} />
      </Grid>
      {headerContent}
    </Grid>
  )
}
