import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const StaticCell = ({
  text,
  callFunc,
  textStyling = "text-3xl",
  cellStyling = "w-9 h-9",
  clicked,
}: {
  text: string;
  callFunc?: (newText: string) => void;
  textStyling?: string;
  cellStyling?: string;
  clicked?: string[];
}) => {
  return (
    <TouchableOpacity
      className={`bg-gray-200 items-center justify-center rounded-md  overflow-hidden ${cellStyling}`}
      activeOpacity={0.6}
      style={{
        backgroundColor: clicked?.includes(text) ? "#f87171" : "#e5e7eb",
      }}
      onPress={() => {
        callFunc?.(text);
      }}
    >
      <Text className={`text-center font-bold ${textStyling}`}>{text}</Text>
    </TouchableOpacity>
  );
};

export default StaticCell;
