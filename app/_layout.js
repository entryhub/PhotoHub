import { Slot, Stack } from "expo-router";
import { GlobalProvider } from "./providers/GlobalProvider";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function AppLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
          <Stack.Screen name="index" />
          <Stack.Screen name="AlbumItemsView" />
          <Stack.Screen
            name="MediaView"
            options={{
              headerStyle: {
                backgroundColor: "#000",
              },
              title: "Photo",
              presentation: "transparentModal",
              animation: "fade",
            }}
          />
        </Stack>
      </GlobalProvider>
    </GestureHandlerRootView>
  );
}
