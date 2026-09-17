import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import { useTranslations } from 'next-intl'
import { Typography } from '@mui/material'

export default function HowItWorks({
  variant,
}: {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}) {
  const t = useTranslations('HomePage.howItWorks')

  return (
    <>
      <Typography
        component={'h2'}
        variant={variant}
        align="center"
        sx={{ mt: 1, mb: 6 }}
      >
        {t('h2')}
      </Typography>
      <Timeline position="alternate">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>{t('addAds')}</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>{t('seeAds')}</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>{t('addCollectionPoints')}</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>{t('receiveNotifications')}</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
          </TimelineSeparator>
          <TimelineContent>{t('passWaste')}</TimelineContent>
        </TimelineItem>
      </Timeline>
    </>
  )
}
