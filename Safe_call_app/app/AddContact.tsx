import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

const AddContact = () => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const addContact = () => {
    alert(`새 연락처 추가: ${name}`);
    setName('');
  };

  return (
    <View style={styles.screen}>
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
        <Pressable style={styles.button} onPress={addContact}>
          <Text style={styles.buttonText}>추가</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  card: {
    width: 372,
    height: 306,
    backgroundColor: '#FFFFFF', // 벡터 색상
    borderRadius: 16,
    elevation: 6,
    opacity: 0.92,
    padding: 20,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    marginBottom:100
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
    color: '#333',
    textAlign: 'center'
  },
  title2: {
    fontSize: 15,
    marginBottom: 13,
    color: '#333',
    textAlign :'left',
    marginLeft: 20
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    marginLeft: 20
  },
  button: {
    backgroundColor: '#1E3A5F', // 벡터 버튼 색상
    width: 80,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '40%'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddContact;
