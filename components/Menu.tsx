import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const Menu = ({
  setmenu,
  setcamera,
  setboard,
}: {
  setmenu: (val: boolean) => void;
  setcamera: (val: boolean) => void;
  setboard: (val: boolean) => void;
}) => {
  return (
    <View className="absolute self-center mx-14 z-10 left-5  right-5 bg-slate-500 rounded-2xl">
      <TouchableOpacity
        activeOpacity={0.7}
        className="absolute p-[2] -top-1 -right-1 z-20"
        onPress={() => setmenu(false)}
      >
        <Ionicons name="close-circle" size={28} color="#ef4444" />
      </TouchableOpacity>
      <Text className="text-center pt-1 rounded-t-2xl w-full h-11 bg-slate-600 self-center mb-2 font-bold text-2xl">
        How Would like To Add
      </Text>
      <TouchableOpacity
        activeOpacity={0.7}
        className="p-3 mx-3 mb-2 bg-slate-100 rounded-xl"
        onPress={() => {
          setcamera(true), setmenu(false);
        }}
      >
        <Text className="text-xl font-bold text-black text-center">Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        className="p-3 mx-3 mb-2 bg-slate-100 rounded-xl"
        onPress={() => {
          setboard(true), setmenu(false);
        }}
      >
        <Text className="text-xl font-bold text-black text-center">Manual</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Menu;
