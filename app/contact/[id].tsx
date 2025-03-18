import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

const ContactDetail = () => {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <View style={styles.container}>
            <Text style={styles.name}>{id}</Text>
            <Text style={styles.detail}>More details about {id} here.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    name: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    detail: { fontSize: 16, color: 'gray' },
});

export default ContactDetail;
