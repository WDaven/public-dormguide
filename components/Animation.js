import React from "react";
import {
    Center,
    Text
} from "native-base";
import LottieView from 'lottie-react-native';

const Animation = (props) => {
    return (
        <Center style={props.style}>
            <LottieView
                autoPlay
                loop
                source={require('../animations/no-data-animation.json')}
                style={{
                    width: 200,
                    height: 200
                }}
            />
            <Text fontSize="md" bold>{props.text}</Text>
        </Center>
    );
}

export default Animation;