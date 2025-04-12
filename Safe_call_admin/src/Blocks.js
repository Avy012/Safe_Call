// src/Blocks.js
import React from "react";

function Blocks() {
  return (
    <section id="blocks" className="page">
      <h1>Blocks</h1>
      <div className="content-container">
        <div className="block-container">
          <div className="block-card">전체 차단 수</div>
          <div className="block-card">사용자별 평균 차단 수</div>
          <div className="block-card">총 사용자 수</div>
        </div>
        <div className="manage-blocklist">
          <h2>사용자 최다 차단 번호</h2>
          <div className="blocklist">
            <div className="block-item"><span>1</span><input type="text" /><button>✖</button></div>
            <div className="block-item"><span>2</span><input type="text" /><button>✖</button></div>
            <div className="block-item"><span>3</span><input type="text" /><button>✖</button></div>
            <div className="block-item"><span>4</span><input type="text" /><button>✖</button></div>
          </div>
        </div>
        <div className="sidebar">
          <h3>평균 Scam 종합</h3>
          <canvas id="chart"></canvas>
          <button>보안 관리</button>
          <button>사용자 관리자자</button>
        </div>
      </div>
    </section>
  );
}

export default Blocks;