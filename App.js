import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as PaperProvider} from 'react-native-paper';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {AuthProvider} from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

// For Expo Go compatibility, we'll conditionally load Stripe
let StripeProvider = ({children}) => children;

try {
  // Try to import Stripe, but it will fail in Expo Go
  const stripe = require('@stripe/stripe-react-native');
  StripeProvider = stripe.StripeProvider;
} catch (e) {
  // Stripe not available in Expo Go
  console.log('Stripe not available in Expo Go');
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

export default function App() {
  // Dummy Stripe key for Expo Go
  const STRIPE_KEY = 'pk_test_dummy_key';

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={theme}>
            <StripeProvider publishableKey={STRIPE_KEY}>
              <AuthProvider>
                <AppNavigator />
              </AuthProvider>
            </StripeProvider>
          </PaperProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}