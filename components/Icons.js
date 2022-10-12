import {
    Center,
    HStack,
    VStack,
    Icon,
    Text,
} from "native-base";
import {
    MaterialIcons,
    MaterialCommunityIcons,
    Ionicons,
    AntDesign
} from "@expo/vector-icons";

const IconMapping = {
    "library": [Ionicons, "library-outline"],
    "pest": [Ionicons, "bug-outline"],
    "barbell": [Ionicons, "barbell-outline"],
    "quiet": [Ionicons, "volume-low-outline"],
    "loud": [Ionicons, "volume-high-outline"],
    "water": [Ionicons, "water-outline"],
    "bus": [Ionicons, "bus-outline"],
    "door": [MaterialCommunityIcons, "door"],
    "home": [MaterialCommunityIcons, "home-variant-outline"],
    "shower": [MaterialCommunityIcons, "shower"],
    "lounge": [MaterialCommunityIcons, "sofa-outline"],
    "lively": [MaterialCommunityIcons, "account-group-outline"],
    "smell": [MaterialCommunityIcons, "scent"],
    "bike": [MaterialCommunityIcons, "bike"],
    "elevator": [MaterialCommunityIcons, "elevator-passenger-outline"],
    "laundry": [MaterialCommunityIcons, "washing-machine"],
    "money": [MaterialIcons, "attach-money"],
    "safe": [AntDesign, "Safety"]
}

function DetailIcon(props) {
    const { name, text } = props;
    return (
        <VStack>
            <Center>
                <Icon
                    as={IconMapping[name][0]}
                    name={IconMapping[name][1]}
                    size="md"
                    color="black"/>
                <Text>{text}</Text>
            </Center>
        </VStack>
    );
}

function ProsConsIcon(props) {
    const { name, text } = props;
    return (
        <HStack>
            <Icon
                as={IconMapping[name][0]}
                name={IconMapping[name][1]}
                size="xs"
                color='grey'
                marginTop={1}/>
            <Text
                fontSize="sm"
                paddingLeft={2}
                color="grey">
                    {text}
            </Text>
        </HStack>
    );
}

export {
    DetailIcon,
    ProsConsIcon
}
