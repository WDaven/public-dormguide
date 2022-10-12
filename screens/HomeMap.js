import { Text, View } from "react-native";
import { Button, ScrollView, FlatList} from "native-base";
import { StyleSheet, Platform, StatusBar, Image } from "react-native";
import { HStack, VStack, IconButton, Icon, Input, AspectRatio } from "native-base";
import Constants from 'expo-constants';
const statusBarHeight = Constants.statusBarHeight
import React, { useState, useEffect, useCallback } from "react";
import MapComponent from "../components/MapComponent";
import SearchFilter from"../components/SearchFilter";
import { useNavigation } from "@react-navigation/native";
import MapPreview from "../components/MapPreview";
import FilterComponent from "../components/FilterComponent";
import * as SplashScreen from 'expo-splash-screen';
import Loading from "../components/Loading";

function HomeMapScreen ()  {
    const [dormData, setDormData] = useState([]);
    const [dormDataCopy, setDormDataCopy] = useState([]);
    const [searchPhrase, setSearchPhrase] = useState("");
    const navigation = useNavigation();

    const [locationValues, setLocationValues] = useState([]);
    const [capacityValues, setCapacityValues] = useState([]);
    const [budgetValues, setBudgetValues] = useState([0, 6000]);
    const [rating, setRating] = useState(0);

    const [index, setIndex] = React.useState(0);
    const ref = React.useRef(null);
    const mapRef = React.useRef(null);
    const markersRef = React.useRef(Array.apply(null, Array(48)).map(function () {}));
    const onViewRef = React.useRef((viewableItems) => {
        try {
            mapRef.current.animateCamera({
                center: {
                    latitude: viewableItems.viewableItems[0].item.latitude,
                    longitude: viewableItems.viewableItems[0].item.longitude
                }
            })
            markersRef.current[viewableItems.viewableItems[0].index].showCallout();
        } catch (error) {
            console.log(error);
        }
    });
    const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 80, minimumViewTime: 100, waitForInteraction: true })

    const handleSearchPhraseChange = (text) => {
        setSearchPhrase(text);
        applyFilter(text);
    }

    const scrollToIndexFailed = (error) => {
        const offset = error.averageItemLength * error.index;
        this.flatListRef.scrollToOffset({offset});
        setTimeout(() => this.flatListRef.scrollToIndex({ index: error.index }), 100); // You may choose to skip this line if the above typically works well because your average item height is accurate.
    }

    const applyFilter = (text=searchPhrase) => {
        const filteredData = dormDataCopy.filter(dorm => {
            const searchPredicate = text == "" || dorm.name.toUpperCase().includes(text.toUpperCase().trim().replace(/\s/g, ""));
            const locationPredicate = locationValues.length == 0 || locationValues.includes(dorm.location);
            const capacityPredicate = capacityValues.length == 0
                                    || capacityValues.some(capacity => dorm.capacities.includes(capacity))
                                    || (capacityValues.includes(4) && dorm.capacities.some(capacity => capacity > 4));
            const budgetPredicate = budgetValues[0] <= dorm.price_per_sem && dorm.price_per_sem <= budgetValues[1];
            const ratingPredicate = rating == 0 || dorm.avg_rating >= rating;
            return searchPredicate && locationPredicate && capacityPredicate && budgetPredicate && ratingPredicate;
        });
        setDormData(filteredData);
        setIndex(0);
    }

    const clearFilter = () => {
        setLocationValues([]);
        setCapacityValues([]);
        setBudgetValues([0, 6000]);
        setRating(0);
        const filteredData = dormDataCopy.filter(dorm => {
            return searchPhrase == "" || dorm.name.toUpperCase().includes(searchPhrase.toUpperCase().trim().replace(/\s/g, ""));
        });
        setDormData(filteredData);
    }

    const [shouldUpdate, setShouldUpdate] = useState(0);
    const forceUpdate = () => {
        setShouldUpdate(prev => prev + 1);
    }
    const fetchDorm = async (dorm) => {
        const response = await fetch("https://us-central1-mas-project-4261.cloudfunctions.net/app/dorms/" + dorm);
        return await response.json();
    }

    const [appIsReady, setAppIsReady] = useState(false)

    const fetchDorms = async () => {
        const apiResponse = await fetch("https://us-central1-mas-project-4261.cloudfunctions.net/app/dorms");
        const data = await apiResponse.json();
        setDormData(data.map(item => {return {...item, fetchDormData: fetchDorm}}));
        setDormDataCopy(data.map(item => {return {...item, fetchDormData: fetchDorm}}));
        setAppIsReady(true);
    }

    useEffect(() => {
        fetchDorms();
    }, []);

    return (
        <View height='100%' width='100%'>
            { !appIsReady ? <Loading/> : 
            <View height='100%' width='100%'>
                <MapComponent dormData={dormData} aref={ref} mapRef={mapRef} markersRef={markersRef}></MapComponent>
                <View style={{ position: 'absolute', top: statusBarHeight + 10, alignItems: "center" }} width='100%'>
                    <View style = {{ alignSelf:"center", justifyContent:"center"}} width='80%'>
                        <SearchFilter 
                            onPress={() => navigation.navigate({name: 'HomeList', params: {dormData: dormDataCopy}}) }
                            abtnTxt = "Go to list view"
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
                <View style={{ position: 'absolute', bottom: '20%', alignSelf: "flex-end", overflow: 'hidden', borderRadius:20, width:120, paddingRight:15}} >
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
                <View style={{ margin: 0, height: '13%' , bottom: '5%', position: 'absolute', width: '100%', alignItems:'center', justifyContent:'center' }}>
                <FlatList
                    initialScrollIndex={index}
                    ref={ref}
                    onScrollToIndexFailed={scrollToIndexFailed}
                    horizontal showsHorizontalScrollIndicator = {false} minHeight='100' height={'100'}                  
                    data={dormData}
                    initialNumToRender ={48}
                    viewabilityConfig={viewConfigRef.current}
                    onViewableItemsChanged={onViewRef.current}
                    scrollEventThrottle={2}
                    renderItem={({ item, index: index }) => (
                        <MapPreview
                            dormName={item.name}
                            dormImage={<Image source= {{ uri: item.images[0] }} alt="image" borderRadius={15} />}
                            dormRating={item.avg_rating} 
                            onPress={() => navigation.navigate('DetailScreen', {...item, forceUpdate: forceUpdate })}
                            dormLocation={item.location}
                            num_reviews={item.num_reviews} 
                            aref={ref}
                            index={index}
                            shouldUpdate={shouldUpdate}
                        />
                    )}
                />
                </View>
            </View>}
        </View>
    );
}

export default HomeMapScreen;