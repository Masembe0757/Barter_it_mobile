import React, {useEffect} from 'react';
import {Platform} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as PaperProvider} from 'react-native-paper';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StatusBar} from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import Constants from 'expo-constants';
import {AuthProvider} from './src/contexts/AuthContext';
import {DataProvider} from './src/contexts/DataContext';
import AppNavigator from './src/navigation/AppNavigator';

// For Expo Go compatibility, we'll conditionally load Stripe
let StripeProvider = ({children}) => children;
let hasStripe = false;

try {
  // Try to import Stripe, but it will fail in Expo Go
  const stripe = require('@stripe/stripe-react-native');
  StripeProvider = stripe.StripeProvider;
  hasStripe = true;
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
  // Use environment variable or dummy key for development
  const STRIPE_KEY = Constants.expoConfig?.extra?.stripePublishableKey || 'pk_test_dummy_key';

  useEffect(() => {
    // Configure navigation bar safely for Android
    if (Platform.OS === 'android') {
      try {
        NavigationBar.setBackgroundColorAsync('transparent');
        NavigationBar.setVisibilityAsync('hidden');
        NavigationBar.setBehaviorAsync('overlay-swipe');
      } catch (error) {
        console.log('NavigationBar configuration failed:', error);
      }
    }
  }, []);

  const AppContent = () => (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          <AuthProvider>
            <DataProvider>
              <AppNavigator />
            </DataProvider>
          </AuthProvider>
        </PaperProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      {hasStripe ? (
        <StripeProvider publishableKey={STRIPE_KEY}>
          <AppContent />
        </StripeProvider>
      ) : (
        <AppContent />
      )}
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}