import {LoginManager, AccessToken, GraphRequest, GraphRequestManager} from 'react-native-fbsdk'
import {NativeModules} from 'react-native'

export function facebookLogin() {
    return new Promise((resolve, reject)=> {
        LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
            function(result) {
                console.log(result);
                if (result.isCancelled) {
                    reject({message: "Cancelled"});
                } else {
                    AccessToken.getCurrentAccessToken().then(value => {
                        let userId = console.log("UserID", value.getUserId());
                        console.log("UserID", userId);
                        NativeModules.RNUserKitIdentity.signInWithFacebookAccount(value.accessToken, (error, result)=> {
                            if (error) {
                                reject(error);
                            } else {

                                const infoRequest = new GraphRequest(
                                    '/me',
                                    {parameters: {fields: {string:'last_name,age_range,gender,first_name,email'}}},
                                    (error, result)=> {
                                        if (error) {
                                            console.log('Error fetching data: ',error);
                                        } else {
                                            let baseInfo = {
                                                gender: (result.gender === "female") ? "Female" : "Male",
                                                lastName: result.last_name,
                                                firstName: result.first_name,
                                                age: result.age_range.min.toString(),
                                                email: result.email
                                            };
                                            console.log("PROFILE",baseInfo);
                                            NativeModules.RNUserKit.storeProperty("_base_info", baseInfo, (error, result) => {});
                                        }
                                    },
                                );
                                new GraphRequestManager().addRequest(infoRequest).start();
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