import React from "react";
import { AspectRatio, Pressable, Text, Box, HStack, View, Icon } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function PreviewPressableTile(props) {
  const { onPress, dormName, dormImage, dormRating, num_reviews, capacities } = props;
  return ( 
      <Box alignItems="center" paddingTop={2} overflow="hidden" >

        <Pressable onPress={onPress}>
          <Box maxW="96"   p="5" rounded="8" overflow={'hidden'}>
            <View borderTopRadius={20} overflow= "hidden" alignItems={'center'}  justifyContent={'center'}>
                    <AspectRatio w='100%' ratio={1.8} >
                      {dormImage}
                    </AspectRatio>
            </View>
          <Box borderBottomRadius={20} borderBottomWidth={1} borderLeftWidth={1} borderRightWidth={1} height={70} borderColor="#BDBDBD">
            <HStack justifyContent={"space-between"} alignItems={"center"} paddingLeft={5}>
              <Text fontSize='xl' fontWeight={'bold'}>
                {dormName}
              </Text>
              <HStack justifyContent={"center"} alignItems={'center'} paddingRight={5} >
                <Icon
                  as={MaterialCommunityIcons}
                    size="xs"
                    color={'#DA0000'}
                    name="star"/>
                <Text color={'#DA0000'} fontSize='lg' fontWeight={'bold'}>
                  {(Math.round(10 * dormRating) / 10).toFixed(1)} 
                </Text>
                <Text color={'#000000'} fontSize='lg' paddingLeft={2}>
                  ({num_reviews})
                </Text>
                </HStack>
            </HStack>
            <HStack  alignItems={"center"} paddingLeft={5} >
              {capacities.map((beds, index ) => {
                            if (index != capacities.length -1) {
                              return (
                                <HStack alignItems={"center"}>
                                  <Text fontSize='lg'>
                                    {beds}
                                  </Text>
                                  <Text>
                                    {', '}
                                  </Text>
                                </HStack>
                              )
                            }
                            else {
                              return (
                                <HStack alignItems={"center"}>
                                  <Text fontSize='lg'>
                                    {beds}
                                  </Text>
                                  <Text>
                                    {' '}
                                  </Text>
                                </HStack>
                              )

                            }
                            })
                                }
              <Text fontSize={'lg'} >
                 beds
              </Text>
            </HStack>
          </Box>
          </Box>
        </Pressable>
    </Box>
  );
}
