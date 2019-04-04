(function() {
  const MAX_COUNT = 10;

  function addData(username, stage) {
    const usernameCeil = document.createElement('td');
    usernameCeil.innerHTML = username;
    const stageCeil = document.createElement('td');
    stageCeil.innerHTML = stage;
    const row = document.createElement('tr');
    row.appendChild(usernameCeil);
    row.appendChild(stageCeil);
    const table = document.getElementById('score-table');
    table.appendChild(row);
  }

  window.addEventListener('load', () => {
    const request = new XMLHttpRequest();
    request.open('POST', 'SessionController.php', true);
    request.setRequestHeader('Content-Type',
        'application/x-www-form-urlencoded');
    request.send("leaderboard=1");
    request.addEventListener('readystatechange', () => {
      if (request.readyState === 4 && request.status === 200) {
        const arr = JSON.parse(request.responseText);
        for (const obj of arr) {
          addData(obj.username, obj.highest_level_beaten);
        }
      }
    });
  });
})();
