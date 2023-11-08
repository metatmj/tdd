import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import {useNavigation} from '@react-navigation/native';
import {act} from 'react-test-renderer';
import WeatherCurrent from '../WeatherCurrent';
import LocationService from '../../services/LocationService';
import {Colors} from '../../constants';

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual<object>('@react-navigation/native'),
    useNavigation: jest.fn().mockReturnValue({navigate: jest.fn()}),
  };
});

describe('WeatherCurrent', () => {
  test('should render correctly', () => {
    const wrapper = render(<WeatherCurrent />);
    wrapper.getByTestId('weather-current');
  });

  test('should render label', () => {
    const wrapper = render(<WeatherCurrent />);
    wrapper.getByText('Weather at my position');
  });

  test('should navigate to Weather screen with location', async () => {
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValueOnce({navigate: mockNavigate});

    const wrapper = render(<WeatherCurrent />);
    const button = wrapper.getByTestId('weather-current');
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Weather', {
        latitude: 0,
        longitude: 0,
      });
    });
  });

  describe('Loader', () => {
    test('should be rendered when position is being fetched', async () => {
      let mockResolve!: (position: {
        latitude: number;
        longitude: number;
      }) => void;

      jest.spyOn(LocationService, 'getCurrentPosition').mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            mockResolve = resolve;
          }),
      );
      const wrapper = render(<WeatherCurrent />);
      const button = wrapper.getByTestId('weather-current');
      fireEvent.press(button);

      await expect(
        wrapper.findByTestId('button-loading'),
      ).resolves.toBeDefined();

      await act(async () => {
        await mockResolve({latitude: 0, longitude: 0});
      });
    });

    test('should not be rendered when position has been fetched', () => {
      const wrapper = render(<WeatherCurrent />);
      const button = wrapper.getByTestId('weather-current');
      fireEvent.press(button);

      return expect(wrapper.findByTestId('button-loading')).rejects.toThrow();
    });

    test('should not be rendered when fetching position has failed', () => {
      jest
        .spyOn(LocationService, 'getCurrentPosition')
        .mockRejectedValueOnce(new Error(''));

      const wrapper = render(<WeatherCurrent />);
      const button = wrapper.getByTestId('weather-current');
      fireEvent.press(button);

      return expect(wrapper.findByTestId('button-loading')).rejects.toThrow();
    });
  });

  describe('Error', () => {
    test('should be displayed after fetching position has failed', async () => {
      jest
        .spyOn(LocationService, 'getCurrentPosition')
        .mockRejectedValueOnce(new Error());

      const wrapper = render(<WeatherCurrent />);
      const button = wrapper.getByTestId('weather-current');
      fireEvent.press(button);
      await waitFor(() => {
        expect(button).toHaveStyle({borderColor: Colors.ERROR});
      });
    });

    test('should be reset after fetching position again', async () => {
      jest
        .spyOn(LocationService, 'getCurrentPosition')
        .mockRejectedValueOnce(new Error(''));

      const wrapper = render(<WeatherCurrent />);
      const button = wrapper.getByTestId('weather-current');
      fireEvent.press(button);

      await waitFor(() => {
        fireEvent.press(button);
        expect(button).not.toHaveStyle({borderColor: Colors.ERROR});
      });
    });
  });
});
