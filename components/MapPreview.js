import React, { useState, useEffect } from "react";
import { AspectRatio, Pressable, Text, Box, HStack, VStack, View, Icon } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons"; 
import StarRating from "react-native-star-rating";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MapPreview(props) {
  const [favorite, setFavorite] = useState('0');
  const { onPress, dormName, dormImage, dormRating, dormLocation, num_reviews, shouldUpdate } = props;

  const getFavoriteData = async () => {
    try {
      const value = await AsyncStorage.getItem(dormName.toLowerCase().split(" ").join("-"));
      if (value !== null) {
        setFavorite(value);
      } else {
        await storeFavoriteData('0');
      }
    } catch(error) {
      console.log(error);
    }
  }

  const storeFavoriteData = async (value) => {
    try {
      await AsyncStorage.setItem(dormName.toLowerCase().split(" ").join("-"), value);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getFavoriteData();
  }, [shouldUpdate]);

  return ( 
      <Box alignItems="center" paddingLeft={15} paddingRight= {15} >
        <Pressable onPress={onPress}>
          <Box bg="#FFFFFF"  rounded="15" p = {2.5}>
              <HStack>
                <View rounded="20" overflow= "hidden" alignItems={'center'}  justifyContent={'center'}>
                    <AspectRatio w='75' ratio={1/1} >
                    {dormImage}
                    </AspectRatio>
                </View>
                  <VStack alignItems={"flex-start"} paddingLeft={5}>
                  <Text fontWeight={'bold'} fontSize={'lg'}>
                    {dormName}
                  </Text>
                  <HStack alignItems={'center'}  justifyContent={'center'}>
                    <Icon
                      as={MaterialCommunityIcons}
                        size="xs"
                        color={'#DA0000'}
                        name="map-marker-outline"/>
                    <Text color={'#BDBDBD'} fontSize='md'>
                      {dormLocation}
                    </Text>

                  </HStack>
                  <HStack alignItems={'center'}  justifyContent={'center'}>
                    <Icon
                      as={MaterialCommunityIcons}
                        size="xs"
                        color={'#DA0000'}
                        name="star"/>
                      <HStack>
                        <Text color={'#DA0000'} fontSize='lg'>
                          {(Math.round(10 * dormRating) / 10).toFixed(1)} 
                        </Text>
                        <Text color={'#000000'} fontSize='lg' paddingLeft={2}>
                          ({num_reviews})
                        </Text>
                      </HStack>

                  </HStack>
                  </VStack>
                  <View paddingLeft={7}>
                    <StarRating
                              maxStars={1}
                              rating={parseInt(favorite)}
                              starSize={30}
                              emptyStar={"heart-outline"}
                              fullStar={"heart"}
                              iconSet={"MaterialCommunityIcons"}
                              fullStarColor={"#3880ff"}
                              selectedStar={() => {
                                const newFavorite = favorite == '0' ? '1' : '0';
                                setFavorite(newFavorite);
                                storeFavoriteData(newFavorite);
                              }}/>
                    </View>
              </HStack>

          </Box>
        </Pressable>
    </Box>
  );
}
