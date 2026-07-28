import React from 'react'
import { styled } from '@mui/material/styles'
import { Typography, AccordionDetails } from '@mui/material'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RedirectUnathenticatedUser from '../RedirectUnathenticatedUser'
import Layout from '../../layouts/Layout'
import ContactsForm from './ContactsForm'
import PhoneForm from './PhoneForm'
import ChangePasswordForm from './ChangePasswordForm'
import ChangeEmailForm from './ChangeEmailForm'
import DeleteAccountForm from './DeleteAccountForm'

const PREFIX = 'AllSettings'

const classes = {
  root: `${PREFIX}-root`,
  root2: `${PREFIX}-root2`,
  expanded: `${PREFIX}-expanded`,
  root3: `${PREFIX}-root3`,
  heading: `${PREFIX}-heading`,
}

const StyledRedirectUnathenticatedUser = styled(RedirectUnathenticatedUser)(
  ({ theme }) => ({
    [`& .${classes.root3}`]: {
      width: '100%',
    },

    [`& .${classes.heading}`]: {
      fontSize: theme.typography.pxToRem(16),
      fontWeight: theme.typography.fontWeightRegular,
    },
  })
)

const Accordion = MuiAccordion

const AccordionSummary = MuiAccordionSummary

export default function AllSettings() {
  return (
    <StyledRedirectUnathenticatedUser>
      <Layout title="Recycl | Настройки">
        <div className={classes.root}>
          <Accordion
            classes={{
              root: classes.root,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              classes={{
                root: classes.root2,
                expanded: classes.expanded,
              }}
            >
              <Typography className={classes.heading}>
                Изменить контактные данные
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ContactsForm />
            </AccordionDetails>
          </Accordion>
          <Accordion
            className={classes.accordion}
            classes={{
              root: classes.root,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
              classes={{
                root: classes.root2,
                expanded: classes.expanded,
              }}
            >
              <Typography className={classes.heading}>
                Изменить номер телефона
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <PhoneForm />
            </AccordionDetails>
          </Accordion>
          <Accordion
            className={classes.accordion}
            classes={{
              root: classes.root,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
              id="panel3a-header"
              classes={{
                root: classes.root2,
                expanded: classes.expanded,
              }}
            >
              <Typography className={classes.heading}>
                Изменить пароль
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ChangePasswordForm />
            </AccordionDetails>
          </Accordion>
          <Accordion
            className={classes.accordion}
            classes={{
              root: classes.root,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4a-content"
              id="panel4a-header"
              classes={{
                root: classes.root2,
                expanded: classes.expanded,
              }}
            >
              <Typography className={classes.heading}>
                Изменить email-адрес
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ChangeEmailForm />
            </AccordionDetails>
          </Accordion>
          <Accordion
            className={classes.accordion}
            classes={{
              root: classes.root,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4a-content"
              id="panel4a-header"
              classes={{
                root: classes.root2,
                expanded: classes.expanded,
              }}
            >
              <Typography className={classes.heading}>
                Удалить аккаунт
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <DeleteAccountForm />
            </AccordionDetails>
          </Accordion>
        </div>
      </Layout>
    </StyledRedirectUnathenticatedUser>
  )
}
