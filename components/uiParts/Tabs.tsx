import * as React from 'react'
import { Tab, Tabs, Box } from '@mui/material'

interface TabPanelProps {
  children?: React.ReactNode
  index: string
  value: string
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
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
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
  value: string
  handleChange: (event: React.SyntheticEvent, newValue: string) => void
}

export default function AdTabs(props: AdTabProps) {
  const { children, value, handleChange } = props

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          sx={{
            '& .Mui-selected': {
              color: 'rgba(255, 255, 255, 0.9)',
            },
          }}
          textColor="primary"
          indicatorColor="secondary"
          value={value}
          onChange={handleChange}
          aria-label="Предложения о вывозе отходов"
        >
          <Tab value="active" label="Активные" {...a11yProps(0)} />
          <Tab value="inactive" label="Неактивные" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={'active'}>
        {children}
      </TabPanel>
      <TabPanel value={value} index={'inactive'}>
        {children}
      </TabPanel>
    </Box>
  )
}
