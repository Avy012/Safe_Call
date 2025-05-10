import { StyleSheet } from 'react-native';

const mainStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#f5edf9',
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default mainStyle;
