import * as React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  Text,
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
} from "@livekit/react-native";
import { Track } from "livekit-client";
import { Toast } from "react-native-toast-notifications";
import { router } from "expo-router";

registerGlobals();

const wsURL = "wss://learn-and-share-tdvnu79s.livekit.cloud";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mzc2NDQxNjEsImlzcyI6IkFQSWdESkdFTVpkeTJNYSIsIm5iZiI6MTczNzYzNjk2MSwic3ViIjoicXVpY2tzdGFydCB1c2VyIDFrd2FucyIsInZpZGVvIjp7ImNhblB1Ymxpc2giOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWUsInJvb20iOiJxdWlja3N0YXJ0IHJvb20iLCJyb29tSm9pbiI6dHJ1ZX19.SpZB1ezcPogBsjK-oCfxcJr_y7jzgmKJ77CenQh4toU";

export default function Lesson() {
  const [isCallActive, setIsCallActive] = useState(true);

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
    Toast.show("Call ended", {
      type: "success",
      placement: "top",
      duration: 3000,
    });

    setTimeout(() => {
      router.replace("/");
    }, 3000);
  };

  if (!isCallActive) {
    return (
      <View style={styles.endCallContainer}>
        <Text style={styles.endCallText}>Call Ended</Text>
      </View>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={wsURL}
      token={token}
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
});
