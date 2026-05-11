import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { CameraView } from "expo-camera";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Camera = ({ setCamera }: { setCamera: (val: boolean) => void }) => {
  return (
    <View className="flex-1 absolute right-0 left-0 top-32 h-[100%] items-center justify-center">
      <CameraView style={styles.camera} facing={"back"}>
        <TouchableOpacity
          activeOpacity={0.7}
          className="absolute top2 right-2"
          onPress={() => setCamera(false)}
        >
          <FontAwesome name="remove" size={40} color="red" />
        </TouchableOpacity>
      </CameraView>
      <TouchableOpacity
        activeOpacity={0.7}
        className="bg-slate-400 w-32 h-16 rounded-xl justify-center items-center my-2"
        onPress={() => console.log("take a pic")}
      >
        <Text className="text-3xl texxt-center font-bold">Take</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Camera;

const styles = StyleSheet.create({
  camera: { width: "75%", height: "50%", borderRadius: 24 },
});
