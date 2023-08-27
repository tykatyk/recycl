import React from 'react'
import { styled } from '@mui/material/styles'
import { Grid, Typography, Checkbox, Button } from '@mui/material'

const PREFIX = 'DialogsHeader'

const classes = {
  header: `${PREFIX}-header`,
}

const StyledGrid = styled(Grid)(({ theme }) => ({
  [`& .${classes.header}`]: {
    padding: theme.spacing(2),
  },
}))

export default function DialogsHeader(props) {
  const { handleDelete, checked, handleToggle } = props
  let headerContent = null

  if (checked) {
    headerContent = (
      <StyledGrid item xs={10} sm={11}>
        <Button onClick={handleDelete}>Удалить отмеченные</Button>
      </StyledGrid>
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
