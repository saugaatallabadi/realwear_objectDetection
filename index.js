'use strict';
import React, { PureComponent } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Image, Dimensions, ImageEditor } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { name as appName } from './app.json';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const PicturePath = "";

class CameraViewScreen extends PureComponent {
    state = { loading: false }
    takePicture = async () => {
        if (this.camera) {
            const options = { quality: 0.01, base64: true };
            const data = await this.camera.takePictureAsync(options).then(({ uri, height, width, base64 }) => {
                console.log(height);
                console.log(width);
                return { uri, height, width, base64 };
            });

            console.log("data uri (essentially path)", data.uri);
            console.log("BASE 64 LENGTH", data['base64'].length);
            this.storePicture(data);
        }
    };

    storePicture = async (data) => {
        console.log("PicturePath", PicturePath);
        if (data.uri) {
            // Create the json object
            // var data = new FormData();
            // data.append('picture', { uri: data.uri, name: 'selfie.jpg', type: 'image/jpg' });
            // const testdata = data['base64']
            console.log("data TYPEOF", typeof (data['base64']));

            // console.log(data['base64'])
            let body = JSON.stringify({
                "name": "tester5jkgrdf.jpg",
                "file": data['base64']
            });

            // Create the config object for the POST
            // You typically have an OAuth2 token that you use for authentication

            const config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;',
                    //  'Authorization': 'Bearer ' + 'SECRET_OAUTH2_TOKEN_IF_AUTH',
                },
                body: body,
            }

            // console.log("FULLDATA", body)
            this.setState({ loading: true });

            let response = await fetch("https://redpr96cf2.execute-api.us-east-1.amazonaws.com/Dev/TEIA_rekognition", config);


            let responseJson = await response.json();
            this.setState({ loading: false });
            console.log(responseJson)

            // let responseJson = "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"


            this.props.navigation.navigate('Results', {
                responseJson: responseJson
            });
            // this.props.navigation.navigate('Results');
        }
    }

    render() {
        console.log(this.state);
        return (

            <View style={styles.container}>
                {/* <Text>hello</Text> */}
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    // ratio={'4:4'}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    // flashMode={RNCamera.Constants.FlashMode.on}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    captureAudio={false}
                />
                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={this.state.loading ? null : this.takePicture.bind(this)} style={styles.capture}
                        accessibilityLabel="Take Photo|hf_make_clickable">
                        <Text style={{ fontSize: 14 }}>{this.state.loading ? "Loading..." : "TAKE PHOTO"}  </Text>
                    </TouchableOpacity>
                </View>
                {/* <View> */}
                {/* </View> */}
            </View>
        )
    }
}


class ResultsScreen extends PureComponent {
    // route = useRoute();
    render() {
        // console.log(this.props.route);

        return (
            <SafeAreaView>
                {/* <TouchableOpacity disabled={!isCameraReady} onPress={switchCamera}> */}
                <Image style={styles.logo} source={{ uri: `data:image/png;base64,${this.props.route.params.responseJson['base64']}` }} />
                <Text>${this.props.route.params.responseJson['message']}</Text>
                {/* <TouchableOpacity accessibilityLabel="Go Back|hf_make_clickable" onPress={this.props.navigation.goBack()}>
                    <View style={[styles.closeCross, { transform: [{ rotate: "45deg" }] }]} />

                    <View
                        style={[styles.closeCross, { transform: [{ rotate: "-45deg" }] }]}
                     /> 
                </TouchableOpacity> */}
            </SafeAreaView>
        )
    }
}

// export default function ReviewDetails({ navigation }) {
//     return (
//         <View style={globalStyles.container}>
//             <Text>{navigation.getParam('title')}</Text>
//             <Text>{navigation.getParam('body')}</Text>
//             <Text>{navigation.getParam('rating')}</Text>
//         </View>
//     )
// }

class ExampleApp extends PureComponent {
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={CameraViewScreen} />
                    <Stack.Screen name="Results" component={ResultsScreen} options={{
                        headerBackAccessibilityLabel: "Go Back|hf_make_clickable"
                    }} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }



    // renderResponse = (responseJson) => {
    //     // const base64Image = responseJson['file'];
    //     const base64Image = responseJson;
    //     return (
    //         <SafeAreaView>
    //             {/* <TouchableOpacity disabled={!isCameraReady} onPress={switchCamera}> */}
    //             <Image source={{ uri: `data:image/png;base64,${base64Image}` }} />
    //             {/* { renderCancelPreviewButton2()} */}
    //             <TouchableOpacity accessibilityLabel="Go Back|hf_make_clickable">
    //                 <View style={[styles.closeCross, { transform: [{ rotate: "45deg" }] }]} />

    //                 <View
    //                     style={[styles.closeCross, { transform: [{ rotate: "-45deg" }] }]}
    //                 />
    //             </TouchableOpacity>
    //         </SafeAreaView>
    //     )
    // }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        // width: 20,
        // height: 20,


        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
    logo: {
        width: 296,
        height: 258,
        // width: Dimensions.get('window').width,
        // flex: 1,
        // resizeMode: 'cover', // or 'stretch',
        // justifyContent: 'center',
    },
});

AppRegistry.registerComponent(appName, () => ExampleApp);
