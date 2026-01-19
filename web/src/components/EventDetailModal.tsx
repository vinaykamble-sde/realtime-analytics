'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Stack,
} from '@mui/material';

interface PaymentEvent {
  type: string;
  payment: {
    amount: number;
    method?: string;
    status?: string;
    id?: string;
  };
  timestamp?: Date | string;
}

interface EventDetailModalProps {
  open: boolean;
  onClose: () => void;
  event: PaymentEvent | null;
}

export function EventDetailModal({
  open,
  onClose,
  event,
}: EventDetailModalProps) {
  if (!event) return null;

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(d);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Payment Event Details</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Event Type
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
              {event.type}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="caption" color="text.secondary">
              Amount
            </Typography>
            <Typography variant="h6" sx={{ mt: 0.5 }}>
              ₹{event.payment.amount}
            </Typography>
          </Box>

          {event.payment.method && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Payment Method
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>
                {event.payment.method}
              </Typography>
            </Box>
          )}

          {event.payment.status && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Status
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>
                {event.payment.status}
              </Typography>
            </Box>
          )}

          {event.payment.id && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Payment ID
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 0.5, fontFamily: 'monospace' }}
              >
                {event.payment.id}
              </Typography>
            </Box>
          )}

          <Divider />

          <Box>
            <Typography variant="caption" color="text.secondary">
              Timestamp
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {formatDate(event.timestamp)}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
