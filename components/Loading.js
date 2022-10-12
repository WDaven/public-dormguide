import React from "react";
import {
    Center,
    Image
} from "native-base";
import LottieView from 'lottie-react-native';


const Loading = (props) => {
    return (
        <Center marginTop={288}>
            <Image
                source={require('../dormguidelogo.png')}
                width={400}
                height={200}
            />
            <LottieView
                autoPlay
                loop
                source={require('../animations/loading-animation.json')}
                style={{
                    width: 100,
                    height: 100
                }}
            />
        </Center>
    );
}

export default Loading;