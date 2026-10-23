import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import HistoricoScreen from './src/screens/HistoricoScreen';
import { carregarTema } from './src/storage/theme';
import { THEMES } from './src/theme/colors';

const Stack = createNativeStackNavigator();

export default function App() {
  const [themeMode, setThemeMode] = useState('dark');

  useEffect(() => {
    carregarTema().then((t) => setThemeMode(t));
  }, []);

  const currentTheme = THEMES[themeMode] || THEMES.dark;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: currentTheme.headerBg,
          },
          headerTintColor: currentTheme.headerTint,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: currentTheme.screenBg,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Historico"
          component={HistoricoScreen}
          options={{
            title: 'Histórico de Cálculos',
            headerBackTitle: 'Voltar',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
