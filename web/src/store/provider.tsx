'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { AppThemeProvider } from '../theme/theme';

export function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AppThemeProvider>{children}</AppThemeProvider>
    </Provider>
  );
}
