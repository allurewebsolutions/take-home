import {Overlay, Text} from "react-native-elements";
import {View} from "react-native";
import React from "react";

const SourceDetailsOverlayContent = props =>
    <View>
        <Text style={{fontWeight: 'bold'}}>Name:</Text>
        <Text>{props.source.name}</Text>

        <Text style={{fontWeight: 'bold'}}>Environment:</Text>
        <Text>{props.source.environment}</Text>

        <Text style={{fontWeight: 'bold'}}>Encoding:</Text>
        <Text>{props.source.encoding}</Text>

        <Text style={{fontWeight: 'bold'}}>Updated:</Text>
        <Text>{props.source.updated_at}</Text>

        <Text style={{fontWeight: 'bold'}}>Created:</Text>
        <Text>{props.source.created_at}</Text>

        <Text style={{fontWeight: 'bold'}}>ID:</Text>
        <Text>{props.source.id}</Text>

        <Text style={{fontWeight: 'bold'}}>Message Status Count:</Text>
        <Text>Error: {props.messageStatuses.error}</Text>
        <Text>Enqueued: {props.messageStatuses.enqueued}</Text>
        <Text>Finished: {props.messageStatuses.finished}</Text>
        <Text>Processing: {props.messageStatuses.processing}</Text>
    </View>;

export default SourceDetailsOverlayContent;
