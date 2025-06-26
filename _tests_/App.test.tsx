import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../App';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GenericFormApp', () => {
  it('submits a valid form with correct body', async () => {
    mockedAxios.post.mockResolvedValue({});

    const { getByTestId, getByText } = render(<App />);

    fireEvent.changeText(getByTestId('input-name'), 'Chris');
    fireEvent.changeText(getByTestId('input-email'), 'chris@example.com');
    fireEvent.press(getByTestId('select-option-a'));
    fireEvent.press(getByTestId('submit-btn'));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('/submit', {
        name: 'Chris',
        email: 'chris@example.com',
        dateOfBirth: expect.any(String), // From default or picked value
        option: 'A',
      });
    });
  });
});
