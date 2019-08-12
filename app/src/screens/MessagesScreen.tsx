import React, {Component} from 'react';
import {Dimensions, ActivityIndicator, FlatList, RefreshControl, ScrollView, View} from 'react-native';
import * as API from "../helpers/api";
import Messages from "../components/Messages";
import {SearchBar, Text, Divider, Overlay, ListItem, Icon} from "react-native-elements";
import MessageOverlayContent from "../components/MessageOverlayContent";
import SourceDetailsOverlayContent from '../components/SourceDetailsOverlayContent';

export default class MessagesScreen extends Component {
    static navigationOptions = () => {
        return {
            title: 'Messages'
        };
    };

    state = {
        data: [],
        currentMessage: [],
        messageStatuses: [],
        page: 1,
        loading: true,
        overlayVisible: {
            message: false,
            sourceDetails: false
        },
        loadingMore: false,
        refreshing: false,
        error: null
    };

    componentDidMount() {
        this._getAllMessagesFromSource();
    }

    /**
     * Get all messages from a specific source ID
     *
     * @private
     */
    _getAllMessagesFromSource = async () => {
        const {page} = this.state;
        const sourceID = this.props.navigation.state.params.source.id;
        const URL = `source/${sourceID}/message?page=${page}&per_page=20`;

        this.setState({loading: true});

        try {
            const response = await API.getData(URL);

            this.setState((prevState, nextProps) => ({
                data:
                    page === 1
                        ? Array.from(response.data.data)
                        : [...this.state.data, ...response.data.data],
                loading: false,
                loadingMore: false,
                refreshing: false
            }));

        } catch (error) {
            this.setState({error, loading: false, refreshing: false});
        }
    };

    /**
     * Get source details
     *
     * @private
     */
    _getSourceDetails = async () => {
        try {
            const response = await API.getData(`source/${this.props.navigation.state.params.source.id}/details`);

            this.setState({
                messageStatuses: response.data.data,
                overlayVisible: {
                    message: false,
                    sourceDetails: true
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Render page header
     *
     * @private
     */
    _renderHeader = () =>
        <View>
            <View style={{
                flexDirection: "row",
                alignItems: "center"
            }}>
                <Text h4 style={{margin: 10}}>{this.props.navigation.state.params.source.name}</Text>
                <Icon
                    name='info'
                    style={{marginRight: 5}}
                    onPress={() => this._getSourceDetails()}
                />
            </View>
            <View>
                <Divider style={{backgroundColor: 'blue'}}/>
            </View>
        </View>;

    /**
     * Render footer for flatlist when more messages are being loaded
     *
     * @private
     */
    _renderFooter = () => {
        if (!this.state.loadingMore) return null;

        // screen height and width
        const {width, height} = Dimensions.get('window');

        return (
            <View
                style={{
                    position: 'relative',
                    width: width,
                    height: height,
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    marginTop: 10,
                    marginBottom: 10,
                    borderColor: '#000'
                }}
            >
                <ActivityIndicator animating size="large"/>
            </View>
        );
    };

    /**
     * Load more messages
     *
     * @private
     */
    _handleLoadMore = () =>
        this.setState(
            (prevState, nextProps) => ({
                page: prevState.page + 1,
                loadingMore: true
            }),
            () => {
                this._getAllMessagesFromSource();
            }
        );

    /**
     * Refresh page and start fresh
     *
     * @private
     */
    _handleRefresh = () =>
        this.setState(
            {
                page: 1,
                refreshing: true
            },
            () => {
                this._getAllMessagesFromSource();
            }
        );

    /**
     * Render a single message
     *
     * @param item
     * @private
     */
    _renderItem = item =>
        <ListItem
            title={item.message}
            chevron
            onPress={() => {
                this.setState({
                    currentMessage: item,
                    overlayVisible: {message: true, sourceDetails: false}
                });
            }}
        />;

    /**
     * Render a flatlist separator
     *
     * @private
     */
    _renderSeparator = () =>
        <View style={{
            height: .5,
            width: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
        }}
        />;

    /**
     * Render message content that appears in overlay
     *
     * @private
     */
    _renderMessageContentOverlay = () =>
        <Overlay
            isVisible={this.state.overlayVisible.message}
            windowBackgroundColor="rgba(0,0,0,0.8)"
            height="auto"
            borderRadius={10}
            onBackdropPress={() => this.setState({overlayVisible: {message: false, sourceDetails: false}})}
        >
            <MessageOverlayContent currentMessage={this.state.currentMessage}/>
        </Overlay>;

    /**
     * Render source details content that appears in overlay
     *
     * @private
     */
    _renderSourceDetailsOverlay = () =>
        <Overlay
            isVisible={this.state.overlayVisible.sourceDetails}
            windowBackgroundColor="rgba(0,0,0,0.8)"
            height="auto"
            borderRadius={10}
            onBackdropPress={() => this.setState({overlayVisible: {message: false, sourceDetails: false}})}
        >
            <SourceDetailsOverlayContent source={this.props.navigation.state.params.source} messageStatuses={this.state.messageStatuses}/>
        </Overlay>;

    render() {
        const {data, error, loading, refreshing} = this.state;

        if (!data) return <Text>No data yet ...</Text>;

        if (error) return <Text>{error}</Text>;

        if (loading) return (
            <View>
                <ActivityIndicator size="large" color="#0c9"/>
            </View>
        );

        if (data.length === 0) return (
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Text h4 style={{textAlign: 'center'}}>There are no messages for this source</Text>
            </View>
        );

        return (
            <View>
                {this._renderMessageContentOverlay()}
                {this._renderSourceDetailsOverlay()}
                {this._renderHeader()}

                <FlatList
                    data={data}
                    renderItem={item => this._renderItem(item.item)}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={this._renderSeparator}
                    ListFooterComponent={this._renderFooter}
                    onRefresh={this._handleRefresh}
                    refreshing={refreshing}
                    onEndReached={this._handleLoadMore}
                    onEndReachedThreshold={0.5}
                    initialNumToRender={20}
                />
            </View>
        );
    }
}
