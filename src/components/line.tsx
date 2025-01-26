import { View } from "react-native";

const Line = ({ color }: { color?: string }) => {
  return <View style={{ width: "100%",
    height: 1, backgroundColor: color ? color : "#ddd" }}></View>;
};

export default Line;
