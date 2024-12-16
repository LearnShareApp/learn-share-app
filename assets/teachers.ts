import { Teacher } from "./types/teacher";

export const TEACHERS: Teacher[] = [
  {
    id: 1,
    Name: "Andrew",
    Surname: "Eroshenkov",
    phoneNumber: "676482764",
    avatarImage: require("./icon.png"),
    skills: ["programming"],
    grade: 5.0,
  },
  {
    id: 2,
    Name: "Ruslan",
    Surname: "Khairulin",
    phoneNumber: "676482764",
    avatarImage: require("./icon.png"),
    skills: ["programming", "cooking"],
    grade: 4.2,
  },
  {
    id: 3,
    Name: "Grigorij",
    Surname: "Gusev",
    phoneNumber: "676482764",
    avatarImage: require("./icon.png"),
    skills: ["programming", "guitar"],
    grade: 4.8,
  },
  {
    id: 4,
    Name: "Andrea",
    Surname: "Homon",
    phoneNumber: "676482764",
    avatarImage: require("./icon.png"),
    skills: ["cooking", "guitar"],
    grade: 3.9,
  },
  {
    id: 5,
    Name: "Anastasia",
    Surname: "Loski",
    phoneNumber: "676482764",
    avatarImage: require("./icon.png"),
    skills: ["game-dev", "guitar"],
    grade: 4.5,
  },
];
