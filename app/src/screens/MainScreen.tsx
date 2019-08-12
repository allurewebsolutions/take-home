import * as React from "react";
import {Component} from "react";
import {Button, ScrollView} from "react-native";
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
            <ScrollView style={{backgroundColor: "#fff", flex: 1}}>
                {this.destinationAndTitlePairs.map(destinationAndTitle => (
                    <Button
                        key={destinationAndTitle.destination}
                        onPress={() => this.props.navigation.navigate(destinationAndTitle.destination)}
                        title={destinationAndTitle.title}
                    />
                ))}
            </ScrollView>
        );
    }

    private destinationAndTitlePairs: Array<DestinationAndTitle> = [
        new DestinationAndTitle("Sources")
    ];
}
