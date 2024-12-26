import * as React from "react";
import { StyleSheet, View, FlatList, ListRenderItem } from "react-native";
import { useEffect } from "react";
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

registerGlobals();

const wsURL = "wss://learn-and-share-tdvnu79s.livekit.cloud";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzUyMTk2MTIsImlzcyI6IkFQSWdESkdFTVpkeTJNYSIsIm5iZiI6MTczNTIxMjQxMiwic3ViIjoicXVpY2tzdGFydCB1c2VyIDRmYTNweSIsInZpZGVvIjp7ImNhblB1Ymxpc2giOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWUsInJvb20iOiJxdWlja3N0YXJ0IHJvb20iLCJyb29tSm9pbiI6dHJ1ZX19.yfLTg_ZT5ACiatIbhoM3XQfpZubUnJDGWEb8k87m-Oo";

const RoomView = () => {
  // Get all camera tracks.
  const tracks = useTracks([Track.Source.Camera]);

  const renderTrack: ListRenderItem<TrackReferenceOrPlaceholder> = ({
    item,
  }) => {
    // Render using the VideoTrack component.
    if (isTrackReference(item)) {
      return <VideoTrack trackRef={item} style={styles.participantView} />;
    } else {
      return <View style={styles.participantView} />;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList data={tracks} renderItem={renderTrack} />
    </View>
  );
};

const Room = () => {
  useEffect(() => {
    let start = async () => {
      await AudioSession.startAudioSession();
    };

    // start();
    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);
  return (
    <LiveKitRoom
      serverUrl={wsURL}
      token={token}
      connect={true}
      options={{
        // Use screen pixel density to handle screens with differing densities.
        adaptiveStream: { pixelDensity: "screen" },
      }}
      audio={true}
      video={true}
    >
      <RoomView />
    </LiveKitRoom>
  );
};

export default Room;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
  },
  participantView: {
    height: 300,
  },
});
