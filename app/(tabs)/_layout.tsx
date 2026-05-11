import Colors from "@/constants/Colors";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import Store from "./store";
const Tab = createMaterialTopTabNavigator();

export default function StoreTabs() {
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          swipeEnabled: true,
          tabBarActiveTintColor: Colors.primary,
        }}
      >
        <Tab.Screen
          name="Tamrin"
          component={Store}
          options={{ tabBarLabel: "Tamrin" }}
        />
        <Tab.Screen
          name="Golden"
          component={Store}
          options={{ tabBarLabel: "Golden" }}
        />
        <Tab.Screen
          name="Mine"
          component={Store}
          options={{ tabBarLabel: "Mine" }}
        />
      </Tab.Navigator>
    </>
  );
}
