import { Slot } from "expo-router";
import { GlobalProvider } from "./providers/GlobalProvider";
import { StyleSheet } from "react-native";

export default function AppLayout() {
  return (
    <GlobalProvider>
      <Slot styles={styles.body} />
    </GlobalProvider>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#000",
    color: "white",
  },
});
