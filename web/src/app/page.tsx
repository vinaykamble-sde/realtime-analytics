'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';

import {
  useGetMetricsQuery,
  analyticsApi,
} from '../store/analytics.api';

import { MetricsGrid } from '../components/MetricsGrid';
import { TrendChart } from '../components/TrendChart';
import { EventsFeed } from '../components/EventsFeed';
import {
  detectFailureSpike,
  detectVolumeSpike,
  detectLowSuccessRate,
  type Alert as AlertType,
} from '../utils/alerts';

export default function Page() {
  const dispatch = useDispatch();
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<AlertType | null>(null);
  const eventsRef = useRef<any[]>([]);
  const previousMetricsRef = useRef<any>(null);

  // RTK Query – Metrics (single source of truth)
  const {
    data: metrics,
    isLoading,
    isError,
  } = useGetMetricsQuery();

  // WebSocket → invalidate RTK Query cache and collect events
  useEffect(() => {
    const socket: Socket = io('http://localhost:3000/payments', {
      transports: ['websocket'],
    });

    socket.on('payment-event', (event) => {
      eventsRef.current = [...eventsRef.current.slice(-20), event];
    });

    socket.on('metrics-update', () => {
      dispatch(
        analyticsApi.util.invalidateTags(['Metrics', 'Trends'])
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  // Alert detection
  useEffect(() => {
    if (!metrics || eventsRef.current.length < 5) return;

    const newAlerts: AlertType[] = [];

    // Failure spike detection
    const failureAlert = detectFailureSpike(eventsRef.current, {
      failureRateThreshold: 0.2,
      volumeThreshold: 10,
      spikeMultiplier: 2,
    });
    if (failureAlert) newAlerts.push(failureAlert);

    // Volume spike detection
    if (previousMetricsRef.current) {
      const volumeAlert = detectVolumeSpike(
        metrics.totalVolume,
        previousMetricsRef.current.totalVolume,
        {
          failureRateThreshold: 0.2,
          volumeThreshold: 1000,
          spikeMultiplier: 1.5,
        }
      );
      if (volumeAlert) newAlerts.push(volumeAlert);
    }

    // Low success rate detection
    const successRateAlert = detectLowSuccessRate(metrics.successRate, 0.8);
    if (successRateAlert) newAlerts.push(successRateAlert);

    if (newAlerts.length > 0) {
      setAlerts((prev) => [...prev, ...newAlerts]);
      setCurrentAlert(newAlerts[0]);
      setSnackbarOpen(true);
    }

    previousMetricsRef.current = metrics;
  }, [metrics]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    if (alerts.length > 1) {
      setCurrentAlert(alerts[1]);
      setAlerts((prev) => prev.slice(1));
      setTimeout(() => setSnackbarOpen(true), 300);
    } else {
      setCurrentAlert(null);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !metrics) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography color="error">Failed to load metrics.</Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
        <Typography variant="h1" component="h1" sx={{ mb: 0.5 }}>
          Payment Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time insights and trends
        </Typography>
      </Box>

      {/* Metrics Grid */}
      <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
        <MetricsGrid metrics={metrics} />
      </Box>

      {/* Trend Chart and Events Feed - Responsive Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '1fr 1fr',
          },
          gap: { xs: 3, sm: 4, md: 5 },
        }}
      >
        <Box>
          <TrendChart />
        </Box>

        <Box>
          <EventsFeed />
        </Box>
      </Box>

      {/* Toast Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={currentAlert?.severity || 'info'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {currentAlert?.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
