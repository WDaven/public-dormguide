import React from "react";
import { HStack, VStack, IconButton, Icon, Input, Text, Button, View  } from "native-base";
import FilterComponent from "../components/FilterComponent";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SearchFilter = (props) => {
    const {
        onPress,
        searchPhrase,
        setSearchPhrase,
        abtnTxt,
        locationValues,
        setLocationValues,
        capacityValues,
        setCapacityValues,
        budgetValues,
        setBudgetValues,
        rating,
        setRating,
        applyFilter,
        clearFilter
    } = props;
    return (
        <VStack >
            <Input placeholder="Search dorms" variant="filled" bg ="#FFFFFF" _focus = {{bg:'#FFFFFF'}}
                width="100%" borderRadius="20" py="1" px="2" borderWidth="1" size = "lg" 
                InputLeftElement={
                    <IconButton
                        icon={<Icon size="sm" as={MaterialCommunityIcons} name="magnify" color='#757575' />}
                        _pressed = {{bg:'#D3D3D3'}}
                    />
                } 
                InputRightElement={
                    <FilterComponent
                        locationValues={locationValues}
                        setLocationValues={setLocationValues}
                        capacityValues={capacityValues}
                        setCapacityValues={setCapacityValues}
                        budgetValues={budgetValues}
                        setBudgetValues={setBudgetValues}
                        rating={rating}
                        setRating={setRating}
                        applyFilter={applyFilter}
                        clearFilter={clearFilter}
                    />
                } 
                value={searchPhrase}
                onChangeText={setSearchPhrase}
            />
            <HStack marginTop={2} style={{ justifyContent: "center", alignItems: "center" }}>
                <View style = {{width:"50%"}}>
                    <Button
                        borderRadius="20"
                        onPress={onPress}
                        bg = "#3880FF"
                        size= "lg"
                        startIcon={<Icon size="sm" as={MaterialCommunityIcons} name="map-marker-outline" color='#FFFFFF' />}>
                            <Text color = "#FFFFFF"> {abtnTxt} </Text>
                    </Button>
                </View>
            </HStack>
        </VStack>
    );
}

export default SearchFilter;