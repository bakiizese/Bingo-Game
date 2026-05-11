import { DataProvider } from "@/components/AppContext";
import Colors from "@/constants/Colors";
import "@/global.css";
import { DataBase_name, useM } from "@/utils/SqliteDb";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense, useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Storelayout from "./(tabs)/_layout";
import index from "./index";

const Tab = createMaterialTopTabNavigator();

export default function RootLayout() {
  const { success, error } = useM();
  useEffect(() => {
    if (error) {
      console.error(`Migration error ${error}`);
    } else if (success) {
      console.log("Migration Successful");
    }
  }, [success, error]);
  useM();

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName={DataBase_name}
        options={{ enableChangeListener: true }}
        useSuspense
      >
        <DataProvider>
          <Tab.Navigator
            screenOptions={{
              swipeEnabled: true,
              tabBarActiveTintColor: Colors.primary,
              tabBarStyle: {
                marginTop: 30,
                backgroundColor: "#fff",
              },
            }}
          >
            <Tab.Screen
              name="index"
              component={index}
              options={{
                tabBarLabel: ({ color }) => (
                  <View style={{ alignItems: "center" }}>
                    <Ionicons name="game-controller" size={12} color={color} />
                    <Text style={{ color, fontSize: 12 }}>Home</Text>
                  </View>
                ),
              }}
            />
            <Tab.Screen
              name="Storelayout"
              component={Storelayout}
              options={{
                tabBarLabel: ({ color }) => (
                  <View style={{ alignItems: "center" }}>
                    <Ionicons name="storefront" size={12} color={color} />
                    <Text style={{ color, fontSize: 12 }}>Store</Text>
                  </View>
                ),
              }}
            />
          </Tab.Navigator>
        </DataProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
