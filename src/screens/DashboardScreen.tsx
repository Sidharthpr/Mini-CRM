import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchDashboardStats } from '../store/dashboardSlice';
import { fetchCustomers } from '../store/customerSlice';
import { fetchLeads } from '../store/leadSlice';
import { Card } from '../components';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { LeadStatus } from '../types/crm';

interface DashboardScreenProps {
  onNavigateToCustomers: () => void;
  onNavigateToLeads: () => void;
}

const screenWidth = Dimensions.get('window').width;

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateToCustomers,
  onNavigateToLeads,
}) => {
  const dispatch = useAppDispatch();
  const { leadsByStatus, totalValue, isLoading } = useAppSelector(state => state.dashboard);
  const { customers } = useAppSelector(state => state.customers);
  const { leads } = useAppSelector(state => state.leads);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      await Promise.all([
        dispatch(fetchDashboardStats()).unwrap(),
        dispatch(fetchCustomers({ page: 1, limit: 10 })).unwrap(),
        dispatch(fetchLeads()).unwrap(),
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: LeadStatus) => {
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

  const pieChartData = Object.entries(leadsByStatus).map(([status, count]) => ({
    name: status,
    population: count,
    color: getStatusColor(status as LeadStatus),
    legendFontColor: Colors.text,
    legendFontSize: 12,
  }));

  const barChartData = {
    labels: Object.keys(leadsByStatus),
    datasets: [
      {
        data: Object.values(leadsByStatus),
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: Colors.surface,
    backgroundGradientFrom: Colors.surface,
    backgroundGradientTo: Colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: Colors.primary,
    },
  };

  const recentLeads = leads.slice(0, 5);
  const recentCustomers = customers.slice(0, 5);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Welcome to MiniCRM</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{customers.length}</Text>
          <Text style={styles.statLabel}>Total Customers</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{leads.length}</Text>
          <Text style={styles.statLabel}>Total Leads</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{formatCurrency(totalValue)}</Text>
          <Text style={styles.statLabel}>Total Value</Text>
        </Card>
      </View>

      {/* Charts */}
      <View style={styles.chartsContainer}>
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Leads by Status</Text>
          {pieChartData.some(item => item.population > 0) ? (
            <PieChart
              data={pieChartData}
              width={screenWidth - 80}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 10]}
              absolute
            />
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyChartText}>No leads data available</Text>
            </View>
          )}
        </Card>

        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Lead Count by Status</Text>
          {Object.values(leadsByStatus).some(count => count > 0) ? (
            <BarChart
              data={barChartData}
              width={screenWidth - 80}
              height={220}
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              showValuesOnTopOfBars
            />
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyChartText}>No leads data available</Text>
            </View>
          )}
        </Card>
      </View>

      {/* Recent Activity */}
      <View style={styles.activityContainer}>
        <Card style={styles.activityCard}>
          <Text style={styles.activityTitle}>Recent Leads</Text>
          {recentLeads.length > 0 ? (
            recentLeads.map((lead) => (
              <View key={lead.id} style={styles.activityItem}>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityItemTitle}>{lead.title}</Text>
                  <Text style={styles.activityItemSubtitle}>
                    {formatCurrency(lead.value)} • {lead.status}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusIndicator,
                    { backgroundColor: getStatusColor(lead.status) },
                  ]}
                />
              </View>
            ))
          ) : (
            <Text style={styles.emptyActivityText}>No recent leads</Text>
          )}
        </Card>

        <Card style={styles.activityCard}>
          <Text style={styles.activityTitle}>Recent Customers</Text>
          {recentCustomers.length > 0 ? (
            recentCustomers.map((customer) => (
              <View key={customer.id} style={styles.activityItem}>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityItemTitle}>
                    {customer.firstName} {customer.lastName}
                  </Text>
                  <Text style={styles.activityItemSubtitle}>{customer.company}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyActivityText}>No recent customers</Text>
          )}
        </Card>
      </View>
    </ScrollView>
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
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  statNumber: {
    ...Typography.h1,
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  chartsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  chartCard: {
    marginBottom: 20,
    alignItems: 'center',
  },
  chartTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: 16,
  },
  emptyChart: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChartText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  activityContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  activityCard: {
    marginBottom: 20,
  },
  activityTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  activityInfo: {
    flex: 1,
  },
  activityItemTitle: {
    ...Typography.body,
    color: Colors.text,
    marginBottom: 2,
  },
  activityItemSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  emptyActivityText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
});