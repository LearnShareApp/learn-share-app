import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toast } from "react-native-toast-notifications";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { apiService } from "../utilities/api";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import Line from "../components/line";

const authSchema = zod.object({
  datetime: zod.date(),
});

type FormData = zod.infer<typeof authSchema>;

export default function AddTime() {
  // Используем отдельные состояния для даты и времени
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());

  const { control, handleSubmit, formState, setValue } = useForm<FormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      datetime: new Date(),
    },
  });

  const [showPickerTime, setShowPickerTime] = useState(false);
  const [showPickerDate, setShowPickerDate] = useState(false);

  // Функция для комбинирования даты и времени
  const combineDateAndTime = (date: Date, time: Date): Date => {
    const combined = new Date(date);
    combined.setHours(
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds()
    );
    return combined;
  };

  // Обновляем значение в форме при изменении даты или времени
  useEffect(() => {
    const combinedDateTime = combineDateAndTime(selectedDate, selectedTime);
    setValue("datetime", combinedDateTime);
  }, [selectedDate, selectedTime, setValue]);

  const SendRequest = async (data: FormData) => {
    try {
      const postData = {
        datetime: data.datetime,
      };
      const response = await apiService.addTime(postData);
      Toast.show("Request sent successfully", {
        type: "success",
        placement: "top",
        duration: 1500,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "An unknown error occurred";
        Toast.show(errorMessage, {
          type: "warning",
          placement: "top",
          duration: 3000,
        });
        console.log(errorMessage);
      } else {
        console.error("Unexpected error:", error);
        Toast.show("An unexpected error occurred", {
          type: "warning",
          placement: "top",
          duration: 3000,
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="datetime"
        rules={{
          required: "Date and time are required",
        }}
        render={({ field: { value }, fieldState: { error } }) => (
          <View style={styles.dateTimeContainer}>
            <Text style={{ paddingHorizontal: 16 }}>Add new time</Text>
            <Line />
            <View style={styles.pickerContainer}>
              <Button
                color="#C9A977"
                title={selectedDate.toLocaleDateString()}
                onPress={() => setShowPickerDate(true)}
              />
              <Text style={styles.labelText}>Select date:</Text>
              {showPickerDate && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={(_, selectedDate) => {
                    setShowPickerDate(false);
                    if (selectedDate) {
                      setSelectedDate(selectedDate);
                    }
                  }}
                />
              )}
            </View>
            <View style={styles.pickerContainer}>
              <Button
                color="#C9A977"
                title={selectedTime.toLocaleTimeString()}
                onPress={() => setShowPickerTime(true)}
              />
              <Text style={styles.labelText}>Select time:</Text>
              {showPickerTime && (
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  display="spinner"
                  minuteInterval={30}
                  onChange={(_, selectedDate) => {
                    setShowPickerTime(false);
                    if (selectedDate) {
                      setSelectedTime(selectedDate);
                    }
                  }}
                />
              )}
            </View>
            {error && <Text style={styles.error}>{error.message}</Text>}
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(SendRequest)}
        disabled={formState.isSubmitting}
      >
        <Text style={styles.buttonText}>Add Time</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    alignItems: "center",
  },
  dateTimeContainer: {
    backgroundColor: "white",
    gap: 16,
    padding: 16,
    borderRadius: 8,
    width: "100%",
  },
  pickerContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 24,
    justifyContent: "space-between",
    width: "100%",
  },
  labelText: {
    color: "#999",
    fontSize: 16,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 16,
    textAlign: "left",
    width: "90%",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    backgroundColor: "#C9A977",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
    maxWidth: 600,
    alignItems: "center",
  },
});
