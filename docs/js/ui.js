/**
 * Miljonimäng - kasutajaliides
 *
 * Vastutab:
 * - menüü renderdamise
 * - mänguvaate renderdamise
 * - tulemuse renderdamise
 * - HTML elementide haldamise
 */

const UI = {
  appEl: null,

  init() {
    this.appEl = document.getElementById('app');
  },

  // ─── Menüü ─────────────────────────────────────────────────────

  renderMenu(assignments) {
    if (!this.appEl) return;

    if (assignments.length === 0) {
      this.appEl.innerHTML = `
        <div class="container">
          <div class="menu-card error-card">
            <h1>Miljonimäng</h1>
            <p class="error-text">Ülesandeid ei leitud.</p>
            <p>Palun veendu, et skript <code>npm run generate</code> on käivitatud.</p>
          </div>
        </div>
      `;
      return;
    }

    const cardMeta = {
      '001': { icon: '🧮', type: 'kalkulaator' },
      '002': { icon: '📊', type: 'andmete-kuvamine' },
      '003': { icon: '💻', type: 'tekstiotsing' },
      '004': { icon: '🧪', type: 'testimine' },
    };

    this.appEl.innerHTML = `
      <div class="container">
        <div class="menu-header">
          <h1 class="game-title">Miljonimäng</h1>
          <p class="subtitle">Vali ülesanne, et kontrollida oma arusaamist</p>
        </div>
        <div class="bento-grid" id="assignment-list">
          ${assignments.map(a => {
            const meta = cardMeta[a.id] || { icon: '📝', type: 'kalkulaator' };
            return `
              <button class="bento-card card-type-${meta.type}" data-id="${a.id}">
                <div class="card-icon">${meta.icon}</div>
                <div class="card-id">${a.id}</div>
                <div class="card-title">${this.escapeHtml(a.title)}</div>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;

    document.querySelectorAll('.bento-card').forEach(btn => {
      btn.addEventListener('click', () => {
        Game.showAssignmentInfo(btn.dataset.id);
      });
    });
  },

  // ─── Ülesande info ────────────────────────────────────────────────

  async renderAssignmentInfo(assignment) {
    if (!this.appEl) return;

    const cardMeta = {
      '001': { icon: '🧮', type: 'kalkulaator' },
      '002': { icon: '📊', type: 'andmete-kuvamine' },
      '003': { icon: '💻', type: 'tekstiotsing' },
      '004': { icon: '🧪', type: 'testimine' },
    };
    const meta = cardMeta[assignment.id] || { icon: '📝' };

    // Fetch assignment.md and first solution file
    let description = '';
    let solutionName = '';
    let solutionContent = '';
    try {
      const mdRes = await fetch('data/assignments/' + assignment.id + '/assignment.md');
      if (mdRes.ok) description = await mdRes.text();
    } catch (_) {}

    // Try to find a solution file (.js, .py, etc.)
    const codeExts = ['.js', '.py', '.test.js', '.spec.js'];
    for (const ext of codeExts) {
      try {
        const res = await fetch('data/assignments/' + assignment.id + '/functions' + ext);
        if (res.ok) {
          const code = await res.text();
          // Try to find first .test.js or main.py
          continue;
        }
      } catch (_) {}
    }
    // Try common names
    for (const name of ['functions.js', 'functions.test.js', 'main.py', 'index.js', 'solution.js', 'app.js', 'style.css']) {
      try {
        const res = await fetch('data/assignments/' + assignment.id + '/' + name);
        if (res.ok) {
          solutionName = name;
          solutionContent = await res.text();
          break;
        }
      } catch (_) {}
    }

    // Parse description from markdown (strip # heading, keep first paragraph)
    const descLines = description.split('\n').filter(l => l.trim() && !l.startsWith('#'));
    const shortDesc = descLines.slice(0, 3).join(' ').trim();

    const langClass = solutionName.endsWith('.py') ? 'lang-py' : 'lang-js';

    this.appEl.innerHTML = `
      <div class="container">
        <div class="info-card">
          <button class="btn-back" id="btn-back">← Tagasi</button>
          <div class="info-header">
            <div class="info-icon">${meta.icon}</div>
            <h1 class="info-title">${this.escapeHtml(assignment.title)}</h1>
            <span class="info-badge">${assignment.id}</span>
          </div>

          ${shortDesc ? `
            <div class="info-section">
              <h3 class="info-section-title">Ülesande kirjeldus</h3>
              <p class="info-description">${this.escapeHtml(shortDesc)}</p>
            </div>
          ` : ''}

          ${solutionContent ? `
            <div class="info-section">
              <h3 class="info-section-title">Lahenduse näidis</h3>
              <div class="info-filename">${this.escapeHtml(solutionName)}</div>
              <pre class="code-block ${langClass}"><code>${this.escapeHtml(solutionContent.substring(0, 1200))}</code></pre>
            </div>
          ` : ''}

          <div class="info-actions">
            <button class="btn-primary btn-start" id="btn-start">Alusta mängu →</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-back').addEventListener('click', () => Game.backToMenu());
    document.getElementById('btn-start').addEventListener('click', () => Game.selectAssignment(assignment.id));
  },

  // ─── Mänguvaade ────────────────────────────────────────────────

  renderGame(question) {
    if (!question) return;

    const state = Game.getState();
    const qNum = state.currentQuestionIndex + 1;
    const points = POINTS[qNum];

    this.appEl.innerHTML = `
      <div class="container game-container">
        <!-- Top bar -->
        <div class="game-header">
          <button class="btn-quit" id="btn-quit">Lõpeta mäng</button>
          <div class="question-counter">Küsimus ${qNum} / 15</div>
          <div class="score-display">${points.toLocaleString('et-EE')} punkti</div>
        </div>

        <!-- Lifelines -->
        <div class="lifelines" id="lifelines">
          <button class="lifeline-btn" id="ll-50" ${state.lifelines.fiftyFifty ? '' : 'disabled'}>
            <span class="ll-icon">50:50</span>
          </button>
          <button class="lifeline-btn" id="ll-hint" ${state.lifelines.hint ? '' : 'disabled'}>
            <span class="ll-icon">Vihje</span>
          </button>
          <button class="lifeline-btn" id="ll-audience" ${state.lifelines.audience ? '' : 'disabled'}>
            <span class="ll-icon">Publik</span>
          </button>
        </div>

        <!-- Question -->
        <div class="question-area">
          <div class="question-level">Raskusaste: ${question.level}</div>
          <div class="question-text">${this.escapeHtml(question.question)}</div>
        </div>

        <!-- Options -->
        <div class="options-grid" id="options-grid">
          ${question.options.map((opt, i) => `
            <button class="option-btn" data-index="${i}">
              <span class="option-letter">${String.fromCharCode(65 + i)}</span>
              <span class="option-text">${this.escapeHtml(opt)}</span>
            </button>
          `).join('')}
        </div>

        <!-- Feedback area -->
        <div id="feedback-area" class="feedback-area"></div>
      </div>
    `;

    this.attachGameListeners(question);
    this.updateLifelineButtons();
  },

  attachGameListeners(question) {
    // Option buttons
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (Game.getState().answeredCorrectly) return;
        const idx = parseInt(btn.dataset.index);
        Game.checkAnswer(idx);
      });
    });

    // Quit button
    document.getElementById('btn-quit').addEventListener('click', () => {
      Game.quitGame();
    });

    // Lifelines
    document.getElementById('ll-50').addEventListener('click', () => {
      const state = Game.getState();
      if (!state.lifelines.fiftyFifty) return;
      state.lifelines.fiftyFifty = false;
      const optionEls = document.querySelectorAll('.option-btn');
      Lifelines.fiftyFifty(question, optionEls);
      this.updateLifelineButtons();
    });

    document.getElementById('ll-hint').addEventListener('click', () => {
      const state = Game.getState();
      if (!state.lifelines.hint) return;
      state.lifelines.hint = false;
      const hint = Lifelines.getHint(question);
      this.showHint(hint);
      this.updateLifelineButtons();
    });

    document.getElementById('ll-audience').addEventListener('click', () => {
      const state = Game.getState();
      if (!state.lifelines.audience) return;
      state.lifelines.audience = false;
      const percentages = Lifelines.simulateAudience(question);
      this.showAudience(percentages, question);
      this.updateLifelineButtons();
    });
  },

  updateLifelineButtons() {
    const state = Game.getState();
    document.getElementById('ll-50').disabled = !state.lifelines.fiftyFifty;
    document.getElementById('ll-hint').disabled = !state.lifelines.hint;
    document.getElementById('ll-audience').disabled = !state.lifelines.audience;
  },

  // ─── Vastuse tagasiside ────────────────────────────────────────

  renderAnswerFeedback(question, selectedIndex, isCorrect) {
    const options = document.querySelectorAll('.option-btn');

    // Disable all options
    options.forEach(btn => { btn.disabled = true; });

    // Mark correct answer green
    options[question.correctIndex].classList.add('correct');

    // Mark wrong answer red (if not correct)
    if (!isCorrect) {
      options[selectedIndex].classList.add('wrong');
    }

    // Show explanation
    const feedbackArea = document.getElementById('feedback-area');
    feedbackArea.innerHTML = `
      <div class="feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}">
        <div class="feedback-icon">${isCorrect ? '✓' : '✗'}</div>
        <div class="feedback-text">
          <strong>${isCorrect ? 'Õige!' : 'Vale vastus!'}</strong>
          <p>${this.escapeHtml(question.explanation)}</p>
        </div>
        <button class="btn-next" id="btn-next">
          ${isCorrect ? 'Järgmine küsimus →' : 'Vaata tulemust'}
        </button>
      </div>
    `;

    document.getElementById('btn-next').addEventListener('click', () => {
      if (isCorrect) {
        Game.nextQuestion();
      } else {
        // Game over, result already shown in checkAnswer
      }
    });

    // Scroll to feedback
    feedbackArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
  },

  // ─── Tulemuse vaade ────────────────────────────────────────────

  renderResult(state) {
    const totalQuestions = state.selectedQuestions.length;
    let message = '';
    let emoji = '';

    if (state.won) {
      message = 'Palju õnne! Võitsid miljon!';
      emoji = '🏆';
    } else if (state.score === 0) {
      message = 'Kahjuks ei võitnud sa midagi. Proovi uuesti!';
      emoji = '😢';
    } else {
      message = `Mäng läbi! Sa võitsid ${state.score.toLocaleString('et-EE')} punkti.`;
      emoji = '💰';
    }

    // Calculate answered count
    const answeredCount = state.won ? totalQuestions : state.currentQuestionIndex;

    this.appEl.innerHTML = `
      <div class="container">
        <div class="result-card">
          <div class="result-emoji">${emoji}</div>
          <h1 class="result-title">${message}</h1>
          <div class="result-score">${state.score.toLocaleString('et-EE')} punkti</div>
          <div class="result-details">
            <p>Ülesanne: <strong>${this.escapeHtml(state.currentAssignment ? state.currentAssignment.title : '')}</strong></p>
            <p>Vastatud: <strong>${answeredCount} / ${totalQuestions}</strong> küsimust</p>
            <p>Viimane turvatase: <strong>${state.lastSafeScore.toLocaleString('et-EE')} punkti</strong></p>
          </div>
          <div class="result-actions">
            <button class="btn-primary" id="btn-retry">Proovi uuesti</button>
            <button class="btn-secondary" id="btn-menu">Tagasi menüüsse</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-retry').addEventListener('click', () => {
      Game.selectAssignment(state.currentAssignment.id);
    });

    document.getElementById('btn-menu').addEventListener('click', () => {
      Game.backToMenu();
    });
  },

  // ─── Õlekõrre UI ───────────────────────────────────────────────

  showHint(hintText) {
    // Remove existing hint popup
    const existing = document.getElementById('hint-popup');
    if (existing) existing.remove();

    const hintEl = document.createElement('div');
    hintEl.id = 'hint-popup';
    hintEl.className = 'hint-popup';
    hintEl.innerHTML = `
      <div class="hint-content">
        <div class="hint-label">Vihje</div>
        <p>${this.escapeHtml(hintText)}</p>
        <button class="btn-small" id="hint-close">Sulge</button>
      </div>
    `;
    document.querySelector('.game-container').appendChild(hintEl);

    document.getElementById('hint-close').addEventListener('click', () => {
      hintEl.remove();
    });
  },

  showAudience(percentages, question) {
    const existing = document.getElementById('audience-popup');
    if (existing) existing.remove();

    const letters = ['A', 'B', 'C', 'D'];
    const total = percentages.reduce((a, b) => a + b, 0);

    const popup = document.createElement('div');
    popup.id = 'audience-popup';
    popup.className = 'audience-popup';
    popup.innerHTML = `
      <div class="audience-content">
        <div class="audience-label">Publiku hääletus</div>
        <div class="audience-bars">
          ${percentages.map((pct, i) => `
            <div class="audience-bar-container">
              <div class="audience-bar-label">${letters[i]}</div>
              <div class="audience-bar-track">
                <div class="audience-bar-fill ${i === question.correctIndex ? 'bar-correct' : ''}"
                     style="width: ${pct}%"></div>
              </div>
              <div class="audience-bar-value">${pct}%</div>
            </div>
          `).join('')}
        </div>
        <button class="btn-small" id="audience-close">Sulge</button>
      </div>
    `;
    document.querySelector('.game-container').appendChild(popup);

    document.getElementById('audience-close').addEventListener('click', () => {
      popup.remove();
    });
  },

  showError(message) {
    if (!this.appEl) return;
    this.appEl.innerHTML = `
      <div class="container">
        <div class="menu-card error-card">
          <h1>Viga</h1>
          <p class="error-text">${this.escapeHtml(message)}</p>
          <button class="btn-primary" onclick="location.reload()">Laadi uuesti</button>
        </div>
      </div>
    `;
  },

  // ─── Abifunktsioonid ───────────────────────────────────────────

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};
