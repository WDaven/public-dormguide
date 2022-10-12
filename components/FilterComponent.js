import React from "react";
import {IconButton, Modal,  VStack, HStack, Text, Checkbox, Center, View, Button, Icon, PresenceTransition, Pressable} from "native-base";
import { useState } from "react";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import StarRating from "react-native-star-rating";
import { MaterialCommunityIcons } from "@expo/vector-icons"; 

function FilterComponent(props) {
    const [showModal, setShowModal] = useState(false);
    const {
        locationValues,
        setLocationValues,
        capacityValues,
        setCapacityValues,
        budgetValues,
        setBudgetValues,
        rating,
        setRating,
        applyFilter,
        clearFilter,
        preFix
    } = props;
    return (
        <View>
            <View>
                <Button onPress={() => setShowModal(true)} _pressed = {{bg:'#D3D3D3'}} style={{backgroundColor: 'transparent'}} >
                    <HStack>
                    <Icon size="sm" as={MaterialCommunityIcons} name="filter-variant" style={{color:preFix == 'Filter' ? '#FFFFFF' : '#757575'}}/>
                    <Text style={{color:'#FFFFFF'}}> {preFix} </Text>
                    </HStack>
                </Button>
            </View>
            <Center>
                <Modal isOpen={showModal} animationType="slide" onClose={() => setShowModal(false)}>
                    <Modal.Content maxWidth="350">
                        <Modal.CloseButton />
                        <Modal.Header>Filters</Modal.Header>
                        <Modal.Body>
                        <VStack space={4}>
                                <VStack space={1}>
                                    <VStack space = {0}>
                                        <HStack alignItems="center">
                                            <Icon as={MaterialCommunityIcons} name="tag-multiple-outline" color = "grey"/>
                                            <Text bold fontWeight="medium"> Budget</Text>
                                        </HStack>
                                    </VStack>
                                    <HStack alignItems="center" justifyContent="space-between">
                                        <Text color="blueGray.400">          Use slider (price per semester)</Text>
                                    </HStack>
                                    <Center>
                                        <MultiSlider
                                            values={budgetValues}
                                            isMarkersSeparated={true}
                                            min={0}
                                            max={5000}
                                            onValuesChange={(values) => setBudgetValues(values)}
                                            step={100}
                                            allowOverlap={false}
                                            minMarkerOverlapDistance={10}
                                            sliderLength={250}
                                            markerStyle={{
                                                ...Platform.select({
                                                    android: {
                                                        backgroundColor: '#3880FF'
                                                    }
                                                })
                                            }}
                                            selectedStyle={{
                                                backgroundColor: '#3880FF'
                                            }}
                                            trackStyle={{
                                                backgroundColor: '#CECECE'
                                            }}
                                        />
                                    </Center>
                                        <HStack justifyContent="space-between">
                                        <Text color="grey">Min: {budgetValues[0]}</Text>
                                        <Text color="grey">Max: {budgetValues[1]}</Text>
                                    </HStack>
                                </VStack>

                                <HStack alignItems="center" >
                                    <Icon as={MaterialCommunityIcons} name="star-outline" color = "grey" size = {8}/>
                                    <Text bold fontWeight="medium">Reviews</Text>
                                </HStack>

                                <VStack space = {0}>
                                    <HStack alignItems="center" justifyContent="space-between">
                                    <HStack>
                                    <StarRating
                                            maxStars={5}
                                            rating={rating}
                                            starSize={40}
                                            emptyStar={"star-outline"}
                                            fullStar={"star"}
                                            iconSet={"MaterialCommunityIcons"}s
                                            fullStarColor={"#3880ff"}
                                            selectedStar={(rating) => setRating(rating)}
                                    />
                                    <Text color="blueGray.400">& up</Text>
                                    </HStack>
                                    </HStack>
                                </VStack>

                                <VStack space={1}>
                                    <VStack space={0}>
                                        <HStack alignItems="center">
                                            <Icon as={MaterialCommunityIcons} name="map-marker-outline" color = "grey"/>
                                            <Text bold fontWeight="medium">Location</Text>
                                        </HStack>
                                        <HStack alignItems="center" justifyContent="space-between">
                                            <Text color="blueGray.400">         Select 1 or more</Text>
                                        </HStack>
                                    </VStack>
                                    <HStack alignItems="center" justifyContent="space-between" marginLeft={30}>
                                        <Checkbox.Group onChange={setLocationValues} value={locationValues} accessibilityLabel="choose numbers">
                                            <Checkbox value="East">East</Checkbox>
                                            <Checkbox value="West">West</Checkbox>
                                            <Checkbox value="North">North</Checkbox>
                                        </Checkbox.Group>
                                    </HStack>
                                </VStack>

                                <VStack space = {1}>
                                    <VStack space = {0}>
                                        <HStack alignItems="center">
                                            <Icon as={MaterialCommunityIcons} name="bed-single-outline" color = "grey"/>
                                            <Text bold fontWeight="medium">Beds</Text>
                                        </HStack>
                                        <HStack alignItems="center" justifyContent="space-between">
                                            <Text color="blueGray.400">         Select 1 or more</Text>
                                        </HStack>
                                    </VStack>
                                    
                                    <HStack alignItems="center" marginLeft={30}>
                                        <Checkbox.Group onChange={setCapacityValues} value={capacityValues} accessibilityLabel="choose numbers">
                                            <Checkbox value={1}>1</Checkbox>
                                            <Checkbox value={2}>2</Checkbox>
                                            <Checkbox value={3}>3</Checkbox>
                                            <Checkbox value={4}>4</Checkbox>
                                            <Checkbox value={5}>5</Checkbox>
                                            <Checkbox value={6}>6</Checkbox>
                                            <Checkbox value={7}>7</Checkbox>
                                        </Checkbox.Group>
                                    </HStack>
                                </VStack>

                                {/* <VStack space = {1}>
                                    <VStack space = {0}>
                                        <HStack alignItems="center">
                                            <Icon as={MaterialCommunityIcons} name="shower" color = "grey" size ={6}/>
                                            <Text fontWeight="medium"> Bathroom</Text>
                                        </HStack>
                                        <HStack alignItems="center" justifyContent="space-between">
                                            <Text color="blueGray.400">Select 1 or more</Text>
                                        </HStack>
                                        <HStack alignItems="center" justifyContent="space-between" paddingLeft={30}>
                                        <Checkbox.Group onChange={setBathroomValues} value={bathroomValues} accessibilityLabel="choose numbers">
                                        <Checkbox value="one" my={2}>
                                            Single
                                        </Checkbox>
                                            <Checkbox value="two">Shared - 1 other person</Checkbox>
                                            <Checkbox value="one" my={2}>
                                            Shared floor - same gender
                                        </Checkbox>
                                        </Checkbox.Group>
                                        </HStack>
                                    </VStack>
                                </VStack> */}
                            </VStack>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                    setShowModal(false);
                                    clearFilter();
                                }}>
                                    Clear
                                </Button>
                                <Button onPress={() => {
                                    setShowModal(false);
                                    applyFilter();
                                }}
                                borderRadius="20"
                                bg = "#3880FF"
                                size= "lg"
                                _text={{color: "#FFFFFF" }}
                                >
                                    Apply
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </Center>
        </View>
    )
};

export default FilterComponent;