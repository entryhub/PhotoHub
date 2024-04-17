import { Slot, Stack } from "expo-router";
import { GlobalProvider } from "./providers/GlobalProvider";
import { StyleSheet } from "react-native";

export default function AppLayout() {
  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="AlbumItemsView" />
      </Stack>
    </GlobalProvider>
  );
}
