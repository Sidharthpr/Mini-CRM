import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const registerSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  lastName: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export const customerSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  lastName: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phone: yup
    .string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .required('Phone number is required'),
  company: yup
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .required('Company name is required'),
});

export const leadSchema = yup.object().shape({
  title: yup
    .string()
    .min(3, 'Title must be at least 3 characters')
    .required('Title is required'),
  description: yup
    .string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
  status: yup
    .string()
    .oneOf(['New', 'Contacted', 'Converted', 'Lost'], 'Please select a valid status')
    .required('Status is required'),
  value: yup
    .number()
    .min(0, 'Value must be a positive number')
    .required('Value is required'),
  customerId: yup
    .string()
    .required('Customer is required'),
});