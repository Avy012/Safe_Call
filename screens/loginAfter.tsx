// import React from 'react';
// import { Text, View } from 'react-native';
// import loginAfterStyle from '../styles/loginAfter.style';

// const LoginAfter = ({ navigation }) => {
//   return (
//     <View style={loginAfterStyle.container}>
//       <Text style={loginAfterStyle.text}>이메일 인증 완료! 로그인 후 페이지입니다.</Text>
//     </View>
//   );
// };

// export default LoginAfter;
// src/Loginafter.tsx

import React from 'react';
import { Text, View } from 'react-native';
import loginAfterStyle from '../styles/loginAfter.style';

const LoginAfter = () => {
  return (
    <View style={loginAfterStyle.container}>
      <Text style={loginAfterStyle.text}>이메일 인증 완료! 로그인 후 페이지입니다.</Text>
    </View>
  );
};

export default LoginAfter;
