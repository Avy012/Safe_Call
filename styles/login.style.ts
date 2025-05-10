import { StyleSheet } from 'react-native';

const loginStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    //'flex-start' or 'center'
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#f5edf9',
    padding: 15,
    borderRadius: 30,
    alignSelf: 'center',
    paddingHorizontal: 50,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default loginStyle;
