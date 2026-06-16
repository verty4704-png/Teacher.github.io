// Инициализация приложения
let player;
let completedLessons = [];
let achievementsUnlocked = [];
let examData = { passed: false, score: 0, userName: '' };
let ui;

function saveState() {
  savePlayerData(player, completedLessons, achievementsUnlocked, examData);
}

function loadState() {
  const saved = loadPlayerData();
  if (saved) {
    player = new Player();
    player.xp = saved.xp || 0;
    player.level = saved.level || 1;
    player.hearts = saved.hearts || 5;
    player.maxHearts = saved.maxHearts || 5;
    player.lastHeartRefill = saved.lastHeartRefill || Date.now();
    player.avatar = saved.avatar || '😀';
    player.frame = saved.frame || '';
    player.inventory = saved.inventory || ['😀'];
    if (saved.theme === 'dark') document.body.classList.add('dark');
    completedLessons = saved.completedLessons || [];
    achievementsUnlocked = saved.achievements || [];
    examData.passed = saved.examPassed || false;
    examData.score = saved.examScore || 0;
    examData.userName = saved.userName || '';
  } else {
    player = new Player();
    examData.userName = prompt('Введите ваше имя:') || 'Ученик';
    saveState();
  }
}

// Настройка навигации
function setupNavigation() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const screen = btn.dataset.screen;
      if (screen === 'lessons') {
        // по умолчанию показываем grammar, но можно выбрать
        ui.renderLessonsList('grammar');
      } else if (screen === 'shop') {
        ui.showScreen('shop');
        ui.renderShop();
      } else if (screen === 'profile') {
        ui.showScreen('profile');
        ui.refreshUI();
      } else {
        ui.showScreen(screen);
      }
    });
  });

  document.getElementById('goGrammar').addEventListener('click', () => {
    ui.renderLessonsList('grammar');
  });
  document.getElementById('goVocab').addEventListener('click', () => {
    ui.renderLessonsList('vocabulary');
  });

  document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    saveState();
  });

  document.getElementById('takeExam').addEventListener('click', () => {
    if (player.hearts <= 0) {
      alert('Нужна хотя бы 1 жизнь!');
      return;
    }
    const examQuestions = generateExamQuestions(lessons, 20);
    let examIndex = 0;
    let correctCount = 0;

    function showExamQuestion() {
      if (examIndex >= examQuestions.length) {
        const percent = (correctCount / 20) * 100;
        examData.score = percent;
        if (percent >= 80) {
          examData.passed = true;
          player.addXP(100);
          alert(`Экзамен сдан! Результат: ${percent}%. +100 XP`);
        } else {
          alert(`Экзамен не сдан. Результат: ${percent}%. Нужно 80%.`);
        }
        saveState();
        ui.showScreen('profile');
        ui.refreshUI();
        return;
      }
      const ex = examQuestions[examIndex];
      const container = document.getElementById('exerciseContent');
      let html = `<h3>Экзамен ${examIndex+1}/20</h3>`;
      switch (ex.type) {
        case 'choice':
          html += `<p>${ex.q}</p>`;
          ex.opts.forEach((opt, i) => html += `<div class="option" data-index="${i}">${opt}</div>`);
          break;
        case 'input':
          html += `<p>${ex.q}</p><input id="examInput" class="text-input">`;
          html += `<button class="btn" id="examCheck">Ответить</button>`;
          break;
        case 'translation':
          html += `<p>${ex.q}</p><input id="examInput" class="text-input">`;
          html += `<button class="btn" id="examCheck">Ответить</button>`;
          break;
      }
      container.innerHTML = html;
      document.getElementById('exerciseFeedback').textContent = '';
      document.getElementById('nextExerciseBtn').style.display = 'none';

      if (ex.type === 'choice') {
        document.querySelectorAll('.option').forEach(opt => {
          opt.onclick = function() {
            const chosen = parseInt(this.dataset.index);
            document.querySelectorAll('.option').forEach(o => o.classList.remove('correct','wrong'));
            if (chosen === ex.correct) {
              this.classList.add('correct');
              correctCount++;
            } else {
              this.classList.add('wrong');
              document.querySelector(`.option[data-index="${ex.correct}"]`).classList.add('correct');
            }
            examIndex++;
            showExamQuestion();
          };
        });
      } else {
        document.getElementById('examCheck').onclick = () => {
          const ans = document.getElementById('examInput').value.trim().toLowerCase();
          const isCorrect = (ans === ex.correct.toLowerCase());
          if (isCorrect) correctCount++;
          document.getElementById('exerciseFeedback').textContent = isCorrect ? '✅' : '❌';
          examIndex++;
          showExamQuestion();
        };
      }
    }

    ui.showScreen('exercise');
    showExamQuestion();
  });

  document.getElementById('showCertBtn').addEventListener('click', () => {
    ui.showCertificate();
  });

  // Восстановление сердец раз в минуту
  setInterval(() => {
    player.refillHearts();
    saveState();
    ui.refreshUI();
  }, 60000);
}

// Старт
loadState();
ui = new UI(player, saveState);
setupNavigation();
ui.showScreen('home');

// Проверка достижений при каждом сохранении
const origSave = saveState;
saveState = function() {
  origSave();
  const newAch = checkAndAddAchievements(player, completedLessons, achievementsUnlocked, examData.score);
  newAch.forEach(name => alert(`🏆 Новое достижение: ${name}`));
};
