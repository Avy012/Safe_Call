import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from "expo-router";
import { fetchToken, connectToRoom } from '../generate_room';

interface Contact {
    id: string;
    name: string;
}

const Contacts = () => {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [showModal, setShowModal] = useState(false); // 모달 상태 추가
    // const [contacts, setContacts] = useState<Contact[]>([
    //     { id: '1', name: 'Alice Johnson' },
    //     { id: '2', name: 'Bob Smith' },
    //     { id: '3', name: 'Charlie Brown' },
    //     { id: '4', name: 'David Williams' },
    //     { id: '5', name: 'Emma Watson' }
    // ]);
    
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [newContact, setNewContact] = useState({ name: '', contact: '' });

    // DB 초기 로드
    useEffect(() => {
        (async () => {
            try {
                console.log('fetching contacts from http://10.0.2.2:5000/added_contacts');
                const res = await fetch('http://10.0.2.2:5000/added_contacts');

                // 네트워크 응답 상태
                if (!res.ok) {
                    console.error('fetch contacts failed, status: ', res.status);
                    throw new Error(`fetch contacts failed: ${res.status}`);
                }
                const list: Contact[] = await res.json();
                console.log('fetched contacts: ', list);
                setContacts(list);
            } catch {
                console.error('loading contacts failed', Error);
            }
        })();
    }, []);
    
    // 새 연락처 추가 핸들러
    const addNewContact = async () => {
        try {
            // 백엔드에 post 
            const res = await fetch(`http://10.0.2.2:5000/added_contacts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_uid: 'currentUserUid',
                    contact_uid: 'newContactUidOrEmpty',
                    name: newContact.name,
                    contact: newContact.contact
                }),
            });
            if (!res.ok) throw new Error('API error ' + res.status);

            // 응답: 새로운 레코드
            const saved: Contact = await res.json();

            // 로컬 상태에 반영
            setContacts(prev => [...prev, saved]);

            // 모달 닫고 입력 초기화
            setShowModal(false);
            setNewContact({ name: '', contact: '' });
        } catch (e) {
        console.error('contact add failed');    
        }
    };

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View className="flex-1 bg-white">
              <View className="bg-primary px-4 py-4">
                <Text className="text-white text-2xl font-bold">Contacts</Text>
              </View> 


            {/* Search Bar */}
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
                        onPress={() => router.push(`/calls/${item.id}?name=${item.name}`)} // 나중에 수정할 부분
                    >
                        <Text style={styles.contactText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingTop: showOptions ? 120 : 80 }}
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
    }

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
    container: { flex: 1, backgroundColor: '#fff' },
    searchContainer: {
        top: 70,  // Adjust this value to avoid overlap with the logo bar
        left: 0,
        right: 0,
        height: 60,
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
