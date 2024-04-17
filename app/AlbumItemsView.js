import { useState, useEffect } from "react";
import {
  Button,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Platform,
  Pressable,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import MediaItem from "./components/MediaItem";
import { Link } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useGlobal } from "./providers/GlobalProvider";

export default function AlbumItemsView({ userAlbums = [], itemCount = 500 }) {
  const { currentAlbum } = useGlobal();

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [albumAssets, setAlbumAssets] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    async function getAlbumAssets() {
      const { assets } = await MediaLibrary.getAssetsAsync({
        album: currentAlbum,
        first: itemCount,
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
        // sortBy: [MediaLibrary.SortBy.duration]
      });

      if (currentAlbum.title == "Recents") {
        const promises = userAlbums.map(
          async (item) =>
            await MediaLibrary.getAssetsAsync({
              album: item,
              first: 100,
              mediaType: [
                MediaLibrary.MediaType.photo,
                MediaLibrary.MediaType.video,
              ],
            })
        );
        const results = await Promise.all(promises);
        const items = results.flatMap((obj) => obj.assets);
        const filteredAssets = assets.filter(
          ({ id }) => !items.some((obj) => obj.id === id)
        );
        setAlbumAssets(filteredAssets);
        // await MediaLibrary.createAlbumAsync('testing');
        // await MediaLibrary.addAssetsToAlbumAsync(assets, 'testing')
      } else {
        setAlbumAssets(assets);
      }
    }
    getAlbumAssets();
  }, [currentAlbum]);

  function addToAlbum() {
    MediaLibrary.addAssetsToAlbumAsync("assetsArray", "album");
  }

  function createAlbum() {
    MediaLibrary.createAlbumAsync("albumName", "asset");
  }

  return (
    <>
      <Pressable style={s.selectButton}>
        <Text style={s.selectButtonText}>
          {isSelectMode ? "cancel" : "  select"}
        </Text>
      </Pressable>
      <ScrollView>
        <View style={s.itemsWrapper}>
          {albumAssets.map((assetInfo, index) => (
            <MediaItem key={assetInfo.id} assetInfo={assetInfo} />
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const s = StyleSheet.create({
  itemsWrapper: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
  },
  selectButton: {
    position: "absolute",
    zIndex: 10,
    right: 20,
    top: 50,
  },
  selectButtonText: {
    color: "white",
  },
});
