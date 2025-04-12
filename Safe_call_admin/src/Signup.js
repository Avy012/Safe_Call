// src/Signup.js
import React from "react";

function Signup() {
  return (
    <section id="signup" className="page">
      <h2>Sign up</h2>
      <div className="signup-container">
        <div className="personal-info">
          <h3>개인정보</h3>
          <label htmlFor="name">이름</label>
          <input type="text" id="name" name="name" />
          <label htmlFor="birth">생년월일</label>
          <input type="date" id="birth" name="birth" />
          <label htmlFor="contact">전화번호</label>
          <input type="text" id="contact" name="contact" />
        </div>
        <div className="account-info">
          <h3>ID 및 PW</h3>
          <label htmlFor="signup-id">ID</label>
          <input type="text" id="signup-id" name="signup-id" />
          <label htmlFor="signup-pw">PW</label>
          <input type="password" id="signup-pw" name="signup-pw" />
        </div>
      </div>
      <button className="signup-btn">회원가입</button>
    </section>
  );
}

export default Signup;