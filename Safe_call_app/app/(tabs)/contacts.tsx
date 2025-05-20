import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from "expo-router";

interface Contact {
    id: string;
    name: string;
    phone: string;
}

const Contacts = () => {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([
  { id: '1', name: 'Alice Johnson', phone: '010-1234-0001' },
  { id: '2', name: 'Bob Smith', phone: '010-1234-0002' },
  { id: '3', name: 'Charlie Brown', phone: '010-1234-0003' },
  { id: '4', name: 'David Williams', phone: '010-1234-0004' },
  { id: '5', name: 'Emma Watson', phone: '010-1234-0005' },
  { id: '6', name: 'Olivia Davis', phone: '010-1234-0006' },
  { id: '7', name: 'Liam Thompson', phone: '010-1234-0007' },
  { id: '8', name: 'Sophia Miller', phone: '010-1234-0008' },
  { id: '9', name: 'James Anderson', phone: '010-1234-0009' },
  { id: '10', name: 'Isabella Moore', phone: '010-1234-0010' },
  { id: '11', name: 'Noah Taylor', phone: '010-1234-0011' },
  { id: '12', name: 'Mia Clark', phone: '010-1234-0012' },
  { id: '13', name: 'Elijah Lewis', phone: '010-1234-0013' },
  { id: '14', name: 'Ava Hall', phone: '010-1234-0014' },
  { id: '15', name: 'Lucas Young', phone: '010-1234-0015' },
]);


    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(search.toLowerCase())
    );

    const addContactToDatabase = async (contact: Contact) => {
        try {
            // TODO: Replace with actual DB call
            console.log("Saving to DB:", contact);
        } catch (error) {
            console.error("DB Save Failed:", error);
        }
    };

    return (
        <View className="flex-1 bg-white">
            <View className="bg-primary px-4 py-4">
                <Text className="text-white text-2xl font-bold">연락처</Text>
            </View>

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
                        onPress={() => setShowModal(true)}
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
                        onPress={() => router.push(`/calls/${item.id}?name=${item.name}&phone=${item.phone}`)}
                    >
                        <Text style={styles.contactText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <AddContact 
                            closeModal={() => setShowModal(false)}
                            onAddContact={(newContact) => {
                                setContacts(prev => [...prev, newContact]);
                                addContactToDatabase(newContact);
                            }} 
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const AddContact = ({ closeModal, onAddContact }: { closeModal: () => void, onAddContact: (contact: Contact) => void }) => {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');

    const add = () => {
        const newContact: Contact = {
            id: String(Date.now()),
            name,
            phone: number,
        };
        onAddContact(newContact);
        setName('');
        setNumber('');
        closeModal();
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
            <TouchableOpacity style={styles.button} onPress={add}>
                <Text style={styles.buttonText}>추가</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={closeModal}>
                <Text style={styles.buttonText}>닫기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    searchContainer: {
        height: 60,
        backgroundColor: '#f0f0f0',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        elevation: 3,
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
        top: 130,
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
        backgroundColor: '#fff',
        borderRadius: 8,
        width: 320,
        padding: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        elevation: 6,
        padding: 20,
        borderWidth: 1,
        borderColor: '#CCC',
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
        marginLeft: 10,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#1E3A5F',
        width: '100%',
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Contacts;
