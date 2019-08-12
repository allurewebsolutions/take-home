import * as React from "react";
import {Component} from "react";
import {Button, ScrollView, View} from "react-native";
import {NavigationScreenProps} from "react-navigation";
import {Header} from "react-native-elements";

class DestinationAndTitle {
    constructor(destination: string, title?: string) {
        this.destination = destination;

        if (title === undefined) {
            this.title = destination;
        } else {
            this.title = title;
        }
    }

    public destination: string;
    public title: string;
}

// tslint:disable-next-line:max-classes-per-file
export default class MainScreen extends Component<NavigationScreenProps> {
    public static navigationOptions = {
        title: "Redox Coding Test"
    };

    public render() {
        return (
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {this.destinationAndTitlePairs.map(destinationAndTitle => (
                    <Button
                        key={destinationAndTitle.destination}
                        onPress={() => this.props.navigation.navigate(destinationAndTitle.destination)}
                        title={destinationAndTitle.title}
                    />
                ))}
            </View>
        );
    }

    private destinationAndTitlePairs: Array<DestinationAndTitle> = [
        new DestinationAndTitle("Sources", "View All Sources")
    ];
}
