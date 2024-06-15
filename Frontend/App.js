import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DataProvider } from './DataProvider';
import React from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ScannerPage from './pages/ScannerPage';
import SettingsPage from './pages/SettingsPage';
import Updates from './pages/Updates';
import Web from './pages/Web';
import * as Linking from 'expo-linking';

const Stack = createStackNavigator();

const App = () => {
  const linking = {
    prefixes: [Linking.createURL('/'), 'https://food.estopia.net'],
  };

  return (
    <DataProvider>
        <NavigationContainer linking={linking}>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomePage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Scanner"
              component={ScannerPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="settings"
              component={SettingsPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Updates"
              component={Updates}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Web"
              component={Web}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        </DataProvider>
  );
};

export default App;
