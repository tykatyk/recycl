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
          aria-label="Предложения о вывозе отходов"
        >
          <Tab value="container" label="Контейнеры" {...a11yProps(0)} />
          <Tab value="mobile" label="Передвижные" {...a11yProps(1)} />
          <Tab value="stationery" label="Стационарные" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={'container'}>
        {children}
      </TabPanel>
      <TabPanel value={value} index={'mobile'}>
        {children}
      </TabPanel>
      <TabPanel value={value} index={'stationery'}>
        {children}
      </TabPanel>
    </Box>
  )
}
