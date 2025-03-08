import {View, Text, ImageBackground, Image} from 'react-native'
import React from 'react'
import {Tabs} from "expo-router";

const _Layout = () => {
    return (
        <Tabs>
            <Tabs.Screen
                name = "index"
                options = {{
                    title: 'Home',
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="recents"
                options = {{
                    title: 'Recents',
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="keypad"
                options = {{
                    title: 'Keypad',
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="contacts"
                options = {{
                    title: 'Contacts',
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="settings"
                options = {{
                    title: 'Settings',
                    headerShown: false,
                }}
            />
        </Tabs>
    )
}
export default _Layout