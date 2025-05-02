// src/Login.js
import React from "react";

function Login() {
  return (
    <section id="login" className="page">
      <h2>Log in</h2>
      <div className="login-box">
        <label htmlFor="id">ID</label>
        <input type="text" id="id" placeholder="ID를 입력하세요" />
        <label htmlFor="pw">PW</label>
        <input type="password" id="pw" placeholder="비밀번호를 입력하세요" />
        <button className="login-btn">로그인</button>
      </div>
    </section>
  );
}

export default Login;
