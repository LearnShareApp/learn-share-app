import * as React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useEffect, useState } from "react";
import {
  AudioSession,
  LiveKitRoom,
  useTracks,
  TrackReferenceOrPlaceholder,
  VideoTrack,
  isTrackReference,
  registerGlobals,
  useLocalParticipant,
} from "@livekit/react-native";
import { Track } from "livekit-client";
import { Toast } from "react-native-toast-notifications";
import { router, useLocalSearchParams } from "expo-router";
import { useLanguage } from "../../providers/language-provider";
import { FontAwesome } from "@expo/vector-icons";
import Constants from "expo-constants";
registerGlobals();

const wsURL = Constants.expoConfig?.extra?.LiveKit_URL;

export default function Lesson() {
  const { id, lesson_id } = useLocalSearchParams();
  const { user_id } = useLocalSearchParams();
  const { category } = useLocalSearchParams();
  const { is_teacher } = useLocalSearchParams();

  const { t } = useLanguage();

  const [isLoading, setIsLoading] = useState(true);
  const [roomToken, setRoomToken] = useState<string | null>(null);
  const [isCallActive, setIsCallActive] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const getRoomToken = async () => {
      try {
        const response = id as string;
        setRoomToken(response);
      } catch (error) {
        Toast.show(t("failed_to_connect"), {
          type: "error",
          placement: "top",
          duration: 3000,
        });
        router.replace("/");
      } finally {
        setIsLoading(false);
      }
    };

    getRoomToken();
  }, [id]);

  useEffect(() => {
    let start = async () => {
      await AudioSession.startAudioSession();
    };

    start();
    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);

  const handleEndCall = () => {
    setIsModalVisible(true);
  };

  const confirmEndCall = () => {
    setIsModalVisible(false);
    setIsCallActive(false);
    Toast.show(t("call_ended"), {
      type: "success",
      placement: "top",
      duration: 3000,
    });

    setTimeout(() => {
      router.replace(
        `/rooms/finish?lesson_id=${lesson_id}&user_id=${user_id}&category=${category}$is_teacher=${is_teacher}`
      );
    }, 3000);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C9A977" />
      </View>
    );
  }

  if (!isCallActive) {
    return (
      <View style={styles.endCallContainer}>
        <Text style={styles.endCallText}>{t("call_ended")}</Text>
      </View>
    );
  }

  if (!roomToken) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t("failed_to_connect")}</Text>
      </View>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={wsURL}
      token={roomToken}
      connect={true}
      options={{
        adaptiveStream: { pixelDensity: "screen" },
      }}
      audio={true}
      video={true}
    >
      <RoomView onEndCall={handleEndCall} />
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{t("confirm_end_call")}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={confirmEndCall}
              >
                <Text style={styles.modalButtonText}>{t("yes")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>{t("no")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LiveKitRoom>
  );
}

const RoomView = ({ onEndCall }: { onEndCall: () => void }) => {
  const tracks = useTracks([Track.Source.Camera]);
  const { localParticipant } = useLocalParticipant();
  const [isMuted, setIsMuted] = useState(false);

  const switchCamera = async () => {
    try {
      const videoTrack = localParticipant?.getTrackPublication(
        Track.Source.Camera
      )?.track;
      if (videoTrack?.mediaStreamTrack) {
        // @ts-ignore - метод существует в react-native-webrtc
        await videoTrack.mediaStreamTrack._switchCamera();
      }
    } catch (error) {
      console.error("Ошибка при переключении камеры:", error);
    }
  };

  const toggleMicrophone = async () => {
    try {
      const audioTrack = localParticipant?.getTrackPublication(
        Track.Source.Microphone
      )?.track;
      if (audioTrack) {
        if (isMuted) {
          await audioTrack.unmute();
        } else {
          await audioTrack.mute();
        }
        setIsMuted(!isMuted);
      }
    } catch (error) {
      console.error("Ошибка при управлении микрофоном:", error);
    }
  };

  const renderTrack: ListRenderItem<TrackReferenceOrPlaceholder> = ({
    item,
  }) => {
    if (isTrackReference(item)) {
      return <VideoTrack trackRef={item} style={styles.participantView} />;
    } else {
      return <View style={styles.participantView} />;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tracks}
        renderItem={renderTrack}
        style={styles.trackList}
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.grayButton} onPress={switchCamera}>
          <FontAwesome name="video-camera" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={isMuted ? styles.whiteButton : styles.grayButton}
          onPress={toggleMicrophone}
        >
          <FontAwesome
            name={isMuted ? "microphone-slash" : "microphone"}
            size={24}
            color={isMuted ? "grey" : "white"}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.endCallButton} onPress={onEndCall}>
          <FontAwesome name="phone" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  trackList: {
    flex: 1,
    marginBottom: 20,
  },
  participantView: {
    height: 300,
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  grayButton: {
    backgroundColor: "#808080", // Серый цвет для кнопок камеры и микрофона
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    width: 64,
    height: 64,
  },
  whiteButton: {
    backgroundColor: "#FFFFFF", // Белый цвет для кнопок камеры и микрофона
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    width: 64,
    height: 64,
  },
  endCallButton: {
    backgroundColor: "#F44336", // Красный цвет для кнопки завершения звонка
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    width: 64,
    height: 64,
  },
  endCallContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
  },
  endCallText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
  },
  errorText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "white",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
    backgroundColor: "#C9A977",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
});
