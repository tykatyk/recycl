import { Typography, AccordionDetails, Box } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RedirectUnathenticatedUser from '../RedirectUnathenticatedUser'
import Layout from '../../layouts/Layout'
import ContactsForm from './ContactsForm'
import PhoneForm from './PhoneForm'
import ChangeEmailForm from './ChangeEmailForm'
import DeleteAccountComponent from './DeleteAccountComponent'
import { useId } from 'react'

const brand = process.env.NEXT_PUBLIC_BRAND || ''
const h1 = 'Настройки аккаунта'
const title = `${h1} | ${brand}`

export default function AllSettings() {
  const id = useId()
  return (
    <RedirectUnathenticatedUser>
      <Layout title={title}>
        <Box sx={{ width: '100%' }}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${id}-panel1-content`}
              id={`${id}-panel1-header`}
            >
              <Typography component="span">
                Изменить контактные данные
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ContactsForm />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${id}-panel2-content`}
              id={`${id}-panel2-header`}
            >
              <Typography component="span">Изменить номер телефона</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <PhoneForm />
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${id}-panel4-content`}
              id={`${id}-panel4-header`}
            >
              <Typography component="span">Изменить email-адрес</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ChangeEmailForm />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${id}-panel5-content`}
              id={`${id}-panel5-header`}
            >
              <Typography component="span">Удалить аккаунт</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <DeleteAccountComponent />
            </AccordionDetails>
          </Accordion>
        </Box>
      </Layout>
    </RedirectUnathenticatedUser>
  )
}
