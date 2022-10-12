import React, {useEffect, useState} from 'react';
import MapView, { PROVIDER_GOOGLE }  from 'react-native-maps';
import { StyleSheet,  View, Dimensions, Text } from 'react-native';
import { Marker } from 'react-native-maps'; 

  
export default function MapComponent(props) { 
  return ( 
    <View style={styles.container} >
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={props.mapRef}
        style={styles.map} 
        initialRegion={{
          latitude: 33.776684,
          longitude: -84.398471,
          latitudeDelta: 0.0422,
          longitudeDelta: 0.019,
        }}>
          {props.dormData.map((marker, index) => {
            return (
              <MapView.Marker
                  key={index}
                  coordinate = {{
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                  }}
                  ref={element => props.markersRef.current[index] = element}
                  title={marker.name}
                  onPress={() => props.aref.current.scrollToIndex({animated: true, index: index})} 
              />
            )})
          }
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});