const stations = [
  "Hubli", "HDMC", "KIMS", "Unkal", "Navanagar",
  "SDM Medical", "Sattur", "Gandhinagar", "Toll Naka", "Dharwad"
];

const graph = [
  [0,  2,  5,  6,  10, 14, 16, 19, 20, 25],
  [2,  0,  3,  4,  8,  12, 14, 17, 18, 23],
  [5,  3,  0,  1,  5,  9,  11, 13, 15, 20],
  [6,  4,  1,  0,  4,  8,  10, 13, 14, 19],
  [10, 8,  5,  4,  0,  4,  6,  9,  10, 15],
  [14, 12, 9,  8,  4,  0,  2,  5,  6,  11],
  [16, 14, 11, 10, 6,  2,  0,  3,  4,  9],
  [19, 17, 13, 13, 9,  5,  3,  0,  1,  6],
  [20, 18, 15, 14, 10, 6,  4,  1,  0,  5],
  [25, 23, 20, 19, 15, 11, 9,  6,  5,  0]
];

const startSelect = document.getElementById('start');
const endSelect = document.getElementById('end');
const resultsDiv = document.getElementById('results');
const spinner = document.getElementById('spinner');
const findBtn = document.getElementById('findBtn');

function populateDropdowns() {
  stations.forEach(station => {
    const option1 = document.createElement('option');
    option1.value = station;
    option1.textContent = station;
    startSelect.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = station;
    option2.textContent = station;
    endSelect.appendChild(option2);
  });
}

function dijkstra(graph, startIndex, endIndex) {
  const dist = Array(graph.length).fill(Infinity);
  const visited = Array(graph.length).fill(false);
  const prev = Array(graph.length).fill(null);
  dist[startIndex] = 0;

  for (let i = 0; i < graph.length; i++) {
    let u = -1;
    for (let j = 0; j < graph.length; j++) {
      if (!visited[j] && (u === -1 || dist[j] < dist[u])) u = j;
    }
    if (dist[u] === Infinity) break;
    visited[u] = true;

    for (let v = 0; v < graph.length; v++) {
      if (graph[u][v] !== 0 && dist[u] + graph[u][v] < dist[v]) {
        dist[v] = dist[u] + graph[u][v];
        prev[v] = u;
      }
    }
  }

  const path = [];
  let current = endIndex;
  while (current !== null) {
    path.unshift(current);
    current = prev[current];
  }

  return dist[endIndex] === Infinity ? { distance: Infinity, path: [] } : { distance: dist[endIndex], path };
}

function updateButtonState() {
  findBtn.disabled = startSelect.value === "" || endSelect.value === "" || startSelect.value === endSelect.value;
}

function formatPath(path) {
  return path.map(i => stations[i]).join(" → ");
}

function showResults(distance, path) {
  resultsDiv.innerHTML = distance === Infinity
    ? "No path found between selected stations."
    : `<strong>Shortest path:</strong> ${formatPath(path)}<br><strong>Distance:</strong> ${distance} km`;
}

startSelect.addEventListener('change', () => {
  updateButtonState();
  resultsDiv.textContent = "";
});
endSelect.addEventListener('change', () => {
  updateButtonState();
  resultsDiv.textContent = "";
});

findBtn.addEventListener('click', () => {
  resultsDiv.textContent = "";
  spinner.style.display = "block";
  findBtn.disabled = true;

  setTimeout(() => {
    const startIndex = stations.indexOf(startSelect.value);
    const endIndex = stations.indexOf(endSelect.value);
    const { distance, path } = dijkstra(graph, startIndex, endIndex);
    showResults(distance, path);
    spinner.style.display = "none";
    findBtn.disabled = false;
  }, 800);
});

populateDropdowns();
updateButtonState();