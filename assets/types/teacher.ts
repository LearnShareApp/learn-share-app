import { ImageSourcePropType } from "react-native";

export type Teacher = {
  id: number;
  Name: string;
  Surname: string;
  phoneNumber: string;
  avatarImage: ImageSourcePropType;
};
