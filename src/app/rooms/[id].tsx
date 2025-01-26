import * as React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { useEffect, useMemo, useState } from "react";
import {
  AudioSession,
  LiveKitRoom,
  useTracks,
  TrackReferenceOrPlaceholder,
  VideoTrack,
  isTrackReference,
  registerGlobals,
} from "@livekit/react-native";
import { Track } from "livekit-client";
import { Toast } from "react-native-toast-notifications";
import { router, useLocalSearchParams } from "expo-router";
import { useLanguage } from "../../providers/language-provider";

registerGlobals();

const wsURL = "wss://learn-and-share-app-raalcu2w.livekit.cloud"

export default function Lesson() {
  const { id } = useLocalSearchParams();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [roomToken, setRoomToken] = useState<string | null>(null);
  const [isCallActive, setIsCallActive] = useState(true);

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
    setIsCallActive(false);
    Toast.show(t("call_ended"), {
      type: "success",
      placement: "top",
      duration: 3000,
    });

    setTimeout(() => {
      router.replace("/");
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
    </LiveKitRoom>
  );
}

const RoomView = ({ onEndCall }: { onEndCall: () => void }) => {
  const tracks = useTracks([Track.Source.Camera]);

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
      <TouchableOpacity style={styles.endCallButton} onPress={onEndCall}>
        <Text style={styles.endCallButtonText}>End Call</Text>
      </TouchableOpacity>
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
  endCallButton: {
    backgroundColor: "#FF4D4D",
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  endCallButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
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
});
