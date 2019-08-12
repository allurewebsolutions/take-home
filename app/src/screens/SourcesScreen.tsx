import React, {Component} from 'react';
import {ActivityIndicator, FlatList, RefreshControl, ScrollView, View} from 'react-native';
import {Button, Divider, Icon, Input, ListItem, Overlay, SearchBar, Text} from 'react-native-elements';
import Swipeout from 'react-native-swipeout';
import {Formik, FormikActions, FormikProps} from 'formik';
import {object as yupObject, string as yupString} from 'yup';
import * as API from '../helpers/api';

interface State {
    loading: boolean,
    data: object,
    error: string,
    value: string,
    isVisible: object,
    currentSource: object,
    refreshing: boolean;
}

interface FormValues {
    id: string,
    name: string;
    environment: string;
    encoding: string;
}

export default class Source extends Component<{}, State> {
    static navigationOptions = () => {
        return {
            title: 'Sources'
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            data: [],
            error: null,
            isVisible: {edit: false, delete: false},
            currentSource: [],
            refreshing: false
        };

        this.filterArray = [];
    }

    componentDidMount() {
        this._getSources();
    }

    /**
     * Get sources from API
     *
     * @private
     */
    _getSources = async () => {
        this.setState({loading: true});

        try {
            const response = await API.getData('source');

            this.setState({
                loading: false,
                error: response.error || null,
                data: response.data.data,
                refreshing: false
            });

            this.filterArray = response.data.data;

        } catch (error) {
            this.setState({error, loading: false, refreshing: false});
        }
    };

    /**
     * Render header with search bar
     *
     * @private
     */
    _renderHeader = () => {
        return (
            <SearchBar
                placeholder="Filter Sources..."
                lightTheme
                round
                onChangeText={text => this._searchFilterFunction(text)}
                autoCorrect={false}
                value={this.state.value}
            />
        );
    };

    /**
     * Filter function for sources
     *
     * @param text
     * @private
     */
    _searchFilterFunction = text => {
        this.setState({value: text});

        const newData = this.filterArray.filter(source => {
            const sourceData = `${source.name.toUpperCase()} ${source.encoding.toUpperCase()} ${source.environment.toUpperCase()}`;
            const textData = text.toUpperCase();

            return sourceData.indexOf(textData) > -1;
        });

        this.setState({data: newData});
    };

    /**
     * Render separator between flatlist items
     *
     * @private
     */
    _renderSeparator = () => {
        return (
            <View style={{
                height: .5,
                width: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
            }}
            />
        );
    };

    /**
     * Render flatlist item and define swipe button actions
     *
     * @param data
     * @private
     */
    _renderItem = (data) => {
        // Swipe buttons
        const swipeButtons = [
            {
                text: 'Edit',
                backgroundColor: '#00F',
                onPress: () => this.setState({currentSource: data.item, isVisible: {edit: true, delete: false}})
            },
            {
                text: 'Delete',
                backgroundColor: '#F00',
                onPress: () => this.setState({currentSource: data.item, isVisible: {edit: false, delete: true}})
            }
        ];

        return (
            <Swipeout
                autoClose={true}
                right={swipeButtons}
            >
                <ListItem
                    title={data.item.name}
                    subtitle={data.item.environment}
                    chevron
                    onPress={() => this.props.navigation.navigate('Messages', {source: data.item})}
                />
            </Swipeout>
        )
    };

    /**
     * Renders the edit source form modal content
     *
     * @param values
     * @param handleSubmit
     * @param setFieldValue
     * @param touched
     * @param errors
     * @param setFieldTouched
     * @param isValid
     * @param isSubmitting
     * @private
     */
    _renderEditSourceForm = ({values, handleSubmit, setFieldValue, touched, errors, setFieldTouched, isValid, isSubmitting}: FormikProps<FormValues>) => (
        <View>
            <Text h4 style={{textAlign: 'center'}}>Edit Source</Text>
            <Divider style={{backgroundColor: 'blue', marginBottom: 20}}/>
            <Input
                placeholder='Source Name'
                label="Source Name"
                shake={true}
                value={values.name}
                onChangeText={value => setFieldValue("name", value)}
                onBlur={() => setFieldTouched("name")}
                editable={!isSubmitting}
                errorMessage={touched.name && errors.name ? errors.name : undefined}
            />

            <Input
                placeholder='Environment'
                label="Environment"
                shake={true}
                value={values.environment}
                onChangeText={value => setFieldValue("environment", value)}
                onBlur={() => setFieldTouched("environment")}
                editable={!isSubmitting}
                errorMessage={touched.environment && errors.environment ? errors.environment : undefined}
            />

            <Input
                placeholder='Encoding'
                label="Encoding"
                shake={true}
                value={values.encoding}
                onChangeText={value => setFieldValue("encoding", value)}
                onBlur={() => setFieldTouched("encoding")}
                editable={!isSubmitting}
                errorMessage={touched.encoding && errors.encoding ? errors.encoding : undefined}
            />

            <Button
                title="Save"
                style={{marginTop: 30}}
                onPress={handleSubmit}
                disabled={!isValid || isSubmitting}
                loading={isSubmitting}
                loadingProps={{size: "large", color: "white"}}
            />
        </View>
    );

    /**
     * Handles submit of edit source modal
     *
     * @param values
     * @param formikBag
     */
    handleSubmit = async (values: FormValues, formikBag: FormikActions<FormValues>) => {
        formikBag.setSubmitting(true);

        try {
            const response = await API.updateSource('update', values);

            formikBag.setSubmitting(false);
            this.setState({isVisible: {edit: false, delete: false}});
            this._onRefresh();
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Delete a source
     *
     * @private
     */
    _deleteSource = async () => {
        try {
            const response = await API.updateSource('delete', this.state.currentSource);
            
            this.setState({isVisible: {edit: false, delete: false}});
            this._onRefresh();
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Refresh sources
     *
     * @private
     */
    _onRefresh = () =>
        this.setState(
            {
                refreshing: true
            },
            () => {
                this._getSources();
            }
        );

    /**
     * Render overlay for editing a source
     *
     * @private
     */
    _renderEditSourceOverlay = () =>
        <Overlay
            isVisible={this.state.isVisible.edit}
            windowBackgroundColor="rgba(0,0,0,0.8)"
            height="auto"
            borderRadius={10}
            onBackdropPress={() => this.setState({isVisible: {edit: false, delete: false}})}
        >
            <Formik
                initialValues={{name: this.state.currentSource.name, environment: this.state.currentSource.environment, encoding: this.state.currentSource.encoding, id: this.state.currentSource.id}}
                onSubmit={(values: FormValues, formikBag: FormikActions<FormValues>) => this.handleSubmit(values, formikBag)}
                validationSchema={yupObject().shape({
                    name: yupString()
                        .required('Source name is required'),
                    environment: yupString()
                        .required('Environment is required'),
                    encoding: yupString()
                        .required('Encoding is required')
                })}
                render={(formikBag: FormikProps<FormValues>) => this._renderEditSourceForm(formikBag)}
            />
        </Overlay>;

    /**
     * Render overlay for deleting a source
     *
     * @private
     */
    _renderDeleteSourceOverlay = () =>
        <Overlay
            isVisible={this.state.isVisible.delete}
            windowBackgroundColor="rgba(0,0,0,0.8)"
            height="auto"
            borderRadius={10}
            onBackdropPress={() => this.setState({isVisible: {edit: false, delete: false}})}
        >
            <View>
                <Text h4>Are you sure you want to delete this source: {this.state.currentSource.name}</Text>
                <Button
                    title="No"
                    style={{marginTop: 30}}
                    buttonStyle={{backgroundColor: '#F00'}}
                    onPress={() => this.setState({isVisible: {edit: false, delete: false}})}
                />
                <Button
                    title="Yes"
                    style={{marginTop: 30}}
                    onPress={this._deleteSource}
                />
            </View>
        </Overlay>;

    render() {
        const {loading, data, refreshing} = this.state;

        if (loading) return (
            <View>
                <ActivityIndicator size="large" color="#0c9"/>
            </View>
        );

        return (
            <View>
                {this._renderEditSourceOverlay()}
                {this._renderDeleteSourceOverlay()}
                {this._renderHeader()}

                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                >
                    <FlatList
                        data={data}
                        renderItem={item => this._renderItem(item)}
                        keyExtractor={(item, index) => index.toString()}
                        ItemSeparatorComponent={this._renderSeparator}
                    />
                </ScrollView>
            </View>
        )
    }
}
