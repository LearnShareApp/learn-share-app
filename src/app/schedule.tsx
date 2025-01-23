import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  FlatList,
} from "react-native";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toast } from "react-native-toast-notifications";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { apiService, DateTime } from "../utilities/api";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import Line from "../components/line";

const authSchema = zod.object({
  datetime: zod.date(),
});

type FormData = zod.infer<typeof authSchema>;

export default function AddTime() {
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
  const [times, setTimes] = useState<DateTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const combinedDateTime = combineDateAndTime(selectedDate, selectedTime);
    setValue("datetime", combinedDateTime);
  }, [selectedDate, selectedTime, setValue]);

  const fetchTimes = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTime();
      const parsedTimes = (response || []).map((time: DateTime) => ({
        ...time,
        datetime: new Date(time.datetime),
      }));
      setTimes(parsedTimes);
    } catch (err) {
      console.error("Error details:", err);
      setError("Failed to fetch times");
      Toast.show("Failed to load times", {
        type: "error",
        placement: "top",
        duration: 3000,
      });
      setTimes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimes();
  }, []);

  const SendRequest = async (data: FormData) => {
    try {
      const postData = {
        datetime: data.datetime,
      };
      await apiService.addTime(postData);
      Toast.show("Time added successfully", {
        type: "success",
        placement: "top",
        duration: 1500,
      });
      fetchTimes();
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

  const renderTimeItem = ({ item }: { item: DateTime }) => {
    if (!item.datetime) {
      console.warn("DateTime is undefined for item:", item);
      return null;
    }

    return (
      <View
        style={
          !item.is_available
            ? [styles.timeItem, styles.takenTime]
            : styles.timeItem
        }
      >
        <Text style={styles.timeText}>
          {new Date(item.datetime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </Text>
        <Text style={[styles.timeText, { color: "#888" }]}>
          {new Date(item.datetime).toLocaleDateString()}
        </Text>
      </View>
    );
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
            <Text style={styles.sectionTitle}>Add new time</Text>
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
                title={
                  "    " +
                  selectedTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }) +
                  "    "
                }
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

      <Text style={[styles.sectionTitle, { paddingHorizontal: 16 }]}>
        Your times
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#C9A977" />
      ) : times.length ? (
        <FlatList
          data={times}
          renderItem={renderTimeItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          horizontal={false}
          numColumns={2}
        />
      ) : (
        <Text style={{ textAlign: "center" }}>You don't have any time</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
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
    width: "100%",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
  },
  timeItem: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    width: "49%",
    marginRight: "2%",
  },
  timeText: {
    fontSize: 16,
    textAlign: "center",
  },
  list: {
    width: "100%",
  },
  listContent: {
    paddingBottom: 16,
    gap: 8,
    justifyContent: "space-between",
  },
  takenTime: {
    borderWidth: 2,
    borderColor: "black",
  },
});
