import * as React from 'react'
import { Tab, Tabs, Box } from '@mui/material'
import { documentActivityStatus } from '@recycl/shared/dist/constants'

interface TabPanelProps {
  children?: React.ReactNode
  index: string
  value: keyof typeof documentActivityStatus
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
  value: keyof typeof documentActivityStatus
  handleChange: (
    event: React.SyntheticEvent,
    newValue: keyof typeof documentActivityStatus,
  ) => void
}

export default function AdTabs(props: AdTabProps) {
  const { children, value, handleChange } = props

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Tabs
          sx={{
            '& .MuiButtonBase-root.MuiTab-root.Mui-selected': {
              color: 'rgba(255, 255, 255, 0.9)',
            },
          }}
          textColor="primary"
          indicatorColor="secondary"
          value={value}
          onChange={handleChange}
          aria-label="Мои объявления о наличии вторсырья"
        >
          <Tab value="active" label="Активные" {...a11yProps(0)} />
          <Tab value="disabled" label="Неактивные" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={'active'}>
        {children}
      </TabPanel>
      <TabPanel value={value} index={'disabled'}>
        {children}
      </TabPanel>
    </Box>
  )
}
