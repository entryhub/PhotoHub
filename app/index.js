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
import AlbumThumbnail from "./components/AlbumThumbnail";
import MediaItem from "./components/MediaItem";
import AlbumItemsView from "./AlbumItemsView";
import { GlobalProvider } from "./providers/GlobalProvider";

export const GlobalContext = createContext({});

export default function Main() {
  const [userAlbums, setUserAlbums] = useState([]);
  const [recentsAlbum, setRecentsAlbum] = useState({});
  const [favoritesAlbum, setFavoritesAlbum] = useState({});
  const [smartAlbums, setSmartAlbums] = useState([]);
  // const [accessGiven, setAccessGiven] = useState(false);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  async function getAlbums() {
    if (permissionResponse?.status !== "granted") {
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
    <SafeAreaView style={styles.body}>
      <View>
        <Pressable style={styles.accessButton} onPress={getAlbums}>
          <Text style={styles.accessButtonText}>Access Photos</Text>
        </Pressable>
      </View>
      <ScrollView>
        <View style={styles.albumsGrid}>
          <View style={styles.thumbnailsTop}>
            <AlbumThumbnail albumInfo={recentsAlbum} />
          </View>
          <View style={styles.thumbnailsTop}>
            <AlbumThumbnail albumInfo={favoritesAlbum} />
          </View>
        </View>
        <View style={styles.albumsGrid}>
          {userAlbums.map((albumInfo) => (
            <View style={styles.thumbnailsInGrid}>
              <AlbumThumbnail key={albumInfo.id} albumInfo={albumInfo} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#000",
    height: "100%",
  },
  albumsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  accessButtonText: {
    color: "white",
  },
  accessButton: {
    // position: "absolute",
    // top: "50%",
    // left: "50%",
  },
  thumbnailsInGrid: {
    width: "32%",
  },
  thumbnailsTop: {
    width: "48%",
  },
  topWrapper: {
    display: "flex",
    flexDirection: "row",
  },
});
