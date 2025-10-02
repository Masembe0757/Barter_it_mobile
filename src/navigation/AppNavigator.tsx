import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {useAuth} from '../contexts/AuthContext';

// Auth Screens
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import VerifyAccountScreen from '../screens/auth/VerifyAccountScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main Screens
import HomeScreen from '../screens/main/HomeScreen';
import BrowseAssetsScreen from '../screens/assets/BrowseAssetsScreen';
import ListAssetScreen from '../screens/main/ListAssetScreen';
import DashboardScreen from '../screens/main/DashboardScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// Detail Screens
import AssetDetailScreen from '../screens/detail/AssetDetailScreen';
import PaymentScreen from '../screens/payment/PaymentScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import SearchScreen from '../screens/search/SearchScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyleInterpolator: ({current}) => ({
        cardStyle: {
          opacity: current.progress,
        },
      }),
    }}>
    <AuthStack.Screen name="SignIn" component={SignInScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    <AuthStack.Screen name="VerifyAccount" component={VerifyAccountScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#FF6B35',
      tabBarInactiveTintColor: '#999',
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingBottom: 25,
        paddingTop: 10,
        height: 90,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        marginBottom: 2,
      },
      headerStyle: {
        backgroundColor: '#FF6B35',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({color, size}) => (
          <Icon name="home" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Browse"
      component={BrowseAssetsScreen}
      options={{
        tabBarIcon: ({color, size}) => (
          <Icon name="magnify" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="List Asset"
      component={ListAssetScreen}
      options={{
        tabBarIcon: ({color, size}) => (
          <Icon name="plus-circle" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{
        tabBarIcon: ({color, size}) => (
          <Icon name="view-dashboard" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({color, size}) => (
          <Icon name="account" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const {isAuthenticated, isLoading} = useAuth();

  if (isLoading) {
    // You can return a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
              name="AssetDetails"
              component={AssetDetailScreen}
              options={{
                headerShown: true,
                headerStyle: {backgroundColor: '#FF6B35'},
                headerTintColor: '#fff',
                headerTitle: 'Asset Details',
              }}
            />
            <Stack.Screen
              name="Payment"
              component={PaymentScreen}
              options={{
                headerShown: true,
                headerStyle: {backgroundColor: '#FF6B35'},
                headerTintColor: '#fff',
                headerTitle: 'Payment',
              }}
            />
            <Stack.Screen
              name="ListAsset"
              component={ListAssetScreen}
              options={{
                headerShown: true,
                headerStyle: {backgroundColor: '#FF6B35'},
                headerTintColor: '#fff',
                headerTitle: 'List New Asset',
              }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{
                headerShown: true,
                headerStyle: {backgroundColor: '#FF6B35'},
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="Search"
              component={SearchScreen}
              options={{
                headerShown: true,
                headerStyle: {backgroundColor: '#FF6B35'},
                headerTintColor: '#fff',
                headerTitle: 'Search Assets',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;