<<<<<<< HEAD
=======
import { View, Text, TextInput, FlatList, StyleSheet, Image } from 'react-native';
>>>>>>> 37f020e (챗, 전화 목록 추가)
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from "expo-router";

interface Contact {
    id: string;
    name: string;
}

const Contacts = () => {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [showModal, setShowModal] = useState(false); // 모달 상태 추가

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
<<<<<<< HEAD
=======


            {/* Search Bar */}
>>>>>>> 37f020e (챗, 전화 목록 추가)
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
                        onPress={() => setShowModal(true)}  // 모달 띄우기
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
<<<<<<< HEAD
                contentContainerStyle={{ paddingTop: showOptions ? 120 : 80 }}
=======
                contentContainerStyle={{ paddingTop: 120 }} // Prevents list from going under the search bar and logo
>>>>>>> 37f020e (챗, 전화 목록 추가)
            />

            {/* AddContact 모달 */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <AddContact closeModal={() => setShowModal(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const AddContact = ({ closeModal }: { closeModal: () => void }) => {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const addContact = () => {
        alert(`새 연락처 추가: ${name}`);
        setName('');
        setNumber('');
        closeModal();  // 추가 후 모달 닫기
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>연락처 추가</Text>
            <Text style={styles.title2}>연락처명</Text>
            <TextInput
                style={styles.input}
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={setName}
            />
            <Text style={styles.title2}>전화번호</Text>
            <TextInput
                style={styles.input}
                placeholderTextColor="#aaa"
                value={number}
                onChangeText={setNumber}
            />
            <TouchableOpacity style={styles.button} onPress={addContact}>
                <Text style={styles.buttonText}>추가</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={closeModal}>
                <Text style={styles.buttonText}>닫기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
<<<<<<< HEAD
    container: { flex: 1, backgroundColor: '#fff' },
=======
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    logoBar: {
        height: 60,
        backgroundColor: '#4CAF50',  // Green background (you can change this to your desired color)
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3, // Adds shadow on Android
        zIndex: 10,  // Ensures the bar stays above other components
    },
    logoText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
>>>>>>> 37f020e (챗, 전화 목록 추가)
    searchContainer: {
        position: 'absolute',
        top: 60,  // Adjust this value to avoid overlap with the logo bar
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 0,
        borderRadius: 8,
        width: 30,
        height: 30,
    },
    card: {
        width: 372,
        height: 360,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        elevation: 6,
        opacity: 0.92,
        padding: 20,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#CCC',
        marginBottom: 100,
    },
    title: {
        fontSize: 22,
        marginBottom: 16,
        color: '#333',
        textAlign: 'center',
    },
    title2: {
        fontSize: 15,
        marginBottom: 13,
        color: '#333',
        textAlign: 'left',
        marginLeft: 20,
    },
    input: {
        width: '90%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 16,
        marginLeft: 20,
    },
    button: {
        backgroundColor: '#1E3A5F',
        width: 80,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '40%',
        margin:7
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Contacts;
