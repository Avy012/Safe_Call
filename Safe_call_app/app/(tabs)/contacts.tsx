import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../services/firebaseConfig';


interface Contact {
  id: string;
  name: string;
  phone: string;
  profilePic: string | null;
}

const Contacts = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [blockedIds, setBlockedIds] = useState<string[]>([]);

  const formatPhoneNumber = (num: string) => { // 01012341234 -> 010-1234-1234
  if (!num || num.length !== 11) return num; // return as-is if invalid
  return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7)}`;
};


  useEffect(() => {
    const fetchContactsAndBlocked = async () => {
      try {
        const currentUserId = auth.currentUser?.uid;
        if (!currentUserId) return;

        // Get blocked users
        const blockedSnap = await getDocs(collection(db, `users/${currentUserId}/blockedUsers`));
        const blocked = blockedSnap.docs.map(doc => doc.id);
        setBlockedIds(blocked);

        // Get all users
        const snapshot = await getDocs(collection(db, 'users'));
        const all = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || '이름 없음',
            phone: data.phone || '알 수 없음',
            profilePic:
              typeof data.profilePic === 'string' && data.profilePic.startsWith('http')
                ? data.profilePic
                : null,
          };
        }) as Contact[];

        // Filter out self
        const filtered = all.filter(user => user.id !== currentUserId);
        setContacts(filtered);
      } catch (error) {
        console.error('❌ Failed to load contacts:', error);
      }
    };

    fetchContactsAndBlocked();
  }, []);

  const filteredContacts = contacts.filter(contact =>
    !blockedIds.includes(contact.id) &&
    (contact.name?.toLowerCase?.() ?? '').includes(search.toLowerCase())
  );

  const addContactToDatabase = async (contact: Contact) => {
    try {
      console.log('Saving to DB:', contact);
    } catch (error) {
      console.error('DB Save Failed:', error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="bg-primary px-4 py-4">
        <Text className="text-white text-2xl font-bold">연락처</Text>
      </View>

      {/* 검색창 */}
      <View className="flex-row items-center h-[60px] bg-gray-100 px-3">
        <TextInput
          className="flex-1 bg-white rounded-md px-3 h-10 border border-gray-300"
          placeholder="검색어를 입력해주세요"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity
          className="ml-2 w-10 h-10 bg-[#1E3A5F] rounded-full justify-center items-center"
          onPress={() => setShowOptions(prev => !prev)}
        >
          <Text className="text-white text-xl font-bold">+</Text>
        </TouchableOpacity>
      </View>

      {/* 옵션 메뉴 */}
      {showOptions && (
        <View className="absolute right-4 top-[110px] bg-white rounded-md shadow-md z-50 p-2">
          <TouchableOpacity className="py-2" onPress={() => router.push('/keypad')}>
            <Text className="text-[#1E3A5F] text-base">전화 걸기</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-2" onPress={() => setShowModal(true)}>
            <Text className="text-[#1E3A5F] text-base">연락처 추가</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 연락처 목록 */}
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const safeProfilePic =
            typeof item.profilePic === 'string'
              ? { uri: item.profilePic }
              : require('@/assets/images/default_profile.jpg');

          return (
            <TouchableOpacity
              className="px-4 py-3 border-b border-gray-200"
              onPress={() => router.push(`/calls/${item.id}`)}
            >
              <View className="flex-row items-center ">
                <Image
                  source={safeProfilePic}
                  // className="w-14 h-14 rounded-full mr-4 bg-gray-200"
                  style={{ width: 50, height: 50, borderRadius: 50, backgroundColor: 'gray' }}
                />
                <View className="ml-4">
                  <Text className="text-lg font-medium text-gray-900">{item.name}</Text>
                  <Text className="text-sm text-gray-500">{formatPhoneNumber(item.phone)}</Text>
                </View>
              </View>

            </TouchableOpacity>
          );
        }}
      />

      {/* 연락처 추가 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-xl w-[320px] p-5">
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

const AddContact = ({
  closeModal,
  onAddContact,
}: {
  closeModal: () => void;
  onAddContact: (contact: Contact) => void;
}) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  const add = () => {
    const newContact: Contact = {
      id: String(Date.now()),
      name,
      phone: number,
      profilePic: 'https://via.placeholder.com/100',
    };
    onAddContact(newContact);
    setName('');
    setNumber('');
    closeModal();
  };

  return (
    <View className="bg-white rounded-xl">
      <Text className="text-xl font-bold text-center mb-4">연락처 추가</Text>

      <Text className="text-sm text-gray-600 mb-2 ml-1">연락처명</Text>
      <TextInput
        className="border border-gray-300 rounded-md px-3 h-10 mb-4"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />

      <Text className="text-sm text-gray-600 mb-2 ml-1">전화번호</Text>
      <TextInput
        className="border border-gray-300 rounded-md px-3 h-10 mb-4"
        placeholderTextColor="#aaa"
        value={number}
        onChangeText={setNumber}
      />

      <TouchableOpacity className="bg-[#1E3A5F] rounded-full h-10 justify-center items-center mb-3" onPress={add}>
        <Text className="text-white font-bold">추가</Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-gray-400 rounded-full h-10 justify-center items-center" onPress={closeModal}>
        <Text className="text-white font-bold">닫기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Contacts;
