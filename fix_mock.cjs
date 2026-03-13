const fs = require('fs');
let lines = fs.readFileSync('src/services/mockData.ts', 'utf8').split('\n');

let out = [];
let inOldUsers = false;
let inOldDisc = false;
let usersCount = 0;
let discCount = 0;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  line = line.replace(/\uFEFF/g, ''); // strip BOM
  
  if (line.includes('export const MOCK_USERS:')) {
    usersCount++;
    if (usersCount === 1) { inOldUsers = true; continue; }
  }
  if (inOldUsers && line.startsWith('];')) {
    inOldUsers = false; continue;
  }
  if (inOldUsers) continue;

  if (line.includes('export const MOCK_DISCIPLINAS:')) {
    discCount++;
    if (discCount === 1) { inOldDisc = true; continue; }
  }
  if (inOldDisc && line.startsWith('];')) {
    inOldDisc = false; continue;
  }
  if (inOldDisc) continue;
  
  // Clean dangling semicolon from previous script error
  if (line.trim() === ';' && lines[i-1] && lines[i-1].includes('}')) continue;

  out.push(line);
}

fs.writeFileSync('src/services/mockData.ts', out.join('\n'), 'utf8');
console.log('File sanitized successfully');
