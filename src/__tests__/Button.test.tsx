import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../components/Button';

describe('Button Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<Button title="Test Button" onPress={() => {}} />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<Button title="Test Button" onPress={mockOnPress} />);
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when loading prop is true', () => {
    const { getByTestId } = render(
      <Button title="Test Button" onPress={() => {}} loading={true} />
    );
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('is disabled when disabled prop is true', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} disabled={true} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('applies correct variant styles', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} variant="outline" />
    );
    const button = getByText('Test Button').parent;
    expect(button).toHaveStyle({ backgroundColor: 'transparent' });
  });
});
