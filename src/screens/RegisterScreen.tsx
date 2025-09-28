import React, { useState } from 'react';
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
import { registerUser } from '../store/authSlice';
import { Button, Input, Card } from '../components';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { registerSchema } from '../utils/validation';
import { RegisterFormData } from '../types/auth';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onNavigateToLogin,
}) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(state => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await dispatch(registerUser(data)).unwrap();
      Alert.alert('Success', 'Registration successful!');
    } catch (error: any) {
      Alert.alert('Error', error || 'Registration failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <Card style={styles.formCard}>
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="First Name"
                    placeholder="First name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.firstName?.message}
                    autoCapitalize="words"
                    autoComplete="given-name"
                  />
                )}
              />
            </View>
            <View style={styles.nameField}>
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Last Name"
                    placeholder="Last name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.lastName?.message}
                    autoCapitalize="words"
                    autoComplete="family-name"
                  />
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="Enter your email"
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
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="Create a password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                isPassword
                autoComplete="new-password"
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
                isPassword
                autoComplete="new-password"
              />
            )}
          />

          <Button
            title="Create Account"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
            style={styles.registerButton}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title="Sign Up with Google"
            onPress={() => Alert.alert('Info', 'Google Sign-Up not implemented')}
            variant="outline"
            style={styles.googleButton}
          />
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Button
            title="Sign In"
            onPress={onNavigateToLogin}
            variant="outline"
            size="small"
          />
        </View>
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  formCard: {
    marginBottom: 24,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameField: {
    flex: 1,
  },
  registerButton: {
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginHorizontal: 16,
  },
  googleButton: {
    marginTop: 0,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
