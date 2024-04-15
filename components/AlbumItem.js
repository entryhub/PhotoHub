import { useState, useEffect } from "react";
import { Button, Text, StyleSheet, Image, View, Pressable } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Video } from "expo-av";

export default function AlbumItem({ albumInfo, itemCount = 1 }) {
  const [albumAssets, setAlbumAssets] = useState([]);

  useEffect(() => {
    async function getAlbumAssets() {
      const { assets } = await MediaLibrary.getAssetsAsync({
        album: albumInfo,
        first: itemCount,
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
      });
      setAlbumAssets(assets);
    }
    getAlbumAssets();
  }, [albumInfo]);

  return (
    <Pressable style={styles.albumPreview} key={albumInfo.id}>
      <View style={styles.albumAssetsContainer}>
        {albumAssets &&
          albumAssets.map((asset) => (
            <View key={asset.id}>
              <Image
                key={asset.id}
                source={{ uri: asset.uri }}
                style={styles.assetImage}
              />
            </View>
          ))}
      </View>
      <Text style={styles.albumTitle}>{albumInfo.title}</Text>
      <Text style={styles.albumCount}>{albumInfo.assetCount}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  albumTitle: {
    color: "white",
  },
  albumCount: {
    color: "gray",
    marginBottom: 2,
  },
  albumAssetsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  assetImage: {
    width: "100%",
    aspectRatio: 1, // Keep aspect ratio
    borderRadius: "5px",
  },
  albumPreview: {
    marginBottom: 10,
    width: "32%",
  },
});
