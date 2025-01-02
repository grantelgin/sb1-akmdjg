import { useState, useEffect } from 'react'
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Skeleton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Stack
} from '@mui/material'
import { supabase } from '../../utils/supabaseClient'
import { format, parseISO } from 'date-fns'
import TornadoIcon from '@mui/icons-material/Cyclone'
import HailIcon from '@mui/icons-material/AcUnit'
import WindIcon from '@mui/icons-material/Air'
import SearchIcon from '@mui/icons-material/Search'

interface StormReport {
  id: string
  report_date: string
  county: string
  state: string
  tornado_reports: TornadoReport[]
  hail_reports: HailReport[]
  wind_reports: WindReport[]
  map_image_url: string
}

interface TornadoReport {
  time: string
  f_scale: string
  location: string
  comments: string
}

interface HailReport {
  time: string
  size: string
  location: string
  comments: string
}

interface WindReport {
  time: string
  speed: string
  location: string
  comments: string
}

export default function StormReportsList() {
  const [reports, setReports] = useState<StormReport[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [countyFilter, setCountyFilter] = useState('all')
  const [uniqueCounties, setUniqueCounties] = useState<string[]>([])

  useEffect(() => {
    fetchStormReports()
  }, [])

  const fetchStormReports = async () => {
    try {
      const { data, error } = await supabase
        .from('storm_reports')
        .select('*')
        .order('report_date', { ascending: false })

      if (error) throw error

      setReports(data || [])
      // Extract unique counties
      const counties = [...new Set((data || []).map(r => `${r.county}, ${r.state}`))]
      setUniqueCounties(counties)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching storm reports:', error)
      setLoading(false)
    }
  }

  const filterReports = (reports: StormReport[]) => {
    return reports.filter(report => {
      const matchesSearch = 
        report.county.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.state.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDate = dateFilter === 'all' || 
        (dateFilter === 'month' && report.report_date.startsWith('2024-01')) ||
        (dateFilter === report.report_date)

      const matchesCounty = countyFilter === 'all' || 
        `${report.county}, ${report.state}` === countyFilter

      return matchesSearch && matchesDate && matchesCounty
    })
  }

  const groupReportsByDate = (reports: StormReport[]) => {
    const grouped = reports.reduce((acc, report) => {
      const date = report.report_date
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(report)
      return acc
    }, {} as Record<string, StormReport[]>)

    return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a))
  }

  const getAvailableDates = () => {
    return [...new Set(reports.map(r => r.report_date))].sort().reverse()
  }

  if (loading) {
    return (
      <Box p={3}>
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} key={i}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  const filteredReports = filterReports(reports)
  const groupedReports = groupReportsByDate(filteredReports)

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            label="Search Counties"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            fullWidth
            InputProps={{
              endAdornment: <SearchIcon color="action" />
            }}
          />
          <FormControl size="small" fullWidth>
            <InputLabel>Date Filter</InputLabel>
            <Select
              value={dateFilter}
              label="Date Filter"
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <MenuItem value="all">All Dates</MenuItem>
              <MenuItem value="month">January 2024</MenuItem>
              {getAvailableDates().map(date => (
                <MenuItem key={date} value={date}>
                  {format(parseISO(date), 'MMMM d, yyyy')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>County Filter</InputLabel>
            <Select
              value={countyFilter}
              label="County Filter"
              onChange={(e) => setCountyFilter(e.target.value)}
            >
              <MenuItem value="all">All Counties</MenuItem>
              {uniqueCounties.map(county => (
                <MenuItem key={county} value={county}>{county}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {groupedReports.map(([date, dateReports]) => (
        <Box key={date} mb={4}>
          <Typography variant="h5" gutterBottom sx={{ 
            borderBottom: '2px solid',
            borderColor: 'primary.main',
            pb: 1,
            mb: 2
          }}>
            {format(parseISO(date), 'MMMM d, yyyy')}
          </Typography>
          <Grid container spacing={3}>
            {dateReports.map((report) => (
              <Grid item xs={12} md={6} lg={4} key={report.id}>
                <Card>
                  <Box
                    sx={{
                      height: 200,
                      backgroundImage: `url(${report.map_image_url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {report.county}, {report.state}
                    </Typography>
                    <Box display="flex" gap={2}>
                      {report.tornado_reports.length > 0 && (
                        <Tooltip title={`${report.tornado_reports.length} Tornado Reports`}>
                          <Box display="flex" alignItems="center">
                            <TornadoIcon color="error" />
                            <Typography ml={0.5}>{report.tornado_reports.length}</Typography>
                          </Box>
                        </Tooltip>
                      )}
                      {report.hail_reports.length > 0 && (
                        <Tooltip title={`${report.hail_reports.length} Hail Reports`}>
                          <Box display="flex" alignItems="center">
                            <HailIcon color="info" />
                            <Typography ml={0.5}>{report.hail_reports.length}</Typography>
                          </Box>
                        </Tooltip>
                      )}
                      {report.wind_reports.length > 0 && (
                        <Tooltip title={`${report.wind_reports.length} Wind Reports`}>
                          <Box display="flex" alignItems="center">
                            <WindIcon color="warning" />
                            <Typography ml={0.5}>{report.wind_reports.length}</Typography>
                          </Box>
                        </Tooltip>
                      )}
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    {report.tornado_reports.map((tornado, i) => (
                      <Typography key={i} variant="body2" color="text.secondary">
                        {format(parseISO(tornado.time), 'h:mm a')} - F{tornado.f_scale} tornado {tornado.comments}
                      </Typography>
                    ))}
                    {report.hail_reports.map((hail, i) => (
                      <Typography key={i} variant="body2" color="text.secondary">
                        {format(parseISO(hail.time), 'h:mm a')} - {hail.size}" hail {hail.comments}
                      </Typography>
                    ))}
                    {report.wind_reports.map((wind, i) => (
                      <Typography key={i} variant="body2" color="text.secondary">
                        {format(parseISO(wind.time), 'h:mm a')} - {wind.speed}mph winds {wind.comments}
                      </Typography>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {groupedReports.length === 0 && (
        <Typography variant="h6" textAlign="center" color="text.secondary" mt={4}>
          No storm reports found matching your filters
        </Typography>
      )}
    </Box>
  )
} 