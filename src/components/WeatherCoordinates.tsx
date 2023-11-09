import React from 'react';
import {View, StyleSheet, TextInput, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import Button from './Button';
import {Colors} from '../constants';

type FormValues = {
  latitude: string;
  longitude: string;
};

const WeatherCoordinates = () => {
  const navigation = useNavigation();

  const form = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: 'onChange',
  });

  const handleSubmit = form.handleSubmit((values) => {
    navigation.navigate('Weather', values);
  });

  return (
    <View testID="weather-coordinates">
      <View style={styles.inputs}>
        <Controller
          control={form.control}
          render={({onChange, ...p}) => (
            <TextInput
              {...p}
              testID="weather-coordinates-latitude"
              onChangeText={onChange}
              style={styles.inputs}
              placeholder="Lat"
              placeholderTextColor={Colors.GRAY}
            />
          )}
          name="latitude"
        />
        {form.errors.latitude && (
          <Text style={styles.error}>Latitude must be a valid number</Text>
        )}

        <Controller
          control={form.control}
          render={({onChange, ...p}) => (
            <TextInput
              {...p}
              testID="weather-coordinates-longitude"
              onChangeText={onChange}
              style={styles.inputs}
              placeholder="Long"
              placeholderTextColor={Colors.GRAY}
            />
          )}
          name="longitude"
        />
        {form.errors.longitude && (
          <Text style={styles.error}>Longitude must be a valid number</Text>
        )}
      </View>
      <Button onPress={handleSubmit} label="find" />
    </View>
  );
};

const defaultValues: FormValues = {
  latitude: '',
  longitude: '',
};

const validationSchema = Yup.object().shape({
  latitude: Yup.number().min(-90).max(90),
  longitude: Yup.number(),
});

const styles = StyleSheet.create({
  inputs: {
    flexDirection: 'column',
    marginBottom: 5,
  },
  input: {
    backgroundColor: Colors.TRANSPARENT,
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    paddingHorizontal: 15,
    paddingVertical: 8,
    color: Colors.WHITE,
  },
  error: {
    marginHorizontal: 5,
    color: Colors.ERROR,
  },
});

export default WeatherCoordinates;
