'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Paper,
  Typography,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Box,
} from '@mui/material';
import { EventDetailModal } from './EventDetailModal';
import { exportEventsToCSV } from '../utils/export';

// Throttle function for performance
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

const WS_BASE =
  process.env.NEXT_PUBLIC_WS_BASE ?? 'http://localhost:3000/payments';

export function EventsFeed() {
  const [events, setEvents] = useState<any[]>([]);
  const [paused, setPaused] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const eventBufferRef = useRef<any[]>([]);

  // Throttled update function
  const throttledUpdate = useMemo(
    () =>
      throttle(() => {
        if (eventBufferRef.current.length > 0) {
          setEvents((prev) => [
            ...prev.slice(-50),
            ...eventBufferRef.current,
          ]);
          eventBufferRef.current = [];
        }
      }, 100),
    []
  );

  useEffect(() => {
    const socket: Socket = io(WS_BASE, {
      transports: ['websocket'],
    });

    socket.on('payment-event', (event) => {
      eventBufferRef.current.push(event);
      throttledUpdate();
    });

    return () => {
      socket.disconnect();
    };
  }, [throttledUpdate]);

  useEffect(() => {
    if (!paused && containerRef.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight;
    }
  }, [events, paused]);

  const handleEventClick = useCallback((event: any) => {
    setSelectedEvent(event);
    setModalOpen(true);
  }, []);

  const handleExport = useCallback(() => {
    exportEventsToCSV(events);
  }, [events]);

  // Memoized event items
  const eventItems = useMemo(
    () =>
      events.map((e, i) => (
        <Typography
          key={`${e.timestamp || i}-${i}`}
          variant="caption"
          onClick={() => handleEventClick(e)}
          sx={{
            fontFamily: 'monospace',
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            color: e.type?.includes('failed')
              ? 'error.main'
              : e.type?.includes('success')
              ? 'success.main'
              : 'warning.main',
            py: 0.5,
            px: 1,
            borderRadius: 1,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          {e.type} — ₹{e.payment?.amount || 0}
        </Typography>
      )),
    [events, handleEventClick]
  );

  return (
    <Paper
      elevation={0}
      ref={containerRef}
      sx={{
        p: { xs: 1.5, sm: 2 },
        height: { xs: 280, sm: 320 },
        overflow: 'auto',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1.5 }}
      >
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
        >
          Live Payments
        </Typography>

        <Stack direction="row" spacing={0.5} alignItems="center">
          {events.length > 0 && (
            <Tooltip title="Export to CSV">
              <IconButton
                size="small"
                onClick={handleExport}
                sx={{ p: 0.5 }}
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
            </Tooltip>
          )}
          <Button
            size="small"
            variant="text"
            onClick={() => setPaused((p) => !p)}
            sx={{ minWidth: 'auto', px: 1 }}
          >
            {paused ? 'Resume' : 'Pause'}
          </Button>
        </Stack>
      </Stack>

      <Stack spacing={0.5} sx={{ flex: 1, overflow: 'auto' }}>
        {events.length === 0 ? (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: 'center', py: 2 }}
          >
            No events yet
          </Typography>
        ) : (
          eventItems
        )}
      </Stack>

      <EventDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        event={selectedEvent}
      />
    </Paper>
  );
}

