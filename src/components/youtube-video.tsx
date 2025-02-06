import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const YouTubeVideo = ({ videoId }: { videoId: string }) => {
  return (
    <WebView
      source={{
        uri: `https://www.youtube-nocookie.com/embed/${videoId}?controls=1&modestbranding=1&rel=0&autoplay=1`,
      }}
      style={styles.video}
      javaScriptEnabled={true}
      allowsFullscreenVideo
    />
  );
};

const styles = StyleSheet.create({
  video: {
    width: "100%",
    height: "100%",
    aspectRatio: 16 / 9,
  },
});

export default YouTubeVideo;
