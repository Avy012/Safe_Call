import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal, Image  } from 'react-native';
import { useRouter } from "expo-router";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';

interface Contact {
  id: string;
  name: string;
  phone: string;
  profilePic: string;
}




const Contacts = () => {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
            const snapshot = await getDocs(collection(db, 'users'));
            const contactList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Contact[];
            setContacts(contactList);
            } catch (error) {
            console.error('Failed to load contacts:', error);
            }
        };

        fetchContacts();
    }, []);


    const filteredContacts = contacts.filter(contact =>
        (contact.name?.toLowerCase?.() ?? '').includes(search.toLowerCase())
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
                        onPress={() =>
                            router.push({
                                pathname: `/calls/${item.id}`,
                                params: {
                                name: item.name,
                                phone: item.phone,
                                profilePic: item.profilePic,
                                },
                            })
                         }
                    >
                        <Image source={{ uri: item.profilePic }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
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
            profilePic: 'https://via.placeholder.com/100', // ✅ placeholder image
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
