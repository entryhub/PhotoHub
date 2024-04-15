import { useState, useEffect } from "react";
import {
  Button,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  View,
  Platform,
  Pressable,
} from "react-native";
import { Video } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import AlbumPreview from "./components/AlbumPreview";
import MediaItem from "./components/MediaItem";
import AlbumView from "./pages/AlbumView";

export default function App() {
  const [userAlbums, setUserAlbums] = useState([]);

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  async function getAlbums() {
    if (permissionResponse.status !== "granted") {
      await requestPermission();
    }
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });
    setUserAlbums(fetchedAlbums.filter((item) => item.type !== "smartAlbum"));
  }

  // useEffect(() => {
  //   getRecents();
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Button onPress={getAlbums} title="Get albums" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 40 : 0,
    backgroundColor: "#000",
  },
  albumsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
