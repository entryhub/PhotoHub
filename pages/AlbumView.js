import { useState, useEffect } from "react";
import {
  Button,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import * as MediaLibrary from "expo-media-library";

export default function AlbumView({ albumInfo, userAlbums, itemCount = 5 }) {
  const [albumAssets, setAlbumAssets] = useState([]);

  useEffect(() => {
    async function getAlbumAssets() {
      const { assets } = await MediaLibrary.getAssetsAsync({
        album: albumInfo,
        first: itemCount,
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
        // sortBy: [MediaLibrary.SortBy.duration]
      });

      setAlbumAssets(assets);
    }
    getAlbumAssets();
  }, [albumInfo]);

  return (
    <ScrollView>
      {albumAssets && <View style={styles.itemsWrapper}></View>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  itemsWrapper: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "2px",
  },
});
