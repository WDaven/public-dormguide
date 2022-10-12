import { Image, Text, View, ScrollView, VStack, Input, IconButton, Icon, HStack, Button } from "native-base";
import {ActivityIndicator, Platform} from "react-native"
import Constants from 'expo-constants';
const statusBarHeight = Constants.statusBarHeight
import React, { useState, useEffect } from "react";
import SearchFilter from"../components/SearchFilter";
import List from "../components/List";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AdMobBanner } from 'expo-ads-admob'
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FilterComponent from "../components/FilterComponent";
import Animation from "../components/Animation";

function HomeListScreen ()  {
    const [searchPhrase, setSearchPhrase] = useState("");
    const navigation = useNavigation();
    const route = useRoute();
    const { dormData } = route.params;

    const [data, setData] = useState(dormData);
    const [locationValues, setLocationValues] = useState([]);
    const [capacityValues, setCapacityValues] = useState([]);
    const [budgetValues, setBudgetValues] = useState([0, 6000]);
    const [rating, setRating] = useState(0);

    const handleSearchPhraseChange = (text) => {
        setSearchPhrase(text);
        applyFilter(text);
    }

    const applyFilter = (text=searchPhrase) => {
        const filteredData = dormData.filter(dorm => {
            const searchPredicate = text == "" || dorm.name.toUpperCase().includes(text.toUpperCase().trim().replace(/\s/g, ""));
            const locationPredicate = locationValues.length == 0 || locationValues.includes(dorm.location);
            const capacityPredicate = capacityValues.length == 0
                                    || capacityValues.some(capacity => dorm.capacities.includes(capacity))
                                    || (capacityValues.includes(4) && dorm.capacities.some(capacity => capacity > 4));
            const budgetPredicate = budgetValues[0] <= dorm.price_per_sem && dorm.price_per_sem <= budgetValues[1];
            const ratingPredicate = rating == 0 || dorm.avg_rating >= rating;
            return searchPredicate && locationPredicate && capacityPredicate && budgetPredicate && ratingPredicate;
        });
        setData(filteredData);
    }

    const clearFilter = () => {
        setLocationValues([]);
        setCapacityValues([]);
        setBudgetValues([0, 6000]);
        setRating(0);
        const filteredData = dormData.filter(dorm => {
            return searchPhrase == "" || dorm.name.toUpperCase().includes(searchPhrase.toUpperCase().trim().replace(/\s/g, ""));
        });
        setData(filteredData);
    }

    return (
        <View style={{ paddingTop:statusBarHeight }} >
            
            <View style={{ position: 'absolute', top: statusBarHeight + 10, alignItems: "center", zIndex: 9999999 }} width='100%' >
                    <View style = {{ alignSelf:"center", justifyContent:"center"}} width='80%'>
                        <SearchFilter
                            onPress={() => navigation.navigate('HomeMap')}
                            abtnTxt="Go to map view"
                            _pressed = {{bg:'#D3D3D3'}}
                            searchPhrase={searchPhrase}
                            setSearchPhrase={handleSearchPhraseChange}
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
                    </View>

            </View>
            <View style={{ position: 'absolute', bottom: '11%', alignSelf: "flex-end", overflow: 'hidden', borderRadius:20, width:110, paddingRight:15, zIndex: 9999999}} >
                    <View style={{ backgroundColor: '#3880FF', borderRadius:'20', overflow: 'hidden', borderRadius:20}} >
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
                                preFix ='Filter'
                        />
                 </View>
                 </View>
            
            {/* <View style = {{margin: 0, height: '12%' ,bottom:'0%', position: 'absolute', width: '100%', alignItems:'center', justifyContent:'flex-end', zIndex: 9999999 }}>
                <AdMobBanner
                    bannerSize="fullBanner"
                    adUnitID= {Platform.OS=== 'ios'? ""}
                    // Test ID, Replace with your-admob-unit-id
                    servePersonalizedAds />
            </View> */}
            
            {data.length == 0 && <Animation style={{marginTop: "50%"}} text={"No dorms fit your criteria"}/>}
            <View style ={{ alignItems:"center", }} height='100%'>
                {!dormData
                    ? (<ActivityIndicator size="large" />)
                    : (<List searchPhrase={searchPhrase} data={data}/>)
                }
            </View>
        </View>
    );
}

export default HomeListScreen;