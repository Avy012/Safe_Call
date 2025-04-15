import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from "expo-router";

interface Contact {
    id: string;
    name: string;
}

const Contacts = () => {
    
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [showOptions, setShowOptions] = useState(false);

    const contacts: Contact[] = [
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
        { id: '15', name: 'Emma Watson' }
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
                <TouchableOpacity
                    style={styles.plusButton}
                    onPress={() => setShowOptions(prev => !prev)}
                >
                    <Text style={styles.plusText}>+</Text>
                </TouchableOpacity>
            </View>

            {showOptions && (
                <View style={styles.optionsContainer}>
                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={() => router.push('/keypad')}
                    >
                        <Text style={styles.optionText}>전화 걸기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={() => router.push('/AddContact')}  
                    >
                        <Text style={styles.optionText}>연락처 추가</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={filteredContacts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.contactItem}
                        // onPress={() => router.push(`/contact/${item.id}`)} // 나중에 수정할 부분
                    >
                        <Text style={styles.contactText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingTop: showOptions ? 120 : 80 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    searchContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 50,
        backgroundColor: '#f0f0f0',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        elevation: 3,
        zIndex: 10,
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    plusButton: {
        marginLeft: 10,
        width: 40,
        height: 40,
        backgroundColor: '#1E3A5F',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusText: {
        color: '#fff',
        fontSize: 24,
        lineHeight: 24,
    },
    optionsContainer: {
        position: 'absolute',
        top: 60,
        right: 10,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        elevation: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        zIndex: 20,
    },
    optionButton: {
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    optionText: {
        fontSize: 16,
        color: '#1E3A5F',
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
