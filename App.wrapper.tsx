/**
 * Smart App Wrapper
 * Detects environment and configures appropriately
 */
import React from 'react';
import {Platform} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as PaperProvider} from 'react-native-paper';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {AuthProvider} from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

// Conditional Stripe import to avoid Expo Go issues
let StripeProvider: any = ({children}: any) => children;
let STRIPE_KEY = 'pk_test_dummy_key';

try {
  const StripeModule = require('@stripe/stripe-react-native');
  StripeProvider = StripeModule.StripeProvider;
  const config = require('./src/constants/config');
  STRIPE_KEY = config.STRIPE_PUBLISHABLE_KEY;
} catch (e) {
  console.log('Running in Expo Go - Stripe disabled');
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const theme = {
  colors: {
    primary: '#FF6B35',
    accent: '#F7931E',
  },
};

// Environment detection
const isExpoGo = () => {
  // Check if running in Expo Go
  return Platform.OS === 'ios' || Platform.OS === 'android'
    ? global.navigator?.product === 'ReactNative' && !global.nativePerformanceNow
    : false;
};

function App(): React.JSX.Element {
  const isExpo = isExpoGo();

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={theme}>
            {isExpo ? (
              // Expo Go compatible version (no Stripe)
              <AuthProvider>
                <AppNavigator />
              </AuthProvider>
            ) : (
              // Full version with Stripe
              <StripeProvider publishableKey={STRIPE_KEY}>
                <AuthProvider>
                  <AppNavigator />
                </AuthProvider>
              </StripeProvider>
            )}
          </PaperProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;