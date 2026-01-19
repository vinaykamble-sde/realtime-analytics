export function exportToCSV(data: any[], filename: string = 'export.csv') {
  if (!data || data.length === 0) {
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value);
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportMetricsToCSV(metrics: any) {
  const data = [
    {
      Metric: 'Total Volume',
      Value: `₹${metrics.totalVolume}`,
    },
    {
      Metric: 'Success Rate',
      Value: `${Math.round(metrics.successRate * 100)}%`,
    },
    {
      Metric: 'Average Amount',
      Value: `₹${metrics.averageAmount}`,
    },
    {
      Metric: 'Top Payment Method',
      Value: metrics.topPaymentMethod,
    },
    {
      Metric: 'Peak Hour',
      Value: `${metrics.peakHour}:00`,
    },
  ];

  exportToCSV(data, `metrics-${new Date().toISOString().split('T')[0]}.csv`);
}

export function exportTrendsToCSV(trends: any[], period: string) {
  if (!trends || trends.length === 0) return;

  const data = trends.map((trend) => ({
    Timestamp: trend.timestamp,
    Amount: trend.amount,
    Count: trend.count,
    'Success Rate': trend.successRate,
  }));

  exportToCSV(
    data,
    `trends-${period}-${new Date().toISOString().split('T')[0]}.csv`
  );
}

export function exportEventsToCSV(events: any[]) {
  if (!events || events.length === 0) return;

  const data = events.map((event) => ({
    Type: event.type,
    Amount: event.payment?.amount || 0,
    Method: event.payment?.method || 'N/A',
    Status: event.payment?.status || 'N/A',
    Timestamp: event.timestamp
      ? new Date(event.timestamp).toISOString()
      : new Date().toISOString(),
  }));

  exportToCSV(data, `events-${new Date().toISOString().split('T')[0]}.csv`);
}
