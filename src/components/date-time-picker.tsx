import React, { useState } from "react";
import { View, Button, Text, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLanguage } from "../providers/language-provider";

const DateOfBirthInput = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const { t } = useLanguage();

  const onChange = (event: unknown, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    setShow(false);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>{t("date_of_birth")}: {date.toLocaleDateString()}</Text>
      <Button 
        title={t("select_date_of_birth")} 
        onPress={showDatePicker} 
      />
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
