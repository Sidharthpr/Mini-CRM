import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isPassword = false,
  style,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!isPassword);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const inputStyle = [
    styles.input,
    leftIcon && styles.inputWithLeftIcon,
    (rightIcon || isPassword) && styles.inputWithRightIcon,
    error && styles.inputError,
    style,
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        <TextInput
          style={inputStyle}
          secureTextEntry={isPassword && !isPasswordVisible}
          placeholderTextColor={Colors.placeholder}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={togglePasswordVisibility}
          >
            <Text style={styles.passwordToggle}>
              {isPasswordVisible ? '👁️' : '🙈'}
            </Text>
          </TouchableOpacity>
        )}
        {rightIcon && !isPassword && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...Typography.bodySmall,
    color: Colors.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    ...Typography.body,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: Colors.text,
    flex: 1,
    minHeight: 48,
  },
  inputWithLeftIcon: {
    paddingLeft: 48,
  },
  inputWithRightIcon: {
    paddingRight: 48,
  },
  inputError: {
    borderColor: Colors.error,
  },
  leftIconContainer: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  rightIconContainer: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
  },
  passwordToggle: {
    fontSize: 18,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: 4,
  },
});
