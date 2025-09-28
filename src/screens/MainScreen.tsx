import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logoutUser, checkAuthStatus } from '../store/authSlice';
import { fetchDashboardStats } from '../store/dashboardSlice';
import { Button, Card } from '../components';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { DashboardScreen } from './DashboardScreen';
import { CustomerListScreen } from './CustomerListScreen';
import { CustomerDetailsScreen } from './CustomerDetailsScreen';
import { AddEditCustomerScreen } from './AddEditCustomerScreen';
import { AddEditLeadScreen } from './AddEditLeadScreen';
import { Customer, Lead } from '../types/crm';

type Screen = 'dashboard' | 'customers' | 'customer-details' | 'add-customer' | 'edit-customer' | 'add-lead' | 'edit-lead';

export const MainScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchDashboardStats());
    }
  }, [isAuthenticated, dispatch]);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(logoutUser()).unwrap();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const navigateToCustomers = () => {
    setCurrentScreen('customers');
    setSelectedCustomer(null);
  };

  const navigateToCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCurrentScreen('customer-details');
  };

  const navigateToAddCustomer = () => {
    setSelectedCustomer(null);
    setCurrentScreen('add-customer');
  };

  const navigateToEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCurrentScreen('edit-customer');
  };

  const navigateToAddLead = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCurrentScreen('add-lead');
  };

  const navigateToEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setCurrentScreen('edit-lead');
  };

  const navigateBack = () => {
    switch (currentScreen) {
      case 'customer-details':
      case 'add-customer':
      case 'edit-customer':
      case 'add-lead':
      case 'edit-lead':
        setCurrentScreen('customers');
        setSelectedCustomer(null);
        setSelectedLead(null);
        break;
      case 'customers':
        setCurrentScreen('dashboard');
        break;
      default:
        break;
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return (
          <DashboardScreen
            onNavigateToCustomers={navigateToCustomers}
            onNavigateToLeads={navigateToCustomers}
          />
        );
      case 'customers':
        return (
          <CustomerListScreen
            onNavigateToCustomerDetails={navigateToCustomerDetails}
            onNavigateToAddCustomer={navigateToAddCustomer}
          />
        );
      case 'customer-details':
        return selectedCustomer ? (
          <CustomerDetailsScreen
            customerId={selectedCustomer.id}
            onNavigateToEditCustomer={navigateToEditCustomer}
            onNavigateToAddLead={navigateToAddLead}
            onNavigateToLeadDetails={navigateToEditLead}
          />
        ) : null;
      case 'add-customer':
        return (
          <AddEditCustomerScreen
            onSave={navigateBack}
            onCancel={navigateBack}
          />
        );
      case 'edit-customer':
        return selectedCustomer ? (
          <AddEditCustomerScreen
            customer={selectedCustomer}
            onSave={navigateBack}
            onCancel={navigateBack}
          />
        ) : null;
      case 'add-lead':
        return selectedCustomer ? (
          <AddEditLeadScreen
            customer={selectedCustomer}
            onSave={navigateBack}
            onCancel={navigateBack}
          />
        ) : null;
      case 'edit-lead':
        return selectedLead ? (
          <AddEditLeadScreen
            lead={selectedLead}
            onSave={navigateBack}
            onCancel={navigateBack}
          />
        ) : null;
      default:
        return null;
    }
  };

  const renderNavigation = () => {
    if (currentScreen === 'dashboard') {
      return (
        <View style={styles.navigation}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={navigateToCustomers}
          >
            <Text style={styles.navButtonText}>Customers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={handleLogout}
          >
            <Text style={styles.navButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.navigation}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={navigateBack}
        >
          <Text style={styles.navButtonText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={handleLogout}
        >
          <Text style={styles.navButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MiniCRM</Text>
        <Text style={styles.userInfo}>
          Welcome, {user.firstName} {user.lastName}
        </Text>
      </View>
      
      {renderNavigation()}
      
      <View style={styles.content}>
        {renderScreen()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: 4,
  },
  userInfo: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  navButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  navButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
});
