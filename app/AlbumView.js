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
import MediaItem from "./components/MediaItem";
import { Link } from "expo-router";

export default function AlbumView({ albumInfo, userAlbums, itemCount = 500 }) {
  const [albumAssets, setAlbumAssets] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    async function getAlbumAssets() {
      const { assets } = await MediaLibrary.getAssetsAsync({
        album: albumInfo,
        first: itemCount,
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
        // sortBy: [MediaLibrary.SortBy.duration]
      });

      if (albumInfo.title == "Recents") {
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
  }, [albumInfo]);

  function addToAlbum() {
    MediaLibrary.addAssetsToAlbumAsync("assetsArray", "album");
  }

  function createAlbum() {
    MediaLibrary.createAlbumAsync("albumName", "asset");
  }

  function handlePress(asset) {
    console.log(asset);
  }

  return (
    <ScrollView>
      {albumAssets && (
        <View style={styles.itemsWrapper}>
          {albumAssets &&
            albumAssets.map((assetInfo, index) => (
              <Link
                href={{
                  pathname: "MediaView",
                  params: { assetInfo, albumAssets },
                }}
              >
                <MediaItem
                  key={index}
                  assetInfo={assetInfo}
                  onPress={handlePress}
                />
              </Link>
            ))}
        </View>
      )}
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