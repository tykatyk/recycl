import React from 'react'
import {
  Typography,
  AccordionDetails,
  makeStyles,
  withStyles,
} from '@material-ui/core'
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Layout from '../../layouts/Layout.jsx'
import ContactsForm from './ContactsForm.jsx'
import PhoneForm from './PhoneForm.jsx'
import ChangePasswordForm from './ChangePasswordForm.jsx'
import ChangeEmailForm from './ChangeEmailForm.jsx'

const Accordion = withStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(3),
    '&:before': {
      display: 'none',
    },
  },
}))(MuiAccordion)

const AccordionSummary = withStyles((theme) => ({
  root: {
    '&$expanded': {
      borderBottom: '1px solid rgba(0, 0, 0, .125)',
    },
  },
  expanded: {},
}))(MuiAccordionSummary)

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: theme.typography.fontWeightRegular,
  },
}))

export default function SimpleAccordion() {
  const classes = useStyles()

  return (
    <Layout title="Recycl | Настройки">
      <div className={classes.root}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>
              Изменить контактные данные
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ContactsForm />
          </AccordionDetails>
        </Accordion>
        <Accordion className={classes.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography className={classes.heading}>
              Изменить номер телефона
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <PhoneForm />
          </AccordionDetails>
        </Accordion>
        <Accordion className={classes.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography className={classes.heading}>Изменить пароль</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ChangePasswordForm />
          </AccordionDetails>
        </Accordion>
        <Accordion className={classes.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4a-content"
            id="panel4a-header"
          >
            <Typography className={classes.heading}>
              Изменить email-адрес
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ChangeEmailForm />
          </AccordionDetails>
        </Accordion>
        <Accordion className={classes.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4a-content"
            id="panel4a-header"
          >
            <Typography className={classes.heading}>
              Удалить учетную запись
            </Typography>
          </AccordionSummary>
        </Accordion>
      </div>
    </Layout>
  )
}
