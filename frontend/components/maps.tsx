import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

interface PropsMaps {
  currentLocation: { latitude: number; longitude: number } | null;
  lokasiMangrove: any[];
}

export default function Maps({ currentLocation, lokasiMangrove }: PropsMaps) {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: currentLocation?.latitude || -7.0,
          longitude: currentLocation?.longitude || 113.5,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      >
        {currentLocation && (
          <Marker coordinate={currentLocation} pinColor="green" />
        )}

        {lokasiMangrove.map((loc, idx) => (
          <Marker
            key={idx}
            coordinate={{
              latitude: parseFloat(loc.lat),
              longitude: parseFloat(loc.lng),
            }}
            title={loc.nama_lokasi}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  map: { width: "100%", height: 400, borderRadius: 50 },
});
