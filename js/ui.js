// Отрисовка интерфейса и обработка упражнений
class UI {
  constructor(player, onSave) {
    this.player = player;
    this.onSave = onSave;
    this.currentScreen = 'home';
    this.currentLesson = null;
    this.currentExerciseIndex = 0;
    this.currentCategory = null;
  }

  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId + 'Screen').classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => {
      b.classList.remove('active');
      if (b.dataset.screen === screenId) b.classList.add('active');
    });
    this.currentScreen = screenId;
    this.refreshUI();
  }

  refreshUI() {
    document.getElementById('heartsDisplay').innerHTML = '❤️'.repeat(this.player.hearts) + '🖤'.repeat(this.player.maxHearts - this.player.hearts);
    document.getElementById('xpDisplay').textContent = this.player.xp + ' XP';
    document.getElementById('levelDisplay').textContent = 'Ур. ' + this.player.level;
    const xpForNext = this.player.getXPForNextLevel();
    const progress = Math.min(100, (this.player.xp / xpForNext) * 100);
    document.getElementById('xpFill').style.width = progress + '%';
    this.renderLevelMap();
    this.renderProfileInfo();
  }

  renderLessonsList(category) {
    document.getElementById('lessonTitle').textContent = category === 'grammar' ? '📖 Grammar' : '🔤 Vocabulary';
    const listDiv = document.getElementById('lessonList');
    listDiv.innerHTML = '';
    for (let key in lessons[category]) {
      const lessonId = `${category}/${key}`;
      const completed = completedLessons.includes(lessonId);
      const btn = document.createElement('button');
      btn.className = 'btn' + (completed ? ' disabled' : '');
      btn.textContent = (completed ? '✅ ' : '') + lessons[category][key].title;
      if (!completed) {
        btn.onclick = () => this.startLesson(category, key);
      }
      listDiv.appendChild(btn);
    }
    document.getElementById('backToHome').onclick = () => this.showScreen('home');
    this.showScreen('lessons');
  }

  startLesson(category, lessonKey) {
    if (this.player.hearts <= 0) {
      alert('Нет жизней! Купите в магазине или подождите.');
      return;
    }
    this.currentCategory = category;
    this.currentLesson = lessons[category][lessonKey];
    this.currentExerciseIndex = 0;
    this.showScreen('exercise');
    this.renderExercise();
  }

  renderExercise() {
    const ex = this.currentLesson.exercises[this.currentExerciseIndex];
    const container = document.getElementById('exerciseContent');
    const feedback = document.getElementById('exerciseFeedback');
    const nextBtn = document.getElementById('nextExerciseBtn');
    feedback.textContent = '';
    nextBtn.style.display = 'none';
    let html = `<h3>${this.currentLesson.title}</h3><p>Вопрос ${this.currentExerciseIndex+1}/${this.currentLesson.exercises.length}</p>`;

    switch (ex.type) {
      case 'choice':
        html += `<p>${ex.q}</p>`;
        ex.opts.forEach((opt, i) => html += `<div class="option" data-index="${i}">${opt}</div>`);
        break;
      case 'input':
        html += `<p>${ex.q}</p><input type="text" id="answerInput" placeholder="Введите ответ" class="text-input">`;
        html += `<button class="btn" id="submitInput">Проверить</button>`;
        break;
      case 'match':
        html += `<p>${ex.q}</p>`;
        ex.pairs.forEach(pair => {
          html += `<div class="match-row"><span>${pair[0]}</span> ➔ <input type="text" class="matchInput" data-correct="${pair[1]}"></div>`;
        });
        html += `<button class="btn" id="submitMatch">Проверить</button>`;
        break;
      case 'translation':
        html += `<p>${ex.q}</p><input type="text" id="transInput" placeholder="Перевод" class="text-input">`;
        html += `<button class="btn" id="submitTrans">Проверить</button>`;
        break;
    }

    html += `<button class="speak-btn" id="speakBtn">🔊</button>`;
    container.innerHTML = html;

    // Обработчики
    if (ex.type === 'choice') {
      document.querySelectorAll('.option').forEach(el => {
        el.onclick = () => {
          const chosen = parseInt(el.dataset.index);
          document.querySelectorAll('.option').forEach(o => o.classList.remove('correct','wrong'));
          if (chosen === ex.correct) {
            el.classList.add('correct');
            feedback.textContent = '✅ Правильно! +10 XP';
            this.player.addXP(10);
          } else {
            el.classList.add('wrong');
            document.querySelector(`.option[data-index="${ex.correct}"]`).classList.add('correct');
            feedback.textContent = '❌ Ошибка! -1 жизнь';
            if (this.player.loseHeart()) this.onSave();
          }
          nextBtn.style.display = 'block';
          this.onSave();
        };
      });
    } else if (ex.type === 'input') {
      document.getElementById('submitInput').onclick = () => {
        const ans = document.getElementById('answerInput').value.trim().toLowerCase();
        if (ans === ex.correct.toLowerCase()) {
          feedback.textContent = '✅ Правильно! +10 XP';
          this.player.addXP(10);
        } else {
          feedback.textContent = `❌ Ошибка! Правильно: ${ex.correct}`;
          if (this.player.loseHeart()) this.onSave();
        }
        nextBtn.style.display = 'block';
        this.onSave();
      };
    } else if (ex.type === 'match') {
      document.getElementById('submitMatch').onclick = () => {
        let allCorrect = true;
        document.querySelectorAll('.matchInput').forEach(inp => {
          if (inp.value.trim().toLowerCase() !== inp.dataset.correct.toLowerCase()) {
            allCorrect = false;
            inp.style.border = '2px solid red';
          } else {
            inp.style.border = '2px solid green';
          }
        });
        if (allCorrect) {
          feedback.textContent = '✅ Всё верно! +15 XP';
          this.player.addXP(15);
        } else {
          feedback.textContent = '❌ Есть ошибки. -1 жизнь';
          if (this.player.loseHeart()) this.onSave();
        }
        nextBtn.style.display = 'block';
        this.onSave();
      };
    } else if (ex.type === 'translation') {
      document.getElementById('submitTrans').onclick = () => {
        const ans = document.getElementById('transInput').value.trim().toLowerCase();
        if (ans === ex.correct.toLowerCase()) {
          feedback.textContent = '✅ Отлично! +10 XP';
          this.player.addXP(10);
        } else {
          feedback.textContent = `❌ Ошибка! Правильный перевод: ${ex.correct}`;
          if (this.player.loseHeart()) this.onSave();
        }
        nextBtn.style.display = 'block';
        this.onSave();
      };
    }

    document.getElementById('speakBtn').onclick = () => {
      if ('speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(ex.q);
        utter.lang = 'en-US';
        window.speechSynthesis.speak(utter);
      }
    };

    nextBtn.onclick = () => {
      this.currentExerciseIndex++;
      if (this.currentExerciseIndex < this.currentLesson.exercises.length) {
        this.renderExercise();
      } else {
        const lessonId = `${this.currentCategory}/${Object.keys(lessons[this.currentCategory]).find(k => lessons[this.currentCategory][k] === this.currentLesson)}`;
        if (!completedLessons.includes(lessonId)) {
          completedLessons.push(lessonId);
          this.player.addXP(20);
          alert('Урок пройден! +20 XP');
        }
        this.onSave();
        this.renderLessonsList(this.currentCategory);
      }
    };
  }

  renderLevelMap() {
    const container = document.getElementById('levelMap');
    if (!container) return;
    let html = '';
    for (let i = 1; i <= 5; i++) {
      const unlocked = this.player.level >= i || i === 1;
      html += `<div class="level-circle" style="background:${unlocked ? '#4f46e5' : '#cbd5e1'};">${i}</div>`;
    }
    container.innerHTML = html;
  }

  renderShop() {
    const container = document.getElementById('shopItems');
    container.innerHTML = '';
    shopItems.forEach(item => {
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `<p><strong>${item.name}</strong> — ${item.price} XP</p>
        <button class="btn buy-btn" data-id="${item.id}" ${this.player.xp < item.price && item.price > 0 ? 'disabled' : ''}>Купить</button>`;
      container.appendChild(div);
    });
    document.querySelectorAll('.buy-btn').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const item = shopItems.find(i => i.id === id);
        if (this.player.xp < item.price) {
          alert('Недостаточно XP!');
          return;
        }
        this.player.xp -= item.price;
        const success = item.action(this.player);
        if (success) {
          alert('Покупка совершена!');
        } else {
          alert('Нельзя купить этот предмет сейчас.');
          this.player.xp += item.price; // откат
          return;
        }
        this.onSave();
        this.renderShop();
        this.refreshUI();
      };
    });
  }

  renderProfileInfo() {
    const info = document.getElementById('profileInfo');
    if (!info) return;
    info.innerHTML = `
      <div class="profile-avatar">${this.player.avatar}</div>
      <p><strong>${examData.userName || 'Ученик'}</strong></p>
      <p>Уровень ${this.player.level} | ${this.player.xp} XP</p>
      <p>Сердец: ${'❤️'.repeat(this.player.hearts)}</p>
      <p>Пройдено уроков: ${completedLessons.length}</p>
    `;
  }

  showCertificate() {
    if (!examData.passed) {
      alert('Сначала сдайте экзамен!');
      return;
    }
    const container = document.getElementById('certificateContainer');
    container.innerHTML = createCertificateHTML(examData.userName, this.player.level, examData.score, this.player.avatar);
  }
}
