import {View, Text, ImageBackground, Image} from 'react-native'
import React from 'react'
import {Tabs} from "expo-router";
import {images} from "@/constants/images";
import {icons} from "@/constants/icons";

const TabIcon = ({focused, icon,title} : any ) => {
    if(focused) {

        return (
            <ImageBackground
                source={images.highlight}
                className="flex flex-row w-full flex-1 min-w-[112] min-h-16 mt-4 justify-center items-center overflow-hidden">
                <Image source={icon} tintColor="#151312" className="size-5"/>
                <Text className=" text-secondary text-base font-semibold ml-2">{title}</Text>

            </ImageBackground>
        )
    }
    return(
        <View className="size-full justify-center items-center mt-4">
            <Image source={icon} tintColor="#A8B5DB" className="size-5"/>
        </View>
    )
}

const _Layout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel:false,
                tabBarItemStyle:{
                    width:'100%',
                    height:'100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                tabBarStyle:{
                        backgroundColor: '#0f0d23',
                        height: 52,
                        position: 'absolute',
                        bottom: 0,
                        overflow: 'hidden',
                        borderWidth:1,
                        borderColor: '#0f0d23',
                    }

        }}>
            <Tabs.Screen
                name = "index"
                options = {{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused = {focused}
                            icon={icons.home}
                            title = "Home"/>
                    )
                }}
            />
            <Tabs.Screen
                name="recents"
                options = {{
                    title: 'Recents',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused = {focused}
                            icon={icons.recents}
                            title = "Recents"/>
                    )
                }}
            />
            <Tabs.Screen
                name="keypad"
                options = {{
                    title: 'Keypad',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused = {focused}
                            icon={icons.keypads}
                            title = "Keypad"/>
                    )
                }}
            />
            <Tabs.Screen
                name="contacts"
                options = {{
                    title: 'Contacts',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused = {focused}
                            icon={icons.person}
                            title = "Contacts"/>
                    )
                }}
            />
            <Tabs.Screen
                name="settings"
                options = {{
                    title: 'Settings',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused = {focused}
                            icon={icons.settings}
                            title = "Settings"/>
                    )
                }}
            />
        </Tabs>
    )
}
export default _Layout