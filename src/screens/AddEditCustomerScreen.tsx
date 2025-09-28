import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { createCustomer, updateCustomer, clearCurrentCustomer } from '../store/customerSlice';
import { Button, Input, Card } from '../components';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { customerSchema } from '../utils/validation';
import { Customer } from '../types/crm';

interface AddEditCustomerScreenProps {
  customer?: Customer | null;
  onSave: () => void;
  onCancel: () => void;
}

type CustomerFormData = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>;

export const AddEditCustomerScreen: React.FC<AddEditCustomerScreenProps> = ({
  customer,
  onSave,
  onCancel,
}) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(state => state.customers);
  const isEditing = !!customer;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormData>({
    resolver: yupResolver(customerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
    },
  });

  useEffect(() => {
    if (customer) {
      reset({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        company: customer.company,
      });
    }
  }, [customer, reset]);

  const onSubmit = async (data: CustomerFormData) => {
    try {
      if (isEditing && customer) {
        await dispatch(updateCustomer({ id: customer.id, customerData: data })).unwrap();
        Alert.alert('Success', 'Customer updated successfully');
      } else {
        await dispatch(createCustomer(data)).unwrap();
        Alert.alert('Success', 'Customer created successfully');
      }
      dispatch(clearCurrentCustomer());
      onSave();
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to save customer');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {isEditing ? 'Edit Customer' : 'Add New Customer'}
          </Text>
        </View>

        <Card style={styles.formCard}>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="First Name"
                placeholder="Enter first name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.firstName?.message}
                autoCapitalize="words"
                autoComplete="given-name"
              />
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Last Name"
                placeholder="Enter last name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.lastName?.message}
                autoCapitalize="words"
                autoComplete="family-name"
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="Enter email address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Phone"
                placeholder="Enter phone number"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.phone?.message}
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            )}
          />

          <Controller
            control={control}
            name="company"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Company"
                placeholder="Enter company name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.company?.message}
                autoCapitalize="words"
                autoComplete="organization"
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
              title={isEditing ? 'Update Customer' : 'Create Customer'}
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
