import { Typography, AccordionDetails, Box } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RedirectUnauthenticatedUser from '../../../components/uiParts/RedirectUnauthenticatedUser'
import Layout from '../../../components/layouts/Layout'
import ContactsForm from '../../../components/uiParts/userSettings/ContactsForm'
import PhoneForm from '../../../components/uiParts/userSettings/PhoneForm'
import ChangeEmailForm from '../../../components/uiParts/userSettings/ChangeEmailForm'
import DeleteAccountComponent from '../../../components/uiParts/userSettings/DeleteAccountComponent'
import { useId } from 'react'
import Head from 'next/head'
import { useTranslations } from 'next-intl'

const brand = process.env.NEXT_PUBLIC_BRAND || ''

export default function AccountSettings() {
  const t = useTranslations('AccountSettings')
  const id = useId()

  return (
    <RedirectUnauthenticatedUser>
      <Head>
        <title>{`${t('title')} | ${brand}`}</title>
        <meta name="robots" content="noindex, nofollow"></meta>
      </Head>
      <Layout>
        <Box sx={{ width: '100%' }}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${id}-panel1-content`}
              id={`${id}-panel1-header`}
            >
              <Typography component="span">{t('changeContactData')}</Typography>
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
              <Typography component="span">{t('changePhone')}</Typography>
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
              <Typography component="span">{t('changeEmail')}</Typography>
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
              <Typography component="span">{t('deleteAccount')}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <DeleteAccountComponent />
            </AccordionDetails>
          </Accordion>
        </Box>
      </Layout>
    </RedirectUnauthenticatedUser>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  }
}
