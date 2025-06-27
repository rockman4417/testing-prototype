import React from 'react';
import { View, TextInput, Button, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { z } from 'zod';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  dateOfBirth: z.string(),
  option: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function App() {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      dateOfBirth: new Date().toISOString().split('T')[0],
      option: '',
    },
    resolver: zodResolver(formSchema),
  });

  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const selectedDate = watch('dateOfBirth');

  const onSubmit = async (data: FormValues) => {
    try {
      await axios.post('/submit', data);
      console.log('Form submitted');
    } catch (e) {
      console.error('Submission failed', e);
    }
  };

  console.log("test")

  return (
    <View style={{ padding: 20, gap: 16, marginTop: 100 }}>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            testID="input-name"
            placeholder="Name"
            value={value}
            onChangeText={onChange}
            style={{ borderBottomWidth: 1 }}
          />
        )}
      />
      {errors.name && <Text>{errors.name.message}</Text>}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            testID="input-email"
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            style={{ borderBottomWidth: 1 }}
            keyboardType="email-address"
          />
        )}
      />
      {errors.email && <Text>{errors.email.message}</Text>}

      <Button
        testID="picker-toggle"
        title={`DOB: ${selectedDate}`}
        onPress={() => setShowDatePicker(true)}
      />

      {showDatePicker && (
        <DateTimePicker
          value={new Date(selectedDate)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, date) => {
            setShowDatePicker(false);
            if (date) setValue('dateOfBirth', date.toISOString().split('T')[0]);
          }}
          testID="dob-picker"
        />
      )}

      <Button
        testID="select-option-a"
        title="Select Option A"
        onPress={() => setValue('option', 'A')}
      />

      <Button title="Submit" onPress={handleSubmit(onSubmit)} testID="submit-btn" />
    </View>
  );
}
