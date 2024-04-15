import { useState, useEffect, useContext } from "react";
import { Button, Text, StyleSheet, Image, View, Pressable } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Video } from "expo-av";
import { AntDesign } from "@expo/vector-icons";
import { GlobalContext } from "../App";

export default function MediaItem({ assetInfo, onPress }) {
  const [isSelected, setIsSelected] = useState(false);

  const { userAlbums, userAlbumsSet } = useContext(GlobalContext);

  function formatDuration(seconds) {
    seconds = Math.floor(seconds);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US").replaceAll("/", ".");
  }

  function handlePress() {
    setIsSelected(!isSelected);
    onPress(assetInfo);
  }

  return (
    <Pressable
      key={assetInfo.id}
      style={styles.assetContainer}
      onPress={handlePress}
    >
      <Image
        key={assetInfo.id}
        source={{ uri: assetInfo.uri }}
        style={styles.assetImage}
      />
      {assetInfo.mediaType === "video" && !isSelected ? (
        <>
          <Text style={styles.videoInfo}>
            {formatDuration(assetInfo.duration)}
          </Text>
          {/* <Text style={styles.videoDate}>{formatDate(assetInfo.creationTime)}</Text> */}
        </>
      ) : null}
      {isSelected && (
        <AntDesign
          style={styles.checkSymbol}
          name="checkcircle"
          size={20}
          color="dodgerblue"
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  assetContainer: {
    position: "relative",
    width: "32.9%",
  },
  assetImage: {
    width: "100%",
    aspectRatio: 1, // Keep aspect ratio
  },
  checkSymbol: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "10px",
    overflow: "hidden",
  },
  videoInfo: {
    position: "absolute",
    color: "white",
    padding: 8,
    bottom: 0,
    right: 0,
  },
  videoDate: {
    position: "absolute",
    color: "white",
    padding: 8,
    bottom: 0,
    left: 0,
  },
  iconStyles: {},
});
