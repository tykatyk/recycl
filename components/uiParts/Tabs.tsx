import * as React from 'react'
import { Tab, Tabs, Box } from '@material-ui/core'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  }
}

interface AdTabProps {
  children: React.ReactNode
  value: number
  handleChange: (event: React.SyntheticEvent, newValue: number) => void
}

export default function AdTabs(props: AdTabProps) {
  const { children, value, handleChange } = props

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Предложения о вывозе отходов"
        >
          <Tab label="Активные" {...a11yProps(0)} />
          <Tab label="Неактивные" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {children}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {children}
      </TabPanel>
    </Box>
  )
}
