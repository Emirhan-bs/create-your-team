const players = [];

function updateLabel(val) {
  document.getElementById("team-size-label").textContent = val;
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createBalancedTeams() {
  if (players.length % 2 !== 0) {
    alert("Kişi sayısı eksik ya da fazla!!!");
    return;
  }
  const totalTeams = 2;
  const teamSize = Math.ceil(players.length / totalTeams);
  const teams = Array.from({ length: totalTeams }, () => []);

  // Gruplara ayır
  const groups = {
    4: [],
    3: [],
    2: [],
    1: [],
    GK: [],
  };

  players.forEach((p) => groups[p.skill].push(p));
  for (let group of Object.values(groups)) shuffle(group);

  // Dengeli dağıtım
  for (let skill of ["4", "3", "2", "1"]) {
    while (groups[skill].length > 0) {
      for (let t of teams) {
        if (groups[skill].length === 0) break;
        if (t.length < teamSize) t.push(groups[skill].pop());
      }
    }
  }

  // Kalecileri dağıt
  while (groups["GK"].length > 0) {
    teams.sort((a, b) => countGoalkeepers(a) - countGoalkeepers(b));
    for (let t of teams) {
      if (groups["GK"].length === 0) break;
      if (countGoalkeepers(t) < 2 && t.length < teamSize) {
        t.push(groups["GK"].pop());
      }
    }
  }

  shuffle(teams); // A, B, C diye rastgele diz
  displayTeams(teams);
}

function countGoalkeepers(team) {
  return team.filter((p) => p.skill === "GK").length;
}

function displayTeams(teams) {
  const output = document.getElementById("teams-output");
  output.innerHTML = teams
    .map(
      (team, i) => `
    <div>
      <strong>Takım ${String.fromCharCode(65 + i)}</strong>
      <ul>
        ${team
          .map((p) => `<li>${p.name} - ${skillLabel(p.skill)}</li>`)
          .join("")}
      </ul>
    </div>
  `
    )
    .join("");
}
function displayPlayers() {
  const list = document.getElementById("player-list");
  list.innerHTML = players
    .map(
      (p, i) =>
        `<li>
         ${p.name} - ${skillLabel(p.skill)} 
         <button onclick="removePlayer(${i})">❌</button>
       </li>`
    )
    .join("");
}
function removePlayer(index) {
  players.splice(index, 1);
  displayPlayers();
}
function skillLabel(skill) {
  const labels = {
    4: "Forvet",
    3: "Kanat",
    2: "Orta Saha",
    1: "Defans",
    GK: "Kaleci",
  };
  return labels[skill] || "Bilinmiyor";
}
document.getElementById("name-input").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault(); // Sayfanın form gönderimi gibi davranmasını engeller
    addPlayer(); // Oyuncu ekle
  }
});
// İsim girişi ve takımların gösterimi için ilk harfi büyük yapma
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function addPlayer() {
  const name = capitalizeFirstLetter(
    document.getElementById("name-input").value.trim()
  );
  const skill = document.getElementById("skill-select").value;

  if (!name) return alert("İsim girilmeli.");
  players.push({ name, skill });
  document.getElementById("name-input").value = "";
  displayPlayers();
}

function displayTeams(teams) {
  const output = document.getElementById("teams-output");
  output.innerHTML = teams
    .map(
      (team, i) => `
    <div>
      <strong>Takım ${String.fromCharCode(65 + i)}</strong>
      <ul>
        ${team
          .map(
            (p) =>
              `<li>${capitalizeFirstLetter(p.name)} - ${skillLabel(
                p.skill
              )}</li>`
          )
          .join("")}
      </ul>
    </div>
  `
    )
    .join("");
}
