import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const Notification = ({
  showNot,
  content,
}: {
  showNot?: (val: boolean) => void;
  content?: string;
}) => {
  setTimeout(() => {
    showNot?.(false);
  }, 500);
  return (
    <View className="absolute z-10 top-8 left-0 flex-1 w-full h-8 bg-red-100 rounded-lg justify-center items-center">
      <Text>{content}</Text>
      <TouchableOpacity
        className="absolute right-0"
        onPress={() => showNot?.(false)}
      >
        <FontAwesome name="remove" color="red" size={30}></FontAwesome>
      </TouchableOpacity>
    </View>
  );
};

export default Notification;
