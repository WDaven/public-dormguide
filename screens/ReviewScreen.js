import { View, ScrollView } from "react-native";
import {
    HStack,
    Icon,
    Input,
    Text,
    Button,
    Box,
    Avatar,
    useToast,
} from "native-base";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ReviewBox from "../components/reviewBox";
import StarRating from 'react-native-star-rating';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from "@react-navigation/native";
import moment from "moment";
import uuid from 'react-native-uuid';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDYAHJ4GSkcuMwjE9jbZFa1zvC_C8ZaMaE",
    authDomain: "mas-project-4261.firebaseapp.com",
    projectId: "mas-project-4261",
    storageBucket: "mas-project-4261.appspot.com",
    messagingSenderId: "1019460381378",
    appId: "1:1019460381378:web:6b0eb8bbc3d7e7237ea95b"
};
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

function ReviewScreen() {
    const [reviewer, setReviewer] = useState("");
    const [title, setTitle] = useState("");
    const [userReview, setUserReview] = useState("");
    const [rating, setRating] = useState(0);
    const [pestButton, setpestButton] = useState(false);
    const [loungesButton, setloungesButton] = useState(false);
    const [gymButton, setgymButton] = useState(false);
    const [quietButton, setquietButton] = useState(false);
    const [safeButton, setsafeButton] = useState(false);
    const [showerleaksButton, setShowerleaksButton] = useState(false);
    const [noisyButton, setNoisyButton] = useState(false);
    const [livelyButton, setLivelyButton] = useState(false);
    const [smellButton, setSmellButton] = useState(false);
    const [elevator, setElevator] = useState(null);
    const [laundry, setLaundry] = useState(null);
    const [busRoute, setbusRoute] = useState(null);
    const [gym, setGym] = useState(null);
    const [bike, setBike] = useState(null);
    const [media, setMedia] = useState([]);

    const navigation = useNavigation();
    const toast = useToast();
    const route = useRoute();
    const { name, fetchReviews, fetchUserUploadedImages } = route.params;

    const onSubmit = async () => {
        if (!title || !reviewer || rating == 0) {
            toast.show({
                duration: 3000,
                render: () => {
                  return (
                    <Box bg="red.500" px="4" py="2" rounded="md" mb={5}>
                        Please complete any required fields
                    </Box>
                  );
                }
            });
            return;
        }
        const document_id = name.toLowerCase().split(" ").join("-");
        const endpoint = "https://us-central1-mas-project-4261.cloudfunctions.net/app/dorms/" + document_id + "/reviews";
        const data = {
            reviewer: reviewer,
            rating: rating,
            title: title,
            text: userReview,
            date: moment(Date()).format('YYYY-MM-DD'),
            pros: {
                safe: safeButton,
                lounges: loungesButton,
                gym: gymButton,
                quiet: quietButton,
                lively: livelyButton
            },
            cons: {
                pests: pestButton,
                leaks: showerleaksButton,
                noisy: noisyButton,
                smell: smellButton
            },
            features: {
                bus: busRoute == null ? 0 : busRoute,
                gym: gym == null ? 0 : gym,
                bike: bike == null ? 0 : bike,
                elevator: elevator == null ? 0 : elevator,
                laundry: laundry == null ? 0 : laundry
            }
        }
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (response.status === 200) {
            media.forEach(image => {
                uploadImage(image);
            });
            fetchReviews();
            fetchUserUploadedImages();
            navigation.goBack();
        }
    };

    const uploadImage = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.open('GET', uri, true);
            xhr.send();
        });
        const storageRef = ref(storage, name.toLowerCase().split(" ").join("-") + '/' + uuid.v4());
        await uploadBytes(storageRef, blob).then((snapshot) => {
            console.log('Uploaded image!');
        })
        blob.close();
    }

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
        if (!result.cancelled) {
            setMedia(media => [...media, result.uri]);
        }
    };

    useEffect(() => {
        navigation.setOptions({ headerTitle: name });
    }, [navigation]);

    return (
        <View >
            <ScrollView>
                <View style = {{alignItems:"center"}} paddingTop={'3%'} >
                    <HStack>
                        <StarRating
                            maxStars={5}
                            rating={rating}
                            starSize={40}
                            emptyStar={"star-outline"}
                            fullStar={"star"}
                            iconSet={"MaterialCommunityIcons"}s
                            fullStarColor={"#3880ff"}
                            selectedStar={(rating) => setRating(rating)}/>
                        <View justifySelf={'flex-end'}  alignItems='center'>
                            <Text  style ={{color:'#d13c1c'}}>
                                *
                            </Text>
                        </View>
                    </HStack>
                </View>
                <Box alignItems="center">
                    <HStack>
                        <Input
                            value={reviewer}
                            onChangeText={(text) => setReviewer(text)}
                            placeholder="   Anonymous Username"
                            variant="filled"
                            bg="#f2f2f2"
                            borderColor={"#9D9D9D"}
                            borderWidth={2}
                            marginTop={'5%'}
                            width="75%"
                            borderRadius="20"
                            py="1"
                            px="2"
                            size="lg" 
                        />
                        <View justifyContent={'center'}  alignItems='center'>
                            <Text  style ={{color:'#d13c1c'}}>
                                  *
                            </Text>
                        </View>
                    </HStack>

                    <HStack>
                        <Input
                            value={title}
                            onChangeText={(text) => setTitle(text)}
                            placeholder="   Review Title"
                            variant="filled"
                            bg="#f2f2f2"
                            borderColor={"#9D9D9D"}
                            borderWidth={2}
                            marginTop={'2%'}
                            width="75%"
                            borderRadius="20"
                            py="1"
                            px="2"
                            size="lg" 
                        />
                        <View justifyContent={'center'}  alignItems='center'>
                            <Text  style ={{color:'#d13c1c'}}>
                                  *
                            </Text>
                        </View>
                    </HStack>
                    
                    <View marginTop={'3%'}>
                        <ReviewBox 
                            userReview={userReview}
                            setUserReview={setUserReview}
                        />
                    </View>
                </Box>
                <View alignItems="center" marginTop={5}>
                    {media.length !== 0 &&
                        <Avatar.Group _avatar={{size: "lg"}}>
                            {media.map((item, index) => {
                                return <Avatar source={{uri: item}}></Avatar>
                            })}
                        </Avatar.Group>
                    }
                    <Button 
                        size="md"
                        bg="#f2f2f2"
                        _pressed = {{bg:'#D3D3D3'}}
                        borderColor = "#9D9D9D"
                        borderWidth={2}
                        borderRadius={20}
                        marginTop={1}
                        width={'70%'}
                        onPress={pickImage}>
                        <HStack>
                            <Icon
                                size="sm"
                                as={MaterialCommunityIcons}
                                name="camera-outline"
                                color='#3880FF'
                                marginRight={1}
                            />
                            <Text>Add photos</Text>
                        </HStack>
                    </Button>
                </View>

                <View paddingLeft={'10%'} marginTop={'8%'} >
                    <Text fontWeight={'bold'} fontSize={'md'}>
                        What is great about living here?
                    </Text>
                    <View marginTop={'5%'}>
                        <HStack space={2}  >
                            <Button onPress={() => setsafeButton(!safeButton)}  borderColor = "#9D9D9D" borderWidth={1} borderwidth ={2} bg={{}} borderRadius={20} minWidth={'20%'} 
                                style={{backgroundColor:safeButton==true? "#C1D8FF": "#f2f2f2"}} _text={{color:safeButton == true?"#3880FF": "#000000" }} >
                                Safe
                            </Button>
                            <Button onPress={() => setloungesButton(!loungesButton)}  borderColor = "#9D9D9D" borderWidth={1} borderwidth ={2} bg={{}} borderRadius={20} minWidth={'20%'}
                                style={{backgroundColor:loungesButton==true? "#C1D8FF": "#f2f2f2"}} _text={{color:loungesButton == true?"#3880FF": "#000000" }} >
                                Lounges
                            </Button>
                            <Button onPress={() => setgymButton(!gymButton)}  borderColor = "#9D9D9D" borderWidth={1} borderwidth ={2} bg={{}}  borderRadius={20} minWidth={'20%'}
                                style={{backgroundColor:gymButton==true? "#C1D8FF": "#f2f2f2"}} _text={{color:gymButton == true?"#3880FF": "#000000" }} >
                                Gym
                            </Button>
                            <Button onPress={() => setquietButton(!quietButton)}  borderColor = "#9D9D9D" borderWidth={1} borderwidth ={2} bg={{}} borderRadius={20} minWidth={'20%'}
                                style={{backgroundColor:quietButton==true? "#C1D8FF": "#f2f2f2"}}  _text={{color:quietButton == true?"#3880FF": "#000000" }} >
                                Quiet
                            </Button>
                        </HStack>
                        <HStack marginTop={5} space={2}>
                            <Button onPress={() => setLivelyButton(!livelyButton)}  borderColor = "#9D9D9D" borderWidth={1} borderwidth ={2} bg={{}} borderRadius={20} minWidth={'20%'}
                                style={{backgroundColor:livelyButton==true? "#C1D8FF": "#f2f2f2"}}  _text={{color:livelyButton == true?"#3880FF": "#000000" }} >
                                Lively
                            </Button>
                        </HStack>
                        <Text marginTop={'5%'} fontWeight={'bold'} fontSize={'md'}>
                            Some things to improve.
                        </Text>
                        <HStack space = {2} marginTop={'5%'}>
                            
                            <Button onPress={() => setpestButton(!pestButton)}  borderColor = "#9D9D9D" borderWidth={1} borderwidth ={2} bg={{}} borderRadius={20} minWidth={'20%'}
                                style={{backgroundColor:pestButton==true? "#C1D8FF": "#f2f2f2"}} _text={{color:pestButton == true?"#3880FF": "#000000" }} >
                                Pest
                            </Button>
                            <Button onPress={() => setShowerleaksButton(!showerleaksButton)}  borderColor = "#9D9D9D" borderWidth={1} borderwidth ={2} bg={{}} borderRadius={20} minWidth={'20%'}
                                style={{backgroundColor:showerleaksButton==true? "#C1D8FF": "#f2f2f2"}} _text={{color:showerleaksButton == true?"#3880FF": "#000000" }} >
                                Shower Leaks
                            </Button>
                            <Button onPress={() => setNoisyButton(!noisyButton)}  borderColor = "#9D9D9D" borderWidth={1} borderwidth ={2} bg={{}} borderRadius={20} minWidth={'20%'}
                                style={{backgroundColor:noisyButton==true? "#C1D8FF": "#f2f2f2"}} _text={{color:noisyButton == true?"#3880FF": "#000000" }} >
                                Noisy
                            </Button>
                        </HStack>
                        <HStack marginTop={5} space={2}>
                            <Button onPress={() => setSmellButton(!smellButton)}  borderColor = "#9D9D9D" borderWidth={1} borderwidth ={2} bg={{}} borderRadius={20} minWidth={'20%'}
                                style={{backgroundColor:smellButton==true? "#C1D8FF": "#f2f2f2"}}  _text={{color:smellButton == true?"#3880FF": "#000000" }} >
                                Smell
                            </Button>
                        </HStack>
                        </View>
                </View>
                <View paddingLeft={'10%'} marginTop={'8%'} width={'100%'} >
                    <Text fontWeight={'bold'} fontSize={'md'}>
                        Features
                    </Text>
                    <HStack justifyContent="space-between" width={'100%'} alignItems="center" marginTop={'3%'}>
                        <Text fontSize={'md'}>
                            Bus route
                        </Text>
                            <HStack >
                                <Button  borderColor = "#9D9D9D" borderWidth={1} style={{backgroundColor:busRoute==1? "#C1D8FF": "#f2f2f2"}} onPress={() => setbusRoute(1)} width={"25%"} borderLeftRadius={20} borderRadius={0}>
                                    <Icon size="sm" as={MaterialCommunityIcons} name="thumb-up-outline" style={{color:busRoute == 1?"#3880FF": "#000000" }} />
                                </Button>
                                <Button  borderColor = "#9D9D9D" borderWidth={1} style={{backgroundColor:busRoute==0? "#C1D8FF": "#f2f2f2"}} onPress={() => setbusRoute(0)} width={"25%"} borderRadius={0} _text={{color:busRoute == 0?"#3880FF": "#000000" }}>
                                    OK
                                </Button>
                                <Button  borderColor = "#9D9D9D" borderWidth={1} style={{backgroundColor:busRoute==-1? "#C1D8FF": "#f2f2f2"}} onPress={() => setbusRoute(-1)} width={"25%"} borderRadius={0} borderRightRadius={20}>
                                    <Icon size="sm" as={MaterialCommunityIcons} name="thumb-down-outline" style={{color:busRoute == -1?"#3880FF": "#000000" }} />
                                </Button>
                            </HStack>
                    </HStack>

                    <HStack justifyContent="space-between" width={'100%'} alignItems="center" marginTop={'5%'}>
                        <Text fontSize={'md'}>
                            Gym
                        </Text>
                            <HStack >
                                <Button  borderColor = "#9D9D9D" borderWidth={1} style={{backgroundColor:gym==1? "#C1D8FF": "#f2f2f2"}} onPress={() => setGym(1)} width={"25%"} borderLeftRadius={20} borderRadius={0}>
                                    <Icon size="sm" as={MaterialCommunityIcons} name="thumb-up-outline" style={{color:gym == 1?"#3880FF": "#000000" }} />
                                </Button>
                                <Button  borderColor = "#9D9D9D" borderWidth={1} style={{backgroundColor:gym==0? "#C1D8FF": "#f2f2f2"}} onPress={() => setGym(0)} width={"25%"} borderRadius={0} _text={{color:gym == 0?"#3880FF": "#000000" }}>
                                OK
                                </Button>
                                <Button  borderColor = "#9D9D9D" borderWidth={1} style={{backgroundColor:gym==-1? "#C1D8FF": "#f2f2f2"}} onPress={() => setGym(-1)}   width={"25%"} borderRadius={0} borderRightRadius={20}>
                                    <Icon size="sm" as={MaterialCommunityIcons} name="thumb-down-outline" style={{color:gym == -1?"#3880FF": "#000000" }} />
                                </Button>
                            </HStack>
                    </HStack>

                    <HStack justifyContent="space-between" width={'100%'} alignItems="center" marginTop={'5%'}>
                        <Text fontSize={'md'}>
                            Bike
                        </Text>
                            <HStack >
                                <Button  borderColor = "#9D9D9D" borderWidth={1} style={{backgroundColor:bike==1? "#C1D8FF": "#f2f2f2"}} onPress={() => setBike(1)} width={"25%"} borderLeftRadius={20} borderRadius={0}>
                                    <Icon size="sm" as={MaterialCommunityIcons} name="thumb-up-outline" style={{color:bike == 1?"#3880FF": "#000000" }} />
                                </Button>
                                <Button  borderColor = "#9D9D9D" borderWidth={1} style={{backgroundColor:bike==0? "#C1D8FF": "#f2f2f2"}} onPress={() => setBike(0)} width={"25%"} borderRadius={0}  _text={{color:bike == 0?"#3880FF": "#000000" }}>
                                    OK
                                </Button>
                                <Button  borderColor = "#9D9D9D" borderWidth={1} style={{backgroundColor:bike==-1? "#C1D8FF": "#f2f2f2"}} onPress={() => setBike(-1)} width={"25%"} borderRadius={0} borderRightRadius={20}>
                                    <Icon size="sm" as={MaterialCommunityIcons} name="thumb-down-outline" style={{color:bike == -1?"#3880FF": "#000000" }} />
                                </Button>
                            </HStack>
                    </HStack>

                    <HStack justifyContent="space-between" width={'100%'} alignItems="center" marginTop={'5%'}>
                        <Text fontSize={'md'}>
                            Elevator
                        </Text>
                            <HStack >
                                <Button  borderColor = "#9D9D9D" borderWidth={1} style={{backgroundColor:elevator==1? "#C1D8FF": "#f2f2f2"}} onPress={() => setElevator(1)} width={"25%"} borderLeftRadius={20} borderRadius={0}>
                                    <Icon size="sm" as={MaterialCommunityIcons} name="thumb-up-outline" style={{color:elevator == 1?"#3880FF": "#000000" }} />
                                </Button>
                                <Button  borderColor = "#9D9D9D" borderWidth={1} style={{backgroundColor:elevator==0? "#C1D8FF": "#f2f2f2"}} onPress={() => setElevator(0)} width={"25%"} borderRadius={0}  _text={{color:elevator == 0?"#3880FF": "#000000" }}>
                                    OK
                                </Button>
                                <Button  borderColor = "#9D9D9D" borderWidth={1} style={{backgroundColor:elevator==-1? "#C1D8FF": "#f2f2f2"}} onPress={() => setElevator(-1)} width={"25%"} borderRadius={0} borderRightRadius={20}>
                                    <Icon size="sm" as={MaterialCommunityIcons} name="thumb-down-outline" style={{color:elevator == -1?"#3880FF": "#000000" }} />
                                </Button>
                            </HStack>
                    </HStack>

                    <HStack justifyContent="space-between" width={'100%'} alignItems="center" marginTop={'5%'}>
                        <Text fontSize={'md'}>
                            Laundry
                        </Text>
                            <HStack >
                                <Button  borderColor = "#9D9D9D" borderWidth={1} style={{backgroundColor:laundry==1? "#C1D8FF": "#f2f2f2"}} onPress={() => setLaundry(1)} width={"25%"} borderLeftRadius={20} borderRadius={0}>
                                    <Icon size="sm" as={MaterialCommunityIcons} name="thumb-up-outline" style={{color:laundry == 1?"#3880FF": "#000000" }} />
                                </Button>
                                <Button  borderColor = "#9D9D9D" borderWidth={1} style={{backgroundColor:laundry==0? "#C1D8FF": "#f2f2f2"}} onPress={() => setLaundry(0)} width={"25%"} borderRadius={0}  _text={{color:laundry == 0?"#3880FF": "#000000" }}>
                                    OK
                                </Button>
                                <Button  borderColor = "#9D9D9D" borderWidth={1} style={{backgroundColor:laundry==-1? "#C1D8FF": "#f2f2f2"}} onPress={() => setLaundry(-1)} width={"25%"} borderRadius={0} borderRightRadius={20}>
                                    <Icon size="sm" as={MaterialCommunityIcons} name="thumb-down-outline" style={{color:laundry == -1?"#3880FF": "#000000" }} />
                                </Button>
                            </HStack>
                    </HStack>
                </View>

                <View marginTop={10} marginBottom={10}>
                    <Button alignSelf={'center'} width="70%" bg={"#3880FF"} borderRadius={"20"} shadow={1} marginTop={'3%'} onPress ={onSubmit} _text={{color: "#FFFFFF"}}>
                        Post
                    </Button>
                    <Button variant = "ghost" size="lg" alignSelf={'center'}  _text={{color: "#d13c1c"}} marginTop={'3%'} onPress={() => navigation.goBack()} _pressed = {{bg:'#D3D3D3'}}>
                        Cancel
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
}

export default ReviewScreen;
