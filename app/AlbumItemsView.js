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
import { Link, Stack } from "expo-router";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useGlobal } from "./providers/GlobalProvider";
import { BlurView } from "expo-blur";

export default function AlbumItemsView({ userAlbums = [], itemCount = 500 }) {
  const { currentAlbum } = useGlobal();
  const { isSelectMode } = useGlobal();
  const { setIsSelectMode } = useGlobal();
  const { setCurrentMediaItem } = useGlobal();

  const [albumAssets, setAlbumAssets] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  //// Remove navigation header
  // const navigation = useNavigation();
  // useEffect(() => {
  //   navigation.setOptions({ headerShown: false });
  // }, [navigation]);

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

  function handleItemPress(assetInfo, isSelected) {
    if (isSelectMode) {
      let selectedAsset = albumAssets.find((item) => item.id == assetInfo.id);
      selectedAsset.isSelected = isSelected;
    } else {
      setCurrentMediaItem(assetInfo);
      router.push("MediaView");
    }

    console.log("album asset", albumAssets[0]);
  }

  function onSelectButton() {
    setIsSelectMode(!isSelectMode);
    if (!isSelectMode) {
      albumAssets.forEach((item) => {
        item.isSelected = false;
      });
    }
  }

  return (
    <View style={styles.body}>
      <Stack.Screen
        options={{
          title: currentAlbum.title,
          headerTransparent: true,
          headerRight: () => (
            <Pressable onPress={onSelectButton} style={styles.selectButton}>
              <BlurView style={styles.selectButtonBlur}>
                <Text style={styles.selectButtonText}>
                  {isSelectMode ? "cancel" : "select"}
                </Text>
              </BlurView>
            </Pressable>
          ),
        }}
      />

      <ScrollView fadingEdgeLength={100}>
        <View style={styles.headerSpace}></View>
        <View style={styles.itemsWrapper}>
          {albumAssets.map((assetInfo) => (
            <MediaItem
              _onPress={(isSelected) => handleItemPress(assetInfo, isSelected)}
              key={assetInfo.id}
              assetInfo={assetInfo}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#000",
    height: "100%",
  },
  itemsWrapper: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
  },
  selectButtonBlur: {},
  selectButton: {
    borderRadius: 15,
    overflow: "hidden",
  },
  selectButtonText: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: "white",
  },
  headerSpace: {
    height: 100,
  },
});
