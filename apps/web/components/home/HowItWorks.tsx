import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'

export default function HowItWorks() {
  return (
    <Timeline position="alternate">
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          Пользователи размещают объявления о наличии у них вторсырья, которое
          они хотят сдать на переработку/утилизацию.
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          Приемщики вторсырья видят эти объявления на карте.
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          Приемщики вторсырья добавляют информацию о передвижном пункте приема
          вторсырья в регионе, в котором они работают, указывая дату и место
          приема.
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          Пользователи, разместившие объявления, получают уведомления о
          появлении в их регионе пункта приема вторсырья, которое они хотят
          сдать на переработку.
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
        </TimelineSeparator>
        <TimelineContent>
          В указанную дату пользователи сдают вторсырье на переработку или
          утилизацию.
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}
