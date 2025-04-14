<script>
  function showSection(sectionId) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    const indexMap = { analytics: 0, blocks: 1, login: 2, signup: 3 };
    document.querySelectorAll('nav button')[indexMap[sectionId]].classList.add('active');
  }

  window.onload = () => {
    // 기본 보여질 섹션
    showSection('analytics');

    // 일간 사용자 수 차트
    const dailyUserCtx = document.getElementById('dailyUserChart').getContext('2d');
    new Chart(dailyUserCtx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Daily Users',
          data: [20000, 34000, 29000, 15000, 18000, 22000, 26000],
          backgroundColor: '#4CAF50'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // 사기 비율 차트
    const scamRatioCtx = document.getElementById('scamRatioChart').getContext('2d');
    new Chart(scamRatioCtx, {
      type: 'doughnut',
      data: {
        labels: ['Scam Calls', 'Normal Calls'],
        datasets: [{
          data: [5000, 45000],
          backgroundColor: ['#FF6384', '#36A2EB']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });

    // 블록 관련 차트 (sidebar)
    const chartCtx = document.getElementById('chart').getContext('2d');
    new Chart(chartCtx, {
      type: 'pie',
      data: {
        labels: ['Blocked', 'Not Blocked'],
        datasets: [{
          data: [12000, 38000],
          backgroundColor: ['#FFCE56', '#4BC0C0']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  };
</script>
