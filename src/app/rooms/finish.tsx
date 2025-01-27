import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../providers/theme-provider";
import { useLanguage } from "../../providers/language-provider";
import { apiService } from "../../utilities/api";
import axios from "axios";
import { Toast } from "react-native-toast-notifications";
import eventEmitter from "../../utilities/event-emitter";

const Finish = () => {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const { lesson_id } = useLocalSearchParams();

    const lessonCancel = async () => {
        try {
            await apiService.lessonCancel(Number(lesson_id));
            Toast.show(t("lesson_canceled"), {
                type: "success",
                placement: "top",
                duration: 1500,
            });
            eventEmitter.emit('lessonRemoved', Number(lesson_id));
            router.replace(`/`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage =
                error.response?.data?.error || t("an_unknown_error_occurred");
                Toast.show(errorMessage, {
                type: "warning",
                placement: "top",
                duration: 3000,
                swipeEnabled: true,
                });
                console.log(errorMessage);
            } else {
                console.error("Unexpected error:", error);
                Toast.show(t("an_unexpected_error_occurred"), {
                type: "warning",
                placement: "top",
                duration: 3000,
                });
            }
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.colors.primary }]} 
            onPress={lessonCancel}
            >
            <Text style={[styles.buttonText, { color: theme.colors.text }]}>
                {t("go_back_home")}
            </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        padding: 16,
        borderRadius: 8,
        minWidth: 200,
    },
    buttonText: {
        fontSize: 16,
        textAlign: "center",
    }
});

export default Finish;
