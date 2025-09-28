import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { useAppDispatch, useAppSelector } from './src/hooks/redux';
import { checkAuthStatus } from './src/store/authSlice';
import { LoginScreen, RegisterScreen, MainScreen } from './src/screens';

type Screen = 'login' | 'register' | 'main';

function AppContent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth);
  const [currentScreen, setCurrentScreen] = React.useState<Screen>('login');

  useEffect(() => {
    // Check if user is already authenticated
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentScreen('main');
    } else if (!isLoading) {
      setCurrentScreen('login');
    }
  }, [isAuthenticated, isLoading]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen
            onNavigateToRegister={() => setCurrentScreen('register')}
          />
        );
      case 'register':
        return (
          <RegisterScreen
            onNavigateToLogin={() => setCurrentScreen('login')}
          />
        );
      case 'main':
        return <MainScreen />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      {renderScreen()}
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
