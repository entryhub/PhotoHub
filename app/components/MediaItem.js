import { useState, useEffect, useContext } from "react";
import { Button, Text, StyleSheet, Image, View, Pressable } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Video } from "expo-av";
import { AntDesign } from "@expo/vector-icons";
import { useGlobal } from "../providers/GlobalProvider";

export default function MediaItem({ assetInfo }) {
  const [isSelected, setIsSelected] = useState(false);
  const { setCurrentMediaItem } = useGlobal();

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
    // if(isSelectMode){
    //   setCurrentMediaItem(assetInfo);
    //   router.push("MediaView");
    // }
  }

  return (
    <View style={styles.assetContainer} onTouchStart={handlePress}>
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
    </View>
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
    borderRadius: 12,
    padding: 2,
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
