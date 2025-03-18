import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';

interface Contact {
    id: string;
    name: string;
}

const Contacts = () => {
    const router = useRouter();
    const [search, setSearch] = useState<string>('');
    const contacts: Contact[] = [ // 예시 연락처
        { id: '1', name: 'Alice Johnson' },
        { id: '2', name: 'Bob Smith' },
        { id: '3', name: 'Charlie Brown' },
        { id: '4', name: 'David Williams' },
        { id: '5', name: 'Emma Watson' },
        { id: '6', name: 'Alice Johnson' },
        { id: '7', name: 'Bob Smith' },
        { id: '8', name: 'Charlie Brown' },
        { id: '9', name: 'David Williams' },
        { id: '10', name: 'Emma Watson' },
        { id: '11', name: 'Alice Johnson' },
        { id: '12', name: 'Bob Smith' },
        { id: '13', name: 'Charlie Brown' },
        { id: '14', name: 'David Williams' },
        { id: '15', name: 'Emma Watson' },
    ];

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search Contacts"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <FlatList
                data={filteredContacts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.contactItem}
                        onPress={() => router.push({ pathname: "/contact/[id]", params: { id: item.name } })} // ✅ FIXED
                    >
                        <Text style={styles.contactText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingTop: 60 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    searchContainer: { position: 'absolute', top: 0, left: 0, right: 0, height: 50, backgroundColor: '#f0f0f0', justifyContent: 'center', paddingHorizontal: 10, elevation: 3, zIndex: 10 },
    searchInput: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 10, height: 40, borderWidth: 1, borderColor: '#ccc' },
    contactItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    contactText: { fontSize: 16 },
});

export default Contacts;
