
import React, { useEffect, useState, useRef } from "react";
import { Pressable } from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native";
import {
    VStack,
    HStack,
    Icon,
    Text,
    Box,
    View,
    ScrollView,
    Divider,
    Avatar,
    Spinner,
    Link,
    useToast,
} from "native-base";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import moment from "moment";
import StarRating from 'react-native-star-rating';
import PhotoCarousel from "../components/PhotoCarousel";
import Animation from "../components/Animation";
import { MaterialCommunityIcons } from "@expo/vector-icons"; 
import { DetailIcon, ProsConsIcon } from "../components/Icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

function DetailScreen() {
    const carouselRef = useRef();
    const navigation = useNavigation();
    const route = useRoute();

    const {
        name,
        location,
        address,
        images,
        avg_rating,
        num_reviews,
        capacities,
        style,
        price_per_sem,
        fetchDormData,
        forceUpdate
    } = route.params;

    const [avgRating, setAvgRating] = useState(avg_rating);
    const [numReviews, setNumReviews] = useState(num_reviews)
    const [reviews, setReviews] = useState([]);
    const [favorite, setFavorite] = useState('0');
    const [activeIndex, setActiveIndex] = useState(0);
    const [carouselItems, setCarouselItems] = useState(images.map(image => { return { uri: image } }));
    const [reviewsLoaded, setReviewsLoaded] = useState(false);
    const [prosConsLoaded, setProsConsLoaded] = useState(false);

    const [busRating, setBusRating] = useState(0);
    const [gymRating, setGymRating] = useState(0);
    const [bikeRating, setBikeRating] = useState(0);
    const [elevatorRating, setElevatorRating] = useState(0);
    const [laundryRating, setLaundryRating] = useState(0);

    const [safe, setSafe] = useState(0);
    const [lounges, setLounges] = useState(0);
    const [gym, setGym] = useState(0);
    const [quiet, setQuiet] = useState(0);
    const [lively, setLively] = useState(0);

    const [pests, setPests] = useState(0);
    const [leaks, setLeaks] = useState(0);
    const [noisy, setNoisy] = useState(0);
    const [smell, setSmell] = useState(0);

    const generateReviewStyle = () => {
        const bgColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        const rgb = [bgColor.substring(0, 2), bgColor.substring(2, 4), bgColor.substring(4, 6)];
        const textColor = (parseInt(rgb[0], 16) * 0.299 + parseInt(rgb[1], 16) * 0.587 + parseInt(rgb[2], 16) * 0.114 > 186) ? "#000000" : "#ffffff";
        return ["#" + bgColor, textColor];
    }

    const fetchReviews = async () => {
        const document_id = name.toLowerCase().split(" ").join("-");
        const reviews = await fetch(
            "" + document_id + "/reviews"
        );
        const reviewsData = await reviews.json();
        const reviewsDataWithStyleAttrs = reviewsData.map(review => {
            const [bgColor, textColor] = generateReviewStyle();
            return { ...review, bgColor: bgColor, textColor: textColor }
        });
        setReviews(reviewsDataWithStyleAttrs);
        setReviewsLoaded(true);

        const updated = await fetchDormData(document_id);
        setAvgRating(updated.avg_rating);
        setNumReviews(updated.num_reviews);

        setBusRating(reviewsData.reduce((sum, review) => { return sum + review.features.bus }, 0));
        setGymRating(reviewsData.reduce((sum, review) => { return sum + review.features.gym }, 0));
        setBikeRating(reviewsData.reduce((sum, review) => { return sum + review.features.bike }, 0));
        setElevatorRating(reviewsData.reduce((sum, review) => { return sum + review.features.elevator }, 0));
        setLaundryRating(reviewsData.reduce((sum, review) => { return sum + review.features.laundry }, 0));

        const [safeScore, loungesScore, gymScore, quietScore, livelyScore, pestsScore, leaksScore, noisyScore, smellScore] = calculateScores(reviewsData);
        setSafe(safeScore);
        setLounges(loungesScore);
        setGym(gymScore);
        setQuiet(quietScore);
        setLively(livelyScore);
        setPests(pestsScore);
        setLeaks(leaksScore);
        setNoisy(noisyScore);
        setSmell(smellScore);
        setProsConsLoaded(true);
    };

    const calculateScores = (reviews) => {
        reviews.forEach(review => {
            for (const [key, val] of Object.entries(review.pros)) {
                review.pros[key] = val ? 1 : 0;
            }
            for (const [key, val] of Object.entries(review.cons)) {
                review.cons[key] = val ? 1 : 0;
            }
        });
        const calculateScore = (array) => {
            if (array.length == 0) {
                return 0;
            }
            return array.reduce((sum, score) => { return sum + score }, 0) / array.length;
        }
        const safeScore = calculateScore(reviews.map(review => { return review.pros.safe }));
        const loungesScore = calculateScore(reviews.map(review => { return review.pros.lounges }));
        const gymScore = calculateScore(reviews.map(review => { return review.pros.gym }));
        const quietScore = calculateScore(reviews.map(review => { return review.pros.quiet }));
        const livelyScore = calculateScore(reviews.map(review => { return review.pros.lively }));
        const pestsScore = calculateScore(reviews.map(review => { return review.cons.pests }));
        const leaksScore = calculateScore(reviews.map(review => { return review.cons.leaks }));
        const noisyScore = calculateScore(reviews.map(review => { return review.cons.noisy }));
        const smellScore = calculateScore(reviews.map(review => { return review.cons.smell }));
        return [safeScore, loungesScore, gymScore, quietScore, livelyScore, pestsScore, leaksScore, noisyScore, smellScore];
    }

    const fetchUserUploadedImages = async () => {
        const document_id = name.toLowerCase().split(" ").join("-");
        const images = await fetch(
            "" + document_id
        );
        const imagesData = await images.json();
        setCarouselItems(items => items.concat(imagesData.map(image => { return { uri: image } })));
    }

    const getFavoriteData = async () => {
        try {
            const value = await AsyncStorage.getItem(name.toLowerCase().split(" ").join("-"));
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
            await AsyncStorage.setItem(name.toLowerCase().split(" ").join("-"), value);
            forceUpdate();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        navigation.setOptions({ headerTitle: name });
        fetchReviews();
        fetchUserUploadedImages();
        getFavoriteData();
    }, [navigation]);

    return (
        <View>
            <ScrollView>
                <PhotoCarousel
                    carouselRef={carouselRef}
                    carouselItems={carouselItems}
                    setActiveIndex={setActiveIndex}
                />
                <HStack paddingLeft={5}>
                    <VStack>
                        <Text fontSize="md" color="grey" marginTop={1}>{location.toUpperCase()}</Text>
                            <Text fontSize="xl">{name.toUpperCase()}</Text>
                            <HStack>
                                <Icon
                                    as={MaterialCommunityIcons}
                                    size="xs"
                                    color="blue.500"
                                    name="map-marker-outline"/>
                                <Text fontSize="xs" color="blue.500">{address}</Text>
                            </HStack>
                        
                        <HStack paddingTop={1}>
                            <Icon
                                as={MaterialCommunityIcons}
                                size="xs"
                                color="red.500"
                                marginTop={0.5}
                                name="star"/>
                            <Text fontSize="xs" paddingLeft={1} color="red.500">
                                {(Math.round(10 * avgRating) / 10).toFixed(1)}
                            </Text>
                            <Text fontSize="xs" paddingLeft={1}>({numReviews})</Text>
                        </HStack>
                    </VStack>
                    <View position={"absolute"} right={5} top={5}>
                        <StarRating
                            maxStars={1}
                            rating={parseInt(favorite)}
                            starSize={40}
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

                <Divider my={2}/>
                <HStack space={4} justifyContent="center">
                    <DetailIcon name="door" text={
                        (capacities.length == 1
                            ? capacities[0]
                            : capacities[0] + "-" + capacities[capacities.length - 1]
                        ) + " beds"
                    }/>
                    <DetailIcon name="home" text={style}/>
                    <DetailIcon name="money" text={"$" + price_per_sem + "/sem"}/>
                </HStack>
                <Divider my={2}/>

                <Text paddingLeft={5} fontSize="md" bold>Pros</Text>
                {!prosConsLoaded && <Spinner accessibilityLabel="Loading" />}
                <VStack paddingLeft={8}>
                    {safe > 0.2 && <ProsConsIcon name="safe" text="Safe"/>}
                    {lounges > 0.2 && <ProsConsIcon name="lounge" text="Lounges"/>}
                    {gym > 0.2 && <ProsConsIcon name="barbell" text="Gym"/>}
                    {quiet > 0.2 && <ProsConsIcon name="quiet" text="Quiet"/>}
                    {lively > 0.2 && <ProsConsIcon name="lively" text="Lively"/>}

                    {busRating > 0 && <ProsConsIcon name="bus" text="Bus Route"/>}
                    {bikeRating > 0 && <ProsConsIcon name="bike" text="Bike Rack"/>}
                    {elevatorRating > 0 && <ProsConsIcon name="elevator" text="Elevator"/>}
                    {laundryRating > 0 && <ProsConsIcon name="laundry" text="Laundry"/>}
                </VStack>
                <Text paddingLeft={5} fontSize="md" bold>Cons</Text>
                {!prosConsLoaded && <Spinner accessibilityLabel="Loading" />}
                <VStack paddingLeft={8}>
                    {pests > 0.1 && <ProsConsIcon name="pest" text="Pests"/>}
                    {leaks > 0.1 && <ProsConsIcon name="water" text="Shower Leaks"/>}
                    {noisy > 0.1 && <ProsConsIcon name="loud" text="Noisy"/>}
                    {smell > 0.1 && <ProsConsIcon name="smell" text="Smell"/>}

                    {busRating < 0 && <ProsConsIcon name="bus" text="Bus Route"/>}
                    {bikeRating < 0 && <ProsConsIcon name="bike" text="Bike Rack"/>}
                    {elevatorRating < 0 && <ProsConsIcon name="elevator" text="Elevator"/>}
                    {laundryRating < 0 && <ProsConsIcon name="laundry" text="Laundry"/>}
                </VStack>
                <VStack paddingLeft={5} paddingTop={2}>
                    <Link
                        href={"https://housing.gatech.edu/building/" + name.toLowerCase().split(" ").join("-")}
                        isUnderlined={false}
                        _text={{
                            color: "blue.500",
                            fontSize: "xs"
                        }}>
                            SEE HOUSING DETAILS ON GT WEBSITE
                    </Link>
                </VStack>
                <View paddingLeft={5} paddingRight={5} paddingTop={2}>
                    <Text fontSize="md" bold>Reviews</Text>
                </View>

                {!reviewsLoaded && <Spinner accessibilityLabel="Loading" />}
                {reviewsLoaded && reviews.length == 0 && <Animation text={"No reviews found"}/>}

                {reviews.map((review, index) => 
                    <Review
                        key={index}
                        dorm={name}
                        reviewId={review.review_id}
                        reviewer={review.reviewer}
                        rating={review.rating}
                        title={review.title}
                        date={moment(review.date).format('MMMM YYYY')}
                        text={review.text}
                        bgColor={review.bgColor}
                        textColor={review.textColor}
                    />
                )}

                <VStack>
                    <View paddingLeft={5} paddingTop={4}>
                        <Text bold fontSize={"lg"}>Do you live here? Have you lived here?</Text>
                        <Text bold fontSize={"lg"}>Rate & leave a review!</Text>
                        <HStack>
                            <View>
                                <Pressable onPress={() => navigation.navigate('ReviewScreen', {
                                    name: name,
                                    fetchReviews: fetchReviews,
                                    fetchUserUploadedImages: fetchUserUploadedImages
                                })}>
                                    <HStack>
                                        {[...Array(5)].map(_ => <Icon as={MaterialCommunityIcons} size="lg" name="star-outline"/>)}
                                    </HStack>
                                </Pressable>
                            </View>
                        </HStack>
                    </View>
                </VStack>

                <Box my={2} />
            </ScrollView>
        </View>
    );
}

function Review(props) {
    const { dorm, reviewId, reviewer, rating, title, date, text, bgColor, textColor } = props;
    const toast = useToast();
    const onReport = async () => {
        const data = {
            dorm: dorm,
            review_id: reviewId,
            reviewer: reviewer,
            title: title,
            text: text,
            date: date
        }
        const response = await fetch("https://us-central1-mas-project-4261.cloudfunctions.net/app/reports", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (response.status === 200) {
            toast.show({
                duration: 3000,
                render: () => {
                    return (
                        <Box bg="red.500" px="4" py="2" rounded="md" mb={5}>
                            This review has been reported
                        </Box>
                    );
                }
            });
        }
    }

    return (
        <VStack marginTop={2} paddingLeft={5} paddingRight={5}>
            <HStack justifyContent="space-between" >
                <VStack>
                    <HStack>
                        <Avatar size="xs" bg={bgColor}>
                            <Text fontSize={"xs"} color={textColor}>{reviewer.substring(0, 1).toUpperCase()}</Text>
                        </Avatar>
                        <Text marginLeft={2}>{reviewer}</Text>        
                    </HStack>
                    <HStack marginTop={1} justifyContent="space-between">
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={rating}
                            starSize={15}
                            emptyStar={"star-outline"}
                            fullStar={"star"}
                            halfStar={"star-half-full"}
                            iconSet={"MaterialCommunityIcons"}
                            fullStarColor={"black"}
                        />
                    </HStack>
                </VStack>
                <Menu>
                    <MenuTrigger>
                        <Icon
                            as={MaterialCommunityIcons}
                            size="sm"
                            name="dots-vertical"/>
                    </MenuTrigger>
                    <MenuOptions optionsContainerStyle={{width: 120}}>
                        <MenuOption onSelect={onReport} >
                            <Text>Report</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            </HStack>
            <VStack>
                <Text bold>{title}</Text>
                <Text color="grey">{date}</Text>
                <Text>{text}</Text>
            </VStack>
        </VStack>
    );
}

export default DetailScreen;