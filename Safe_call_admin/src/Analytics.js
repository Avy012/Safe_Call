// src/Analytics.js
import React from "react";

function Analytics() {
  return (
    <section id="analytics" className="page">
      <h2>Analytics</h2>
      <div className="analytics-container">
        <div className="card total-calls">
          <span className="label">Total calls</span>
          <span className="value"> <span className="unit"><br />calls</span></span>
        </div>
        <div className="card scam-calls">
          <span className="label">Scam calls</span>
          <span className="value"> <span className="unit"><br />calls</span></span>
        </div>
        <div className="card total-customers">
          <span className="label">Total Customers</span>
          <span className="value"> <span className="unit"><br />people</span></span>
        </div>

        <div className="chart-card">
          <span className="chart-title">어플 이용률</span>
          <span className="chart-value"></span>
          <canvas id="dailyUserChart"></canvas>
          <div className="chart-label">전체 사용률</div>
        </div>

        <div className="sentence-card">
          <h3>신고 빈도가 높은 스캠 문장</h3>
          <div className="sentence-list">
            <div className="sentence-item"><span className="rank">1</span></div>
            <div className="sentence-item"><span className="rank">2</span></div>
            <div className="sentence-item"><span className="rank">3</span></div>
          </div>
        </div>

        <div className="right-chart">
          <span className="chart-title"> 전체 Scam 평균</span>
          <canvas id="scamRatioChart"></canvas>
          <div className="button-group">
            <button>사용자 관리자</button> 
            <button>보안 관리</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Analytics;