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
import { useLanguage } from "../providers/language-provider";
import { useTheme } from "../providers/theme-provider";

const authSchema = zod.object({
  datetime: zod.date(),
});

type FormData = zod.infer<typeof authSchema>;

const AddTime = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
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
      Toast.show(t("request_success"), {
        type: "success",
        placement: "top",
        duration: 1500,
      });
      fetchTimes();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || t("unknown_error");
        Toast.show(errorMessage, {
          type: "warning",
          placement: "top",
          duration: 3000,
        });
        console.log(errorMessage);
      } else {
        console.error("Unexpected error:", error);
        Toast.show(t("unexpected_error"), {
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
        style={[
          styles.timeItem,
          { backgroundColor: theme.colors.card },
          !item.is_available && styles.takenTime
        ]}
      >
        <Text style={[styles.timeText, { color: theme.colors.text }]}>
          {new Date(item.datetime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </Text>
        <Text style={{ color: '#888' }}>
          {new Date(item.datetime).toLocaleDateString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Controller
        control={control}
        name="datetime"
        rules={{
          required: t("date_time_required"),
        }}
        render={({ field: { value }, fieldState: { error } }) => (
          <View style={[styles.dateTimeContainer, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t("add_new_time")}</Text>
            <Line />
            <View style={styles.pickerContainer}>
              <Button
                color={theme.colors.primary}
                title={selectedDate.toLocaleDateString()}
                onPress={() => setShowPickerDate(true)}
              />
              <Text style={[styles.labelText, { color: theme.colors.text }]}>{t("select_date")}:</Text>
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
                color={theme.colors.primary}
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
              <Text style={[styles.labelText, { color: theme.colors.text }]}>{t("select_time")}:</Text>
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
            {error && <Text style={[styles.error, { color: theme.colors.error }]}>{error.message}</Text>}
          </View>
        )}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleSubmit(SendRequest)}
        disabled={formState.isSubmitting}
      >
        <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>{t("add_time")}</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { paddingHorizontal: 16, color: theme.colors.text }]}>
        {t("your_times")}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
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
        <Text style={{ textAlign: "center", color: theme.colors.text }}>{t("no_times")}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  dateTimeContainer: {
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  pickerContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  timeItem: {
    flex: 1,
    margin: 4,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  takenTime: {
    opacity: 0.5,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 4,
  },
  error: {
    fontSize: 14,
  },
  labelText: {
    fontSize: 16,
  },
  timeText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default AddTime;
