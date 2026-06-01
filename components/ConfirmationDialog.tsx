import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ConfirmationDialog = ({
  dialog,
  onPress,
  setShowConfirm,
}: {
  dialog: string;
  onPress: () => void;
  setShowConfirm: (val: boolean) => void;
}) => {
  return (
    <View className="w-fit pl-6 pr-3 py-4 border-4 border-green-700 h-fit bg-slate-300 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-2/3 rounded-lg justify-center items-center overflow-x-clip">
      <View className="absolute left-2 top-2">
        <AntDesign name="questioncircle" size={30} color="red" />
      </View>
      <Text className="text-lg pl-7 pb-4 max-w-60">
        Are You Sure, {dialog}?
      </Text>
      <View className="flex-row gap-4">
        <TouchableOpacity
          className="px-2 bg-green-700 rounded-md"
          onPress={onPress}
        >
          <Text className="font-bold text-2xl">Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-2 bg-red-700 rounded-md"
          onPress={() => {
            setShowConfirm(false);
          }}
        >
          <Text className="font-bold text-2xl">No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConfirmationDialog;
