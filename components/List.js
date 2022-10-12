import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
  Image
} from "react-native";
import PreviewPressableTile from "./PreviewPressableTile";
import { useNavigation } from '@react-navigation/native';

const Item = ({ item, navigation }) => (
  <View>
      <PreviewPressableTile
        dormName={item.name}
        dormImage={<Image source= {{ uri: item.images[0] }} alt="image" />}
        dormRating={item.avg_rating}
        num_reviews={item.num_reviews}
        capacities ={item.capacities}
        onPress={() => navigation.navigate('DetailScreen', {
          ...item
        })} 
      />
  </View>
);

const List = (props) => {
  const navigation = useNavigation();
  const renderItem = ({ item }) => {
    return <Item item={item} navigation={navigation} />;
  }
  return (
    <View style={styles.list__container}>
        <View>
          <FlatList
            contentContainerStyle ={{paddingVertical:100}}
            data={props.data}
            renderItem={renderItem}
            keyExtractor={(item) => item.name}
          />
      </View>
    </View>
  );
};

export default List;

const styles = StyleSheet.create({
  list__container: {
    height: "100%",
    width: "100%",
  },
  item: {
    margin: 30,
    borderBottomWidth: 2,
    borderBottomColor: "lightgrey"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    fontStyle: "italic",
  },
});