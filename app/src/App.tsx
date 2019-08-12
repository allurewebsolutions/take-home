import {createAppContainer, createStackNavigator} from 'react-navigation';
import MainScreen from './screens/MainScreen';
import SourcesScreen from './screens/SourcesScreen';
import MessagesScreen from './screens/MessagesScreen';

const mainNavigator = createStackNavigator({
    // tslint:disable:object-literal-sort-keys
    Main: {screen: MainScreen},
    Sources: {screen: SourcesScreen},
    Messages: {screen: MessagesScreen}
});

export default createAppContainer(mainNavigator);
