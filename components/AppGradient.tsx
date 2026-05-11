import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ImageBackground } from "react-native";

const AppGradient = ({
  children,
  colors,
  backgroundI,
}: {
  children: any;
  colors: [string, string, ...string[]];
  backgroundI: any;
}) => {
  return (
    <ImageBackground
      source={backgroundI}
      resizeMode="repeat"
      className="flex-1"
    >
      <LinearGradient colors={colors} className="flex-1">
        {children}
      </LinearGradient>
    </ImageBackground>
  );
};

export default AppGradient;
