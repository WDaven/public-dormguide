import { View } from "native-base";
import { ActivityIndicator } from "react-native"
import React, { useState, useEffect } from "react";
import List from "../components/List";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FavoritesScreen() {
    // const [dormData, setDormData] = useState([]);
    // const [shouldUpdate, setShouldUpdate] = useState(0);
    // const forceUpdate = () => {
    //     setShouldUpdate(prev => prev + 1);
    // }

    // const filterFavoriteDorms = async (dorms) => {
    //     const favorites = await Promise.all(
    //         dorms.map(dorm => AsyncStorage.getItem(dorm.name.toLowerCase().split(" ").join("-")))
    //     );
    //     return dorms.filter((dorm, index) => favorites[index] == "1");
    // }

    // const fetchDorm = async (dorm) => {
    //     const response = await fetch("/" + dorm);
    //     return await response.json();
    // }

    // const fetchDorms = async () => {
    //     const apiResponse = await fetch("s");
    //     const data = await apiResponse.json();
    //     const modifiedData = data.map(item => {return {...item, fetchDormData: fetchDorm, forceUpdate: forceUpdate}})
    //     setDormData(await filterFavoriteDorms(modifiedData));
    // }

    // useEffect(() => {
    //     fetchDorms();
    // }, [shouldUpdate]);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {/* {!dormData
                ? (<ActivityIndicator size="large" />)
                : (<List searchPhrase={""} data={dormData}/>)
            } */}
        </View>
    );
}