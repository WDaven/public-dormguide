import Carousel from 'react-native-snap-carousel';
import { useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons"; 
import {
    AspectRatio,
    Box,
    HStack,
    Icon,
    IconButton,
    Image
} from 'native-base';

const renderItem = ({item, index}) => {
    return (
        <Box>
            <AspectRatio w="100%" ratio={16 / 9}>
                <Image source={{ uri: item.uri }} alt="Image" />
            </AspectRatio>
        </Box>
    );
}

function PhotoCarousel(props) {
    const { _, width} = useWindowDimensions();
    const { carouselRef, carouselItems, setActiveIndex } = props;
    return (
        <HStack>
            {<IconButton
                zIndex={1}
                position="absolute"
                left={0}
                top={20}
                icon={<Icon as={MaterialCommunityIcons}
                            size="lg"
                            name="chevron-left"
                            color='white'/>}
                onPress={() => carouselRef.current.snapToPrev()}/>}
            <Carousel
                layout={"default"}
                ref={carouselRef}
                data={carouselItems}
                sliderWidth={width}
                itemWidth={width}
                renderItem={(item) => renderItem(item)}
                onSnapToItem = {(index) => setActiveIndex(index)}/>
            <IconButton
                zIndex={1}
                position="absolute"
                right={0}
                top={20}
                icon={<Icon as={MaterialCommunityIcons}
                            size="lg"
                            name="chevron-right"
                            color='white'/>}
                onPress={() => carouselRef.current.snapToNext()}/>
        </HStack>
    );
}

export default PhotoCarousel;