export interface AlertConfig {
  failureRateThreshold: number; // e.g., 0.2 = 20% failure rate triggers alert
  volumeThreshold: number; // Minimum volume to check
  spikeMultiplier: number; // e.g., 2 = 2x average triggers spike alert
}

export interface Alert {
  type: 'failure_spike' | 'volume_threshold' | 'low_success_rate';
  message: string;
  severity: 'error' | 'warning' | 'info';
  timestamp: Date;
}

export function detectFailureSpike(
  recentEvents: any[],
  config: AlertConfig
): Alert | null {
  if (recentEvents.length < 10) return null;

  const failures = recentEvents.filter((e) =>
    e.type?.includes('failed') || e.payment?.status === 'failed'
  );
  const failureRate = failures.length / recentEvents.length;

  if (failureRate >= config.failureRateThreshold) {
    return {
      type: 'failure_spike',
      message: `High failure rate detected: ${Math.round(
        failureRate * 100
      )}% of recent payments failed`,
      severity: 'error',
      timestamp: new Date(),
    };
  }

  return null;
}

export function detectVolumeSpike(
  currentVolume: number,
  averageVolume: number,
  config: AlertConfig
): Alert | null {
  if (averageVolume === 0) return null;

  const ratio = currentVolume / averageVolume;
  if (ratio >= config.spikeMultiplier && currentVolume >= config.volumeThreshold) {
    return {
      type: 'volume_threshold',
      message: `Volume spike detected: ${Math.round(
        ratio * 100
      )}% above average`,
      severity: 'warning',
      timestamp: new Date(),
    };
  }

  return null;
}

export function detectLowSuccessRate(
  successRate: number,
  threshold: number = 0.8
): Alert | null {
  if (successRate < threshold) {
    return {
      type: 'low_success_rate',
      message: `Low success rate: ${Math.round(successRate * 100)}%`,
      severity: 'warning',
      timestamp: new Date(),
    };
  }

  return null;
}
