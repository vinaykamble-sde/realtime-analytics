'use client';

import Grid from '@mui/material/Grid';
import { Paper, Typography, IconButton, Tooltip, Box } from '@mui/material';
import type { PaymentMetrics } from '@org/shared-types';
import { exportMetricsToCSV } from '../utils/export';
import { useMemo } from 'react';

export function MetricsGrid({ metrics }: { metrics: PaymentMetrics }) {
  // Memoize items to prevent unnecessary re-renders
  const items = useMemo(
    () => [
      { label: 'Total Volume', value: `₹${metrics.totalVolume}` },
      {
        label: 'Success Rate',
        value: `${Math.round(metrics.successRate * 100)}%`,
      },
      { label: 'Average Amount', value: `₹${metrics.averageAmount}` },
      { label: 'Top Method', value: metrics.topPaymentMethod },
      { label: 'Peak Hour', value: `${metrics.peakHour}:00` },
    ],
    [metrics]
  );

  const handleExport = () => {
    exportMetricsToCSV(metrics);
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: 1,
        }}
      >
        <Tooltip title="Export Metrics to CSV">
          <IconButton size="small" onClick={handleExport}>
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
        </Tooltip>
      </Box>
      <Grid container spacing={{ xs: 2, sm: 2, md: 2.5 }}>
      {items.map((item) => (
        <Grid
          key={item.label}
          size={{ xs: 6, sm: 4, md: 2.4 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.5, sm: 2 },
              height: '100%',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                display: 'block',
              }}
            >
              {item.label}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mt: 0.5,
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.125rem' },
              }}
            >
              {item.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
      </Grid>
    </Box>
  );
}

