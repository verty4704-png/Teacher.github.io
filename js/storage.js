const STORAGE_KEY = 'teacher_data';

function savePlayerData(player, completedLessons, achievements, examData) {
  const data = {
    xp: player.xp,
    level: player.level,
    hearts: player.hearts,
    maxHearts: player.maxHearts,
    lastHeartRefill: player.lastHeartRefill,
    avatar: player.avatar,
    frame: player.frame,
    theme: document.body.classList.contains('dark') ? 'dark' : 'light',
    inventory: player.inventory,
    completedLessons: completedLessons,
    achievements: achievements,
    examPassed: examData.passed,
    examScore: examData.score,
    userName: examData.userName
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadPlayerData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}
