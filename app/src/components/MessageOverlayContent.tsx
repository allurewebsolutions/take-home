import {Text} from "react-native-elements";
import {View} from "react-native";
import React from "react";

const MessageOverlayContent = props =>
    <View>
        <Text style={{fontWeight: 'bold'}}>Message:</Text>
        <Text>{props.currentMessage.message}</Text>

        <Text style={{fontWeight: 'bold'}}>Status:</Text>
        <Text>{props.currentMessage.status}</Text>

        <Text style={{fontWeight: 'bold'}}>Created:</Text>
        <Text>{props.currentMessage.created_at}</Text>

        <Text style={{fontWeight: 'bold'}}>Updated:</Text>
        <Text>{props.currentMessage.updated_at}</Text>

        <Text style={{fontWeight: 'bold'}}>ID:</Text>
        <Text>{props.currentMessage.id}</Text>

        <Text style={{fontWeight: 'bold'}}>Source ID:</Text>
        <Text>{props.currentMessage.source_id}</Text>
    </View>;

export default MessageOverlayContent;
