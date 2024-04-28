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

import { useState, useEffect, useMemo, useRef } from "react";
import * as MediaLibrary from "expo-media-library";
import MediaItem from "./components/MediaItem";
import { Link, Stack } from "expo-router";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useGlobal } from "./providers/GlobalProvider";
import { BlurView } from "expo-blur";
import BottomSheet from "@gorhom/bottom-sheet";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

export default function AlbumItemsView({ userAlbums = [], itemCount = 100 }) {
  const { currentAlbum } = useGlobal("");
  const { isSelectMode } = useGlobal();
  const { setIsSelectMode } = useGlobal();
  const { setCurrentMediaItem } = useGlobal();

  const [albumAssets, setAlbumAssets] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [snapIndex, setSnapIndex] = useState(0);
  const [sortBy, setSortBy] = useState("default");

  const snapPoints = useMemo(() => ["10%", "41%"], []);
  const bottomSheetRef = useRef(null);

  const handleClosePress = () => bottomSheetRef.current?.close();
  const handleOpenPress = () => bottomSheetRef.current?.expand();
  const animRotateButton = useSharedValue("0deg");

  useEffect(() => {
    getAlbumAssets();
  }, [currentAlbum]);

  async function getAlbumAssets() {
    const { assets } = await MediaLibrary.getAssetsAsync({
      album: currentAlbum,
      first: itemCount,
      mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
      sortBy: [sortBy],
    });

    if (currentAlbum.title == "Recents") {
      const promises = userAlbums.map(
        async (item) =>
          await MediaLibrary.getAssetsAsync({
            album: item,
            first: 200,
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
    if (isSelectMode) {
      // setSnapIndex(0);
    } else {
      // setSnapIndex(-1);
      albumAssets.forEach((item) => {
        item.isSelected = false;
      });
    }
  }

  function onSortButton() {
    setSortBy("duration");
    getAlbumAssets();
  }

  function onInputFocus() {
    setSnapIndex(1);
  }

  function handleMove(event) {
    // console.log(event);
  }

  function onBottomSheetButton() {
    if (snapIndex == 0) {
      setSnapIndex(1);
      animRotateButton.value = withSpring("135deg");
    } else {
      setSnapIndex(0);
      animRotateButton.value = withSpring("0deg");
    }
  }

  const BottomSheetBackground = ({ style }) => {
    return (
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        tint="systemThinMaterialDark"
        style={[
          style,
          {
            overflow: "hidden",
            borderRadius: snapIndex == 1 ? 15 : 0,
          },
        ]}
      />
    );
  };

  const HandleComponent = () => (
    <View style={styles.handleContainer}>
      <View style={{ width: 45 }}></View>
      {snapIndex == 1 ? (
        <TextInput
          style={styles.albumInput}
          keyboardAppearance="dark"
          placeholderTextColor="white"
          placeholder="New Album..."
          onFocus={onInputFocus}
        ></TextInput>
      ) : null}

      <Pressable onPress={onBottomSheetButton}>
        <Animated.View style={{ transform: [{ rotate: animRotateButton }] }}>
          <Feather
            style={styles.addIcon}
            name="plus-circle"
            size={24}
            color="white"
          />
        </Animated.View>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.body}>
      <Stack.Screen
        options={{
          title: currentAlbum.title,
          headerTransparent: true,
          headerRight: () => (
            <>
              <Pressable onPress={onSelectButton} style={styles.selectButton}>
                <BlurView tint="systemThinMaterialDark">
                  <Text style={styles.selectButtonText}>
                    {isSelectMode ? "cancel" : "select"}
                  </Text>
                </BlurView>
              </Pressable>
              <Pressable onPress={onSortButton}>
                <MaterialCommunityIcons
                  name="sort-clock-ascending-outline"
                  size={24}
                  color="white"
                />
              </Pressable>
            </>
          ),
        }}
      />

      <ScrollView fadingEdgeLength={100} onTouchMove={handleMove}>
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

      <BottomSheet
        backgroundComponent={BottomSheetBackground}
        index={snapIndex}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        handleIndicatorStyle={{ display: "none" }}
        handleComponent={HandleComponent}
      ></BottomSheet>
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
  selectButton: {
    borderRadius: 15,
    marginRight: 10,
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
  addIcon: {
    margin: 10,
  },
  handleContainer: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 6,
    alignItems: "center",
    with: "100%",
    justifyContent: "space-between",
  },
  albumInput: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    color: "white",
    borderRadius: 10,
    padding: 10,
    height: 40,
    width: 200,
  },
});
