import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { useGlobal } from "./providers/GlobalProvider";
import Animated from "react-native-reanimated";
import { Stack } from "expo-router";
//draw given image asset uri in the cented with fullscreen
export default function MediaView() {
  const { currentMediaItem } = useGlobal();

  return (
    <View style={styles.pageBody}>
      <Image source={{ uri: currentMediaItem.uri }} style={styles.assetImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  pageBody: {
    backgroundColor: "#000",
    height: "100%",
  },
  assetImage: {
    width: "100%",
    aspectRatio: 1, // Keep aspect ratio
  },
});
