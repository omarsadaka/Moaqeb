/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import MyNavigate from './myNavigate';
  import firebase from 'react-native-firebase';

import { StackNavigator } from "react-navigation";

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
      'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {

  async componentDidMount() {

    const ReactNative = require('react-native');
try {
  ReactNative.I18nManager.allowRTL(false);
} catch (e) {
  console.log(e);
}

    const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const action = notificationOpen.action;
        const notification: Notification = notificationOpen.notification;
        var seen = [];
        // alert(JSON.stringify(notification.data, function(key, val) {
        //     if (val != null && typeof val == "object") {
        //         if (seen.indexOf(val) >= 0) {
        //             return;
        //         }
        //         seen.push(val);
        //     }
        //     return val;
        // }));
    } 
    const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
            .setDescription('My apps test channel');
// Create the channel
    firebase.notifications().android.createChannel(channel);
    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    });
    this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
        // Process your notification as required
        notification
            .android.setChannelId('test-channel')
            .android.setSmallIcon('ic_launcher');
        firebase.notifications()
            .displayNotification(notification);
        
    });
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification: Notification = notificationOpen.notification;
        var seen = [];
        // alert(JSON.stringify(notification.data, function(key, val) {
        //     if (val != null && typeof val == "object") {
        //         if (seen.indexOf(val) >= 0) {
        //             return;
        //         }
        //         seen.push(val);
        //     }
        //     return val;
        // }));
        firebase.notifications().removeDeliveredNotification(notification.notificationId);
        
    });
}
componentWillUnmount() {
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
}

  render() {
    const ReactNative = require('react-native');
    try {
      ReactNative.I18nManager.allowRTL(false);
    } catch (e) {
      console.log(e);
    }
    return (
      <MyNavigate/>
     );
  }
}


