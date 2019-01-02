import React from 'react';
import { View, Text, TouchableOpacity, ListView, StyleSheet, ActivityIndicator, WebView } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class RenderList extends React.Component {
    static navigationOptions =
    {
        title: "Nyhedsoverblik"
    };

    constructor() {
        super();
        this.state = { dataSource: ds.cloneWithRows([]), loading: true };
    }

    componentDidMount() {
        // Fetch a list of recent news from Alt om DATA - as JSON
        fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.altomdata.dk%2Ffeed', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson.items;
        })
        .then((newsItems) => {
            this.setState({ dataSource: ds.cloneWithRows(newsItems) }, () => { this.setState({ loading: false }) });
        })
        .catch((error) => {
            console.error(error);
        });
    }

    clickedItemText(clickedItem) {
        this.props.navigation.navigate('Item', { item: clickedItem });
    }

    render() {
        return(
            <View style = { styles.container1 }>
            {
                (this.state.loading)
                ?
                (<ActivityIndicator size = "large"/>)
                :
                (<ListView style = {{ alignSelf: 'stretch' }}
                    dataSource = { this.state.dataSource }
                    renderRow = { (rowData) =>
                        <TouchableOpacity style = { styles.item } activeOpacity = { 0.4 } onPress = { this.clickedItemText.bind(this, rowData) }>
                            <Text style = { styles.text }>{ rowData.title }</Text>
                        </TouchableOpacity>
                    }
                    renderSeparator = {() =>
                        <View style = { styles.separator }/>
                    }
                    enableEmptySections = { true }/>
                )
            }
            </View>
        );
    }
}

class ClickedItem extends React.Component {
    static navigationOptions =
    {
        title: "Valgt artikel"
    };

    render() {
        return(
            <WebView style = { styles.container2 }
                source={{uri: this.props.navigation.state.params.item.link }}
            />
        );
    }
};

const AppNavigator = createStackNavigator({
    List: { screen: RenderList },
    Item: { screen: ClickedItem }
});

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;

const styles = StyleSheet.create({
    container1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    container2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15
    },

    item: {
        padding: 15
    },

    text: {
        fontSize: 18
    },

    separator: {
        height: 2,
        backgroundColor: 'rgba(0,0,0,0.5)'
    }
});