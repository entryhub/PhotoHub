import { useState, useEffect, createContext } from "react";
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
import { Link } from "expo-router";
import { Video } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import AlbumItem from "./components/AlbumItem";
import MediaItem from "./components/MediaItem";
import AlbumView from "./AlbumView";

export const GlobalContext = createContext({});

export default function Main() {
  const [userAlbums, setUserAlbums] = useState([]);
  const [recentsAlbum, setRecentsAlbum] = useState();
  const [favoritesAlbum, setFavoritesAlbum] = useState();
  const [smartAlbums, setSmartAlbums] = useState([]);
  // const [accessGiven, setAccessGiven] = useState(false);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  async function getAlbums() {
    if (permissionResponse.status !== "granted") {
      await requestPermission();
      // setAccessGiven(true);
    }

    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });

    setUserAlbums(fetchedAlbums.filter((item) => item.type !== "smartAlbum"));
    setRecentsAlbum(fetchedAlbums.filter((item) => item.title == "Recents")[0]);
    setFavoritesAlbum(
      fetchedAlbums.filter((item) => item.title == "Favorites")[0]
    );
  }

  useEffect(() => {
    getAlbums();
  }, []);

  return (
    <View style={styles.body}>
      <Button onPress={getAlbums} title="Get albums" />
      <ScrollView>
        <View style={styles.albumsGrid}>
          {userAlbums &&
            userAlbums.map((albumInfo) => (
              <AlbumItem key={albumInfo.id} albumInfo={albumInfo} />
            ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#000",
  },
  albumsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  itemsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "2px",
  },
});
