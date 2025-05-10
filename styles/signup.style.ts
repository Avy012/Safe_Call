import { StyleSheet } from 'react-native';

const signupStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
     //'flex-start' or 'center'
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  verifyButton: {
    backgroundColor: '#f5edf9',
    padding: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginVertical: 10,
  },
  verifyText: {
    fontSize: 14,
  },
  signupButton: {
    backgroundColor: '#f5edf9',
    padding: 15,
    borderRadius: 30,
    alignSelf: 'center',
    paddingHorizontal: 50,
    marginTop: 10,
  },
  signupText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default signupStyle;
