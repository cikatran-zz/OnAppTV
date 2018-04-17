import React from 'react'
import {
    Text, Switch, View, StyleSheet, FlatList, StatusBar, Platform, NativeModules
} from 'react-native'
import {colors} from '../../utils/themeConfig'
import SwitcherList from '../../components/SwitcherList'
import _ from 'lodash'

export default class FormatHDD extends React.PureComponent {

    constructor(props) {
        super(props);
        this.formatType = 0;
        this.data = [
            "FAT 32",
            "NTFS"
        ]
    }

    componentDidMount() {
    }

    _keyExtractor = (item, index) => index;

    onChangeFormatType(index, value) {
        if (!value) {
            index = 0;
        }
        this.formatType = index + 1;
    }

    render() {


        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor='#00000000'
                    barStyle='dark-content'/>
                <SwitcherList style={styles.listContainer}
                              data={this.data}
                              index={-1}
                              onSwitch={(index, value) => {
                                  this.onChangeFormatType(index, value)
                              }}/>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.whiteBackground
    },
    listContainer: {
        marginTop: 46,
        marginLeft: 32,
        marginRight: 17
    },
    errorText: {
        color: colors.textDarkGrey,
        textAlign: 'center',
        marginTop: 100,
        width: '100%',
        fontSize: 20
    }
});