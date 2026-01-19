'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import {
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Typography,
  Box,
  IconButton,
  Tooltip as MuiTooltip,
  Dialog,
  DialogContent,
} from '@mui/material';
import { useState, useMemo } from 'react';
import { useGetTrendsQuery } from '../store/analytics.api';
import { exportTrendsToCSV } from '../utils/export';

export function TrendChart() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [fullscreen, setFullscreen] = useState(false);

  const { data } = useGetTrendsQuery({ period });

  // Memoize chart data
  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map((item) => ({
      ...item,
      timestamp: new Date(item.timestamp).toLocaleString(),
    }));
  }, [data]);

  const handleExport = () => {
    if (data) {
      exportTrendsToCSV(data, period);
    }
  };

  const chartContent = (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1.5,
        }}
      >
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
          }}
        >
          Payment Trends
        </Typography>
        <Box>
          {data && data.length > 0 && (
            <MuiTooltip title="Export to CSV">
              <IconButton
                size="small"
                onClick={handleExport}
                sx={{ mr: 0.5 }}
              >
                <Box
                  component="span"
                  sx={{
                    fontSize: '0.875rem',
                    lineHeight: 1,
                  }}
                >
                  ⬇
                </Box>
              </IconButton>
            </MuiTooltip>
          )}
          <MuiTooltip title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
            <IconButton
              size="small"
              onClick={() => setFullscreen(!fullscreen)}
            >
              <Box
                component="span"
                sx={{
                  fontSize: '0.875rem',
                  lineHeight: 1,
                }}
              >
                {fullscreen ? '⤓' : '⤢'}
              </Box>
            </IconButton>
          </MuiTooltip>
        </Box>
      </Box>

      <ToggleButtonGroup
        size="small"
        value={period}
        exclusive
        onChange={(_, value) => value && setPeriod(value)}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="day">Day</ToggleButton>
        <ToggleButton value="week">Week</ToggleButton>
        <ToggleButton value="month">Month</ToggleButton>
      </ToggleButtonGroup>

      {chartData && chartData.length > 0 && (
        <Box
          sx={{
            width: '100%',
            height: fullscreen ? 'calc(100vh - 200px)' : 280,
            flex: 1,
          }}
        >
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                dataKey="amount"
                stroke="#c97d60"
                dot={false}
                strokeWidth={2}
                name="Volume"
              />
              <Line
                dataKey="successRate"
                stroke="#6b8e6b"
                dot={false}
                strokeWidth={2}
                name="Success Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </>
  );

  if (fullscreen) {
    return (
      <Dialog
        open={fullscreen}
        onClose={() => setFullscreen(false)}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            m: 2,
            height: 'calc(100vh - 32px)',
            maxHeight: 'calc(100vh - 32px)',
          },
        }}
      >
        <DialogContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {chartContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {chartContent}
    </Paper>
  );
}

