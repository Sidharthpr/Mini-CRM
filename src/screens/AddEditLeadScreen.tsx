import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { createLead, updateLead, clearCurrentLead } from '../store/leadSlice';
import { fetchCustomers } from '../store/customerSlice';
import { Button, Input, Card } from '../components';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { leadSchema } from '../utils/validation';
import { Lead, LeadStatus, Customer } from '../types/crm';

interface AddEditLeadScreenProps {
  lead?: Lead | null;
  customer?: Customer | null;
  onSave: () => void;
  onCancel: () => void;
}

type LeadFormData = Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>;

const leadStatusOptions: LeadStatus[] = ['New', 'Contacted', 'Converted', 'Lost'];

export const AddEditLeadScreen: React.FC<AddEditLeadScreenProps> = ({
  lead,
  customer,
  onSave,
  onCancel,
}) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(state => state.leads);
  const { customers } = useAppSelector(state => state.customers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customer || null);
  const isEditing = !!lead;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<LeadFormData>({
    resolver: yupResolver(leadSchema),
    defaultValues: {
      customerId: customer?.id || '',
      title: '',
      description: '',
      status: 'New',
      value: 0,
    },
  });

  useEffect(() => {
    if (lead) {
      reset({
        customerId: lead.customerId,
        title: lead.title,
        description: lead.description,
        status: lead.status,
        value: lead.value,
      });
    }
  }, [lead, reset]);

  useEffect(() => {
    if (customers.length === 0) {
      dispatch(fetchCustomers({ page: 1, limit: 100 }));
    }
  }, [dispatch, customers.length]);

  useEffect(() => {
    if (selectedCustomer) {
      setValue('customerId', selectedCustomer.id);
    }
  }, [selectedCustomer, setValue]);

  const onSubmit = async (data: LeadFormData) => {
    try {
      if (isEditing && lead) {
        await dispatch(updateLead({ id: lead.id, leadData: data })).unwrap();
        Alert.alert('Success', 'Lead updated successfully');
      } else {
        await dispatch(createLead(data)).unwrap();
        Alert.alert('Success', 'Lead created successfully');
      }
      dispatch(clearCurrentLead());
      onSave();
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to save lead');
    }
  };

  const renderCustomerSelector = () => (
    <View style={styles.customerSelector}>
      <Text style={styles.selectorLabel}>Customer</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.customerList}>
        {customers.map((customer) => (
          <TouchableOpacity
            key={customer.id}
            style={[
              styles.customerOption,
              selectedCustomer?.id === customer.id && styles.selectedCustomerOption,
            ]}
            onPress={() => setSelectedCustomer(customer)}
          >
            <Text
              style={[
                styles.customerOptionText,
                selectedCustomer?.id === customer.id && styles.selectedCustomerOptionText,
              ]}
            >
              {customer.firstName} {customer.lastName}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {errors.customerId && (
        <Text style={styles.errorText}>{errors.customerId.message}</Text>
      )}
    </View>
  );

  const renderStatusSelector = () => (
    <View style={styles.statusSelector}>
      <Text style={styles.selectorLabel}>Status</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusList}>
        {leadStatusOptions.map((status) => (
          <Controller
            key={status}
            control={control}
            name="status"
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  value === status && styles.selectedStatusOption,
                ]}
                onPress={() => onChange(status)}
              >
                <Text
                  style={[
                    styles.statusOptionText,
                    value === status && styles.selectedStatusOptionText,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            )}
          />
        ))}
      </ScrollView>
      {errors.status && (
        <Text style={styles.errorText}>{errors.status.message}</Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {isEditing ? 'Edit Lead' : 'Add New Lead'}
          </Text>
        </View>

        <Card style={styles.formCard}>
          {renderCustomerSelector()}

          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Title"
                placeholder="Enter lead title"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.title?.message}
                autoCapitalize="words"
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Description"
                placeholder="Enter lead description"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.description?.message}
                multiline
                numberOfLines={4}
                style={styles.descriptionInput}
              />
            )}
          />

          {renderStatusSelector()}

          <Controller
            control={control}
            name="value"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Value ($)"
                placeholder="Enter lead value"
                value={value.toString()}
                onChangeText={(text) => onChange(parseFloat(text) || 0)}
                onBlur={onBlur}
                error={errors.value?.message}
                keyboardType="numeric"
              />
            )}
          />

          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={onCancel}
              variant="outline"
              style={styles.cancelButton}
            />
            <Button
              title={isEditing ? 'Update Lead' : 'Create Lead'}
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={isLoading}
              style={styles.saveButton}
            />
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    paddingTop: 60,
    marginBottom: 20,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
  },
  formCard: {
    flex: 1,
  },
  customerSelector: {
    marginBottom: 16,
  },
  selectorLabel: {
    ...Typography.bodySmall,
    color: Colors.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  customerList: {
    marginBottom: 4,
  },
  customerOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: Colors.border,
  },
  selectedCustomerOption: {
    backgroundColor: Colors.primary,
  },
  customerOptionText: {
    ...Typography.bodySmall,
    color: Colors.text,
  },
  selectedCustomerOptionText: {
    color: Colors.surface,
    fontWeight: '600',
  },
  statusSelector: {
    marginBottom: 16,
  },
  statusList: {
    marginBottom: 4,
  },
  statusOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: Colors.border,
  },
  selectedStatusOption: {
    backgroundColor: Colors.primary,
  },
  statusOptionText: {
    ...Typography.bodySmall,
    color: Colors.text,
  },
  selectedStatusOptionText: {
    color: Colors.surface,
    fontWeight: '600',
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
});
