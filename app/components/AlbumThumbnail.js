import { useState, useEffect } from "react";
import { Button, Text, StyleSheet, Image, View, Pressable } from "react-native";
import { Link, router } from "expo-router";
import * as MediaLibrary from "expo-media-library";
import { Video } from "expo-av";
import { useGlobal } from "../providers/GlobalProvider";

export default function AlbumThumbnail({ albumInfo, itemCount = 1 }) {
  const [albumAssets, setAlbumAssets] = useState([]);
  const { setCurrentAlbum } = useGlobal();

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
    <Pressable
      href="AlbumItemsView"
      style={styles.albumPreview}
      onPress={() => {
        setCurrentAlbum(albumInfo);
        router.push("AlbumItemsView");
      }}
    >
      <View style={styles.albumThumbnailWrapper}>
        {albumAssets.map((asset) => (
          <Image
            key={asset.id}
            source={{ uri: asset.uri }}
            style={styles.assetImage}
          />
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
  albumThumbnailWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  assetImage: {
    width: "100%",
    aspectRatio: 1, // Keep aspect ratio
    borderRadius: 12,
  },
  albumPreview: {
    marginBottom: 10,
  },
});
