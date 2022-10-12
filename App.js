import React, { useEffect, useState, useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NativeBaseProvider } from "native-base";
import { MenuProvider } from "react-native-popup-menu";
import SettingsScreen from "./screens/Favorites";
import HomeStackScreen from "./navigation/Routes";
import {Permissions} from 'expo'
import * as Notifications from 'expo-notifications';

// Disables console notifications
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs(); 

const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

// highlight color in activetintcolor default is 3880FF
export default function App () {
const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    console.log('test push')
    
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
      
    };
  }, []);
      
    return (
        <NativeBaseProvider>
            <MenuProvider>
                <NavigationContainer>
                    <HomeStackScreen/>
                    {/* <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#3880FF', tabBarStyle:{backgroundColor: `#f5f5f5`}}}>
                        <Tab.Screen
                            name="Search"
                            component={HomeStackScreen}
                            options={{ tabBarIcon: makeIconRender("magnify"), headerShown: false }}
                        />
                        <Tab.Screen
                            name="Favorites"
                            component={SettingsScreen}
                            options={{ tabBarIcon: makeIconRender("heart-outline"), headerShown: false }}
                        />
                    </Tab.Navigator> */}
                </NavigationContainer>
            </MenuProvider>
        </NativeBaseProvider>
    );
}
  
function makeIconRender(name) {
    return ({ color, size }) => (
        <MaterialCommunityIcons name={name} color={color} size={size} />
    );
}

async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: 'Here is the notification body',
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
  }
  
  async function registerForPushNotificationsAsync() {
    let token;
    if (true) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      const data = {
        token: token
      }
      const response = await fetch("", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log(response.status);
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }