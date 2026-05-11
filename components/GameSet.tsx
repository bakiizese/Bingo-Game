import { View, TouchableOpacity, ImageBackground } from "react-native";
import React, { useState } from "react";
import kartelaBackground from "@/assets/images/kartela_background.jpg";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DropDown from "./DropDown";
import GameLogics from "@/utils/GameLogics";

type BingoBoard = {
  id: string;
  data: {
    [key: string]: string[];
  };
};
type Rule = {
  type: string;
  side: string;
  numOf: string;
};

type Rules = Rule[];
const GameSet = ({
  onRemove,
  setGameRules,
}: {
  onRemove: () => void;
  setGameRules: React.Dispatch<React.SetStateAction<Rules | undefined>>;
}) => {
  const [clicked, setClicked] = useState<[number, number][]>([]);

  const [side, setSide] = useState<string>("Any");
  const [intersect, setIntersect] = useState<boolean>(false);
  const [num, setNum] = useState<string>("1");

  const boardData: BingoBoard = {
    id: "new",
    data: {
      B: ["1", "2", "3", "4", "5"],
      I: ["16", "17", "18", "19", "20"],
      N: ["31", "32", "F", "34", "35"],
      G: ["46", "47", "48", "49", "50"],
      O: ["71", "72", "73", "74", "75"],
    },
  };

  const addLogic = (clicked: [number, number][]) => {
    if (!clicked) {
      console.log("no clicked items");
      return;
    }
    const result = GameLogics(clicked, side, num);
    const newRule: Rule = {
      type: result.type,
      side: result.side,
      numOf: result.numOf,
    };
    setGameRules((prev) => [...(prev || []), newRule]);
  };

  return (
    <ImageBackground
      source={kartelaBackground}
      resizeMode="cover"
      className="absolute w-56 h-fit py-3 px-2 self-center justify-center items-center"
      imageStyle={{ borderRadius: 14 }}
    >
      <>
        <TouchableOpacity
          className="absolute -right-1 -top-1 z-10"
          onPress={onRemove}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="delete-circle-outline"
            size={32}
            color="#FF6961"
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="absolute -left-1 -top-1 z-10"
          activeOpacity={0.8}
          onPress={() => addLogic(clicked)}
        >
          <Ionicons name="add-circle" size={32} color="#FF6961" />
        </TouchableOpacity>
      </>

      <DropDown
        clearPress={() => setClicked([])}
        setIntersect={setIntersect}
        setNum={setNum}
        setSide={setSide}
        intersect={intersect}
        num={num}
        side={side}
      />

      <View key={boardData.id} className="flex flex-row gap-1 ">
        {Object.keys(boardData.data).map((krt, idx) => (
          <View key={idx} className="flex flex-col gap-1">
            {boardData.data[krt]?.map((cell, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                className="items-center justify-center rounded-md w-9 h-9 bg-gray-200"
                style={{
                  backgroundColor: clicked?.some(
                    ([i, j]) => i === index && j === idx
                  )
                    ? "#f87171"
                    : "#e5e7eb",
                }}
                onPressIn={() => {
                  const exists = clicked?.some(
                    ([i, j]) => i === index && j === idx
                  );
                  if (exists) {
                    setClicked((prev) =>
                      prev.filter(([i, j]) => !(i === index && j === idx))
                    );
                  } else {
                    setClicked((prev) => [...(prev || []), [index, idx]]);
                  }
                }}
              />
            ))}
          </View>
        ))}
      </View>
    </ImageBackground>
  );
};

export default GameSet;
