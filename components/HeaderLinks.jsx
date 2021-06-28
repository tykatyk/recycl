import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  links: {
    '& > * + *': {
      marginLeft: theme.spacing(2),
    }
  }
}));

export default function HeaderLinks() {
  const preventDefault = (event) => event.preventDefault()
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography component='div' align="right" className={classes.links}>
          <Link href="#" onClick={preventDefault} color="inherit">
            Recyclers
          </Link>
          <Link href="#" onClick={preventDefault} color="inherit">
            Collectors
          </Link>
      </Typography>
    </div>
  )
}
