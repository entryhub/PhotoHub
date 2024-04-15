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
import { Video } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import AlbumItem from "./components/AlbumItem";
import MediaItem from "./components/MediaItem";
import AlbumView from "./pages/AlbumView";

export const GlobalContext = createContext({});

export default function App() {
  const [userAlbums, setUserAlbums] = useState([]);
  const [recentsAlbum, setRecentsAlbum] = useState();
  const [favoritesAlbum, setFavoritesAlbum] = useState();
  const [smartAlbums, setSmartAlbums] = useState([]);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  async function getAlbums() {
    if (permissionResponse.status !== "granted") {
      await requestPermission();
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

  // useEffect(() => {
  //   getRecents();
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Button onPress={getAlbums} title="Get albums" />
      {/* <ScrollView>
        <View style={styles.albumsGrid}>
         {userAlbums && userAlbums.map((albumInfo) => (
            <AlbumPreview
              style={styles.albumPreview} 
              key={albumInfo.id} 
              albumInfo={albumInfo} 
              onPress={()=>openAlbumView}/>
         ))}
        </View>
      </ScrollView> */}
      {recentsAlbum && (
        <AlbumView albumInfo={recentsAlbum} userAlbums={userAlbums}></AlbumView>
      )}
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
  itemsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "2px",
  },
});
