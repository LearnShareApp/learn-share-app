import React, { useState } from "react";
import { View, Button, Text, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const DateOfBirthInput = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event: unknown, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate); // Устанавливаем выбранную дату
    }
    setShow(false); // Скрываем пикер после выбора
  };

  const showDatePicker = () => {
    setShow(true);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Дата рождения: {date.toLocaleDateString()}</Text>
      <Button title="Выбрать дату" onPress={showDatePicker} />
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default DateOfBirthInput;
