import React from 'react';
import {View} from 'react-native';
import {render} from '@testing-library/react-native';

import AppNavigator from '../index';
import HomeScreen from '../HomeScreen';

jest.mock('../HomeScreen', () => jest.fn());

describe('AppNavigator', () => {
  test('should render home page by default', async () => {
    (HomeScreen as jest.Mock).mockReturnValueOnce(
      <View testID="mock-home-screen" />,
    );
    const wrapper = render(<AppNavigator />);
  });
});
