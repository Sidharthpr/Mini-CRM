import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchCustomers, deleteCustomer, setSearchQuery } from '../store/customerSlice';
import { Button, Input, Card } from '../components';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Customer } from '../types/crm';

interface CustomerListScreenProps {
  onNavigateToCustomerDetails: (customer: Customer) => void;
  onNavigateToAddCustomer: () => void;
}

export const CustomerListScreen: React.FC<CustomerListScreenProps> = ({
  onNavigateToCustomerDetails,
  onNavigateToAddCustomer,
}) => {
  const dispatch = useAppDispatch();
  const { customers, isLoading, pagination, searchQuery } = useAppSelector(state => state.customers);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async (page = 1) => {
    try {
      await dispatch(fetchCustomers({ page, limit: 10, search: searchQuery })).unwrap();
    } catch (error) {
      Alert.alert('Error', 'Failed to load customers');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCustomers(1);
    setRefreshing(false);
  };

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
    loadCustomers(1);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    Alert.alert(
      'Delete Customer',
      `Are you sure you want to delete ${customer.firstName} ${customer.lastName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteCustomer(customer.id)).unwrap();
              Alert.alert('Success', 'Customer deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete customer');
            }
          },
        },
      ]
    );
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages && !isLoading) {
      loadCustomers(pagination.page + 1);
    }
  };

  const renderCustomer = ({ item }: { item: Customer }) => (
    <Card style={styles.customerCard}>
      <TouchableOpacity
        onPress={() => onNavigateToCustomerDetails(item)}
        style={styles.customerContent}
      >
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.customerEmail}>{item.email}</Text>
          <Text style={styles.customerCompany}>{item.company}</Text>
          <Text style={styles.customerPhone}>{item.phone}</Text>
        </View>
        <View style={styles.customerActions}>
          <Button
            title="Edit"
            onPress={() => onNavigateToCustomerDetails(item)}
            variant="outline"
            size="small"
            style={styles.actionButton}
          />
          <Button
            title="Delete"
            onPress={() => handleDeleteCustomer(item)}
            variant="outline"
            size="small"
            style={[styles.actionButton, styles.deleteButton]}
          />
        </View>
      </TouchableOpacity>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No customers found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery ? 'Try adjusting your search criteria' : 'Add your first customer to get started'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Customers</Text>
        <Button
          title="Add Customer"
          onPress={onNavigateToAddCustomer}
          style={styles.addButton}
        />
      </View>

      <Input
        placeholder="Search customers..."
        value={searchQuery}
        onChangeText={handleSearch}
        containerStyle={styles.searchInput}
      />

      <FlatList
        data={customers}
        renderItem={renderCustomer}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  },
  addButton: {
    minWidth: 120,
  },
  searchInput: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  customerCard: {
    marginBottom: 12,
  },
  customerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: 4,
  },
  customerEmail: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  customerCompany: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  customerPhone: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  customerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    minWidth: 60,
  },
  deleteButton: {
    borderColor: Colors.error,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    ...Typography.h2,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
