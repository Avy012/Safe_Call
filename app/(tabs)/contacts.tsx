import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import React, { useState } from 'react';

const Contacts = () => {
    const [search, setSearch] = useState('');
    const [contacts, setContacts] = useState([
        { id: '1', name: 'Alice Johnson' },
        { id: '2', name: 'Bob Smith' },
        { id: '3', name: 'Charlie Brown' },
        { id: '4', name: 'David Williams' },
        { id: '5', name: 'Emma Watson' },
        { id: '6', name: 'Franklin James' },
        { id: '7', name: 'George Lucas' },
        { id: '8', name: 'Hannah Lee' },
        { id: '9', name: 'Isaac Newton' },
        { id: '10', name: 'John Doe' },
        { id: '11', name: 'Alice Johnson' },
        { id: '12', name: 'Bob Smith' },
        { id: '13', name: 'Charlie Brown' },
        { id: '14', name: 'David Williams' },
        { id: '15', name: 'Emma Watson' },
        { id: '16', name: 'Franklin James' },
        { id: '17', name: 'George Lucas' },
        { id: '18', name: 'Hannah Lee' },
        { id: '19', name: 'Isaac Newton' },
        { id: '20', name: 'John Doe' },
    ]);

    // Filter contacts based on search input
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search Contacts"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* Contact List */}
            <FlatList
                data={filteredContacts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.contactItem}>
                        <Text style={styles.contactText}>{item.name}</Text>
                    </View>
                )}
                contentContainerStyle={{ paddingTop: 60 }} // Prevents list from going under the search bar
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 50,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        paddingHorizontal: 10,
        elevation: 3, // Adds a shadow effect (for Android)
        zIndex: 10, // Ensures it stays above the list
    },
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    contactItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    contactText: {
        fontSize: 16,
    },
});

export default Contacts;
