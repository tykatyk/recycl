import React from 'react'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Fab,
  Paper,
  Grid,
  Divider,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'
import Layout from './layouts/Layout.jsx'
import clsx from 'clsx'
import { ViewColumnTwoTone } from '@material-ui/icons'

const useStyles = makeStyles({
  chatSection: {
    width: '100%',
  },

  dialog: {
    height: '70vh',
    overflowY: 'auto',
  },

  right: {
    justifyContent: 'flex-end',
    '& $message': {
      alignItems: 'flex-end',
    },
  },
  message: {
    maxWidth: '85%',
    alignItems: 'flex-start',
  },
  fromMe: { alignItems: 'flex-end' },
})

const Chat = () => {
  const classes = useStyles()

  return (
    <Layout title="Диалог с ... относительно ... | Recycl">
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs={12}>
          <List className={classes.dialog}>
            <ListItem key="1" className={clsx(classes.right)}>
              <Grid container direction="column" className={classes.message}>
                <Grid item>
                  <ListItemText primary="Sed ut perspiciatis unde omnis "></ListItemText>
                </Grid>
                <Grid item>
                  <ListItemText secondary="09:30"></ListItemText>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem key="2">
              <Grid
                container
                direction="column"
                className={clsx(classes.message)}
              >
                <Grid item>
                  <ListItemText primary="Hey, Iam Good! What about you ?"></ListItemText>
                </Grid>
                <Grid item>
                  <ListItemText secondary="09:31"></ListItemText>
                </Grid>
              </Grid>
            </ListItem>
          </List>
          <Divider />
          <Grid container style={{ alignItems: 'center', padding: '20px' }}>
            <Grid item xs={11}>
              <TextField
                id="outlined-basic-email"
                label="Напишите что-нибудь"
                fullWidth
                multiline
                variant="outlined"
                rows={4}
              />
            </Grid>
            <Grid item xs={1} align="right">
              <Fab color="primary" aria-label="add">
                <SendIcon />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default Chat
