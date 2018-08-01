import codePush from "react-native-code-push";
import React, {Component} from "react";
import {Provider} from "react-redux";
import configureStore from './configureStore'
import AppNavigator from "./AppNavigator";
import {PersistGate} from 'redux-persist/integration/react';
import {Image, View} from 'react-native'
import {colors} from './utils/themeConfig'

const {persistor, store} = configureStore();
const onAppIc = require('./assets/ic_on_stb.png')

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <PersistGate
                    loading={
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: colors.mainPink
                        }}>
                            <Image source={onAppIc}/>
                        </View>
                    }
                    persistor={persistor}>
                    <AppNavigator/>
                </PersistGate>
            </Provider>
        );
    }
}
let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };
export default App = codePush(codePushOptions)(App)
