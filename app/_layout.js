import { Slot, Stack } from "expo-router";
import { GlobalProvider } from "./providers/GlobalProvider";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function AppLayout() {
  return (
    <GlobalProvider>
      <StatusBar style="light"></StatusBar>
      <Stack
        screenOptions={{
          headerTitleStyle: {
            fontWeight: "bold",
            color: "white",
          },
          headerTitleAlign: "center",
          headerTintColor: "white",
        }}
      >
        <Stack.Screen name="index" options={{ title: "Albums" }} />
        <Stack.Screen name="AlbumItemsView" />
      </Stack>
    </GlobalProvider>
  );
}
