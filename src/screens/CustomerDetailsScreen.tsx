import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchCustomerById, fetchLeads } from '../store/customerSlice';
import { fetchLeads as fetchCustomerLeads } from '../store/leadSlice';
import { Button, Card } from '../components';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Customer, Lead } from '../types/crm';

interface CustomerDetailsScreenProps {
  customerId: string;
  onNavigateToEditCustomer: (customer: Customer) => void;
  onNavigateToAddLead: (customer: Customer) => void;
  onNavigateToLeadDetails: (lead: Lead) => void;
}

export const CustomerDetailsScreen: React.FC<CustomerDetailsScreenProps> = ({
  customerId,
  onNavigateToEditCustomer,
  onNavigateToAddLead,
  onNavigateToLeadDetails,
}) => {
  const dispatch = useAppDispatch();
  const { currentCustomer, isLoading: customerLoading } = useAppSelector(state => state.customers);
  const { leads, isLoading: leadsLoading } = useAppSelector(state => state.leads);

  useEffect(() => {
    loadCustomerData();
  }, [customerId]);

  const loadCustomerData = async () => {
    try {
      await dispatch(fetchCustomerById(customerId)).unwrap();
      await dispatch(fetchCustomerLeads({ customerId })).unwrap();
    } catch (error) {
      Alert.alert('Error', 'Failed to load customer data');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return Colors.primary;
      case 'Contacted':
        return Colors.warning;
      case 'Converted':
        return Colors.success;
      case 'Lost':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const renderLead = (lead: Lead) => (
    <Card key={lead.id} style={styles.leadCard}>
      <TouchableOpacity
        onPress={() => onNavigateToLeadDetails(lead)}
        style={styles.leadContent}
      >
        <View style={styles.leadInfo}>
          <Text style={styles.leadTitle}>{lead.title}</Text>
          <Text style={styles.leadDescription} numberOfLines={2}>
            {lead.description}
          </Text>
          <View style={styles.leadMeta}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(lead.status) }]}>
              <Text style={styles.statusText}>{lead.status}</Text>
            </View>
            <Text style={styles.leadValue}>{formatCurrency(lead.value)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );

  if (customerLoading || !currentCustomer) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading customer details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {currentCustomer.firstName} {currentCustomer.lastName}
        </Text>
        <Button
          title="Edit"
          onPress={() => onNavigateToEditCustomer(currentCustomer)}
          variant="outline"
          size="small"
        />
      </View>

      <Card style={styles.customerCard}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{currentCustomer.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{currentCustomer.phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Company:</Text>
          <Text style={styles.infoValue}>{currentCustomer.company}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Created:</Text>
          <Text style={styles.infoValue}>
            {new Date(currentCustomer.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </Card>

      <View style={styles.leadsSection}>
        <View style={styles.leadsHeader}>
          <Text style={styles.sectionTitle}>Leads ({leads.length})</Text>
          <Button
            title="Add Lead"
            onPress={() => onNavigateToAddLead(currentCustomer)}
            size="small"
          />
        </View>

        {leadsLoading ? (
          <Text style={styles.loadingText}>Loading leads...</Text>
        ) : leads.length > 0 ? (
          leads.map(renderLead)
        ) : (
          <Card style={styles.emptyLeadsCard}>
            <Text style={styles.emptyLeadsText}>No leads found for this customer</Text>
            <Button
              title="Add First Lead"
              onPress={() => onNavigateToAddLead(currentCustomer)}
              variant="outline"
              style={styles.addFirstLeadButton}
            />
          </Card>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    flex: 1,
  },
  customerCard: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
    width: 80,
    fontWeight: '500',
  },
  infoValue: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
  },
  leadsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  leadsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  leadCard: {
    marginBottom: 12,
  },
  leadContent: {
    padding: 0,
  },
  leadInfo: {
    flex: 1,
  },
  leadTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: 8,
  },
  leadDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  leadMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    ...Typography.caption,
    color: Colors.surface,
    fontWeight: '600',
  },
  leadValue: {
    ...Typography.body,
    color: Colors.success,
    fontWeight: '600',
  },
  emptyLeadsCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyLeadsText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  addFirstLeadButton: {
    minWidth: 140,
  },
});
