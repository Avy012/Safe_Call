import { View, Text, ImageBackground, Image } from 'react-native'
import React from 'react'
import { Tabs } from "expo-router";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";


const TabIcon = ({ focused, icon, title }: any) => {
    if (focused) {
        return (
            <ImageBackground
                source={images.highlight}
                className="flex flex-row w-full flex-1 min-w-[112] min-h-16 mt-4 justify-center items-center overflow-hidden">
                <Image source={icon} tintColor="#000000" className="size-5" />
                <Text className="text-secondary text-base font-semibold ml-2">{title}</Text>
            </ImageBackground>
        );
    }
    return(
        <View className="h-[52px] w-full justify-center items-center mt-4 bg-primary">
            <Image source={icon} tintColor="#ffffff" className="w-5 h-5" />
        </View>

    );
};

const _Layout = () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                tabBarStyle: {
                    backgroundColor: '#1E3A5F',
                    height: 52,
                    position: 'absolute',
                    bottom: 0,
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor: '#1E3A5F',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.home}
                            title="Home"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="contacts"
                options={{
                    title: 'Contacts',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.person}
                            title="Contacts"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="calls"
                options={{
                    title: 'Calls',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.call}
                            title="Calls"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="chats"
                options={{
                    title: 'Chats',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon={icons.chat}
                            title="Chats"
                        />
                    ),
                }}
            />
        </Tabs>
    );
};

export default _Layout;
