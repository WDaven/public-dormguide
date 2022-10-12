import React from "react";
import { TextArea } from "native-base";

const ReviewBox = ({userReview, setUserReview}) => {
    return (
        <TextArea 
            borderRadius={20}
            minWidth='75%'
            maxWidth='75%'
            w="75%"             
            borderWidth={2}
            placeholder=" Share details of your experience"
            size="lg"
            multiline={true}
            totalLines={7}
            borderColor ="#9D9D9D"
            value={userReview}
            onChangeText={text => setUserReview(text)}
        />
    )
}

export default ReviewBox;