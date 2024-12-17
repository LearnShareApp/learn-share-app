import { Button, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link, Redirect, Stack, useLocalSearchParams } from "expo-router";
import { TEACHERS } from "../../../assets/teachers";
import SkillBadge from "../../components/skill";
import { FontAwesome } from "@expo/vector-icons";
import { useVideoPlayer, VideoView  } from "expo-video";
import { useEvent } from "expo";


const TeacherProfile = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const teacher = TEACHERS.find((teacher) => teacher.id === Number(id));

  if (!teacher) return <Redirect href="/" />;

  const videoSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  const player = useVideoPlayer(videoSource, player => {
    player.loop = false;
    player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  return (
    <View>
      <Stack.Screen options={{ title: `${teacher.Name} ${teacher.Surname}` }} />
      <ScrollView>
        <View style={styles.contentContainer}>
          <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
        </View>
        <View style={styles.white}>
          <Image source={teacher.avatarImage} style={styles.image}/>
          <View style={styles.teacherInfo}>
            <Text>{teacher.Name} {teacher.Surname}</Text>
            <FlatList
              data={teacher.skills}
              style={styles.skillsList}
              renderItem={(item) => <SkillBadge text={item.item} />}
            />
          </View>
          <View>
            <Link href={'/report'} asChild>
              <Pressable style={{ width: 40, height: 40, alignItems: 'center' }}>
                <FontAwesome size={24} name="exclamation" style={{ color: "#C9A977" }} />
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
      
    </View>
  );
};

export default TeacherProfile;

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: 200,
  },
  white: {
    backgroundColor: 'white',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  image: {
    width: 64,
    height: 64,
  },
  teacherInfo: {
    flex: 1,
    gap: 8,
  },
  skillsList: {
    gap: 5,
    flexDirection: "row",
    width: '100%',
  },
});
