import {LoginManager, AccessToken} from 'react-native-fbsdk'
import {NativeModules} from 'react-native'

export function facebookLogin() {
    return new Promise((resolve, reject)=> {
        LoginManager.logInWithReadPermissions(['public_profile']).then(
            function(result) {
                if (result.isCancelled) {
                    reject({message: "Cancelled"});
                } else {
                    AccessToken.getCurrentAccessToken().then(value => {
                        console.log("AccessToken:",value.accessToken);
                        NativeModules.RNUserKitIdentity.signInWithFacebookAccount(value.accessToken, (error, result)=> {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        });
                    }).catch((error)=>{
                        reject(error);
                    });
                }
            },
            function(error) {
                reject(error);
            }
        );
    });
}