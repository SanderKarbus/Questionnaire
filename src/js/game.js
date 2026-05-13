/**
 * Miljonimäng - mängu loogika
 *
 * Vastutab:
 * - mängu oleku haldamise
 * - küsimuste valimise (Fisher-Yates shuffle)
 * - punktide arvestamise
 * - vastuste kontrollimise
 * - turvatasemete haldamise
 */

const POINTS = [
  0,
  100, 200, 300, 500, 1000,
  2000, 4000, 8000, 16000, 32000,
  64000, 125000, 250000, 500000, 1000000
];

const SAFE_LEVELS = [0, 5, 10, 15];

const Game = {
  state: null,

  init() {
    this.state = {
      screen: 'menu',
      assignments: [],
      currentAssignment: null,
      questions: [],
      selectedQuestions: [],
      currentQuestionIndex: 0,
      score: 0,
      lastSafeScore: 0,
      gameOver: false,
      won: false,
      answeredCorrectly: false,
      lifelines: {
        fiftyFifty: true,
        hint: true,
        audience: true
      }
    };
  },

  getState() {
    return this.state;
  },

  /**
   * Fisher-Yates shuffle - segab massiivi juhuslikult
   */
  shuffle(array) {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  /**
   * Valib 15 küsimust 55-st:
   * - 5 lihtsat (tase 1-5) 20 hulgast
   * - 5 keskmist (tase 6-10) 20 hulgast
   * - 5 rasket (tase 11-15) 15 hulgast
   */
  selectQuestions(allQuestions) {
    const easy = allQuestions.filter(q => q.level >= 1 && q.level <= 5);
    const medium = allQuestions.filter(q => q.level >= 6 && q.level <= 10);
    const hard = allQuestions.filter(q => q.level >= 11 && q.level <= 15);

    const pick = (pool, count) => this.shuffle(pool).slice(0, count);

    const selected = [
      ...pick(easy, 5),
      ...pick(medium, 5),
      ...pick(hard, 5)
    ];

    // Sorteeri raskusastme järgi (1→15)
    return selected.sort((a, b) => a.level - b.level);
  },

  /**
   * Laeb assignments.json nimekirja
   */
  async loadAssignments() {
    try {
      const res = await fetch('data/assignments.json');
      if (!res.ok) throw new Error('Failed to load assignments');
      const data = await res.json();
      this.state.assignments = data;
      UI.renderMenu(data);
    } catch (err) {
      console.error('Viga ülesannete laadimisel:', err);
      UI.showError('Ülesannete laadimine ebaõnnestus. Kontrolli, et docs/data/assignments.json on olemas.');
    }
  },

  /**
   * Valib ülesande ja laeb küsimused
   */
  async selectAssignment(assignmentId) {
    try {
      const assignment = this.state.assignments.find(a => a.id === assignmentId);
      if (!assignment) throw new Error('Ülesannet ei leitud');

      this.state.currentAssignment = assignment;

      const res = await fetch(`data/assignments/${assignmentId}/questions.json`);
      if (!res.ok) throw new Error('Küsimuste laadimine ebaõnnestus');
      const allQuestions = await res.json();

      this.state.questions = allQuestions;
      this.state.selectedQuestions = this.selectQuestions(allQuestions);
      this.state.currentQuestionIndex = 0;
      this.state.score = 0;
      this.state.lastSafeScore = 0;
      this.state.gameOver = false;
      this.state.won = false;
      this.state.answeredCorrectly = false;
      this.state.lifelines = { fiftyFifty: true, hint: true, audience: true };

      this.state.screen = 'game';
      UI.renderGame(this.getQuestion());
    } catch (err) {
      console.error('Viga ülesande valimisel:', err);
      UI.showError('Ülesande laadimine ebaõnnestus.');
    }
  },

  /**
   * Tagastab praeguse küsimuse
   */
  getQuestion() {
    const idx = this.state.currentQuestionIndex;
    return this.state.selectedQuestions[idx] || null;
  },

  /**
   * Kontrollib vastust
   */
  checkAnswer(selectedIndex) {
    const question = this.getQuestion();
    if (!question) return;

    const isCorrect = selectedIndex === question.correctIndex;

    if (isCorrect) {
      this.state.score = POINTS[this.state.currentQuestionIndex + 1];
      this.state.answeredCorrectly = true;

      // Check if safe level reached
      if (this.state.currentQuestionIndex + 1 === 5) {
        this.state.lastSafeScore = 1000;
      } else if (this.state.currentQuestionIndex + 1 === 10) {
        this.state.lastSafeScore = 32000;
      } else if (this.state.currentQuestionIndex + 1 === 15) {
        this.state.lastSafeScore = 1000000;
        this.state.won = true;
        this.state.gameOver = true;
        UI.renderResult(this.state);
        return;
      }
    } else {
      this.state.answeredCorrectly = false;
      this.state.gameOver = true;
      this.state.score = this.state.lastSafeScore;
      UI.renderResult(this.state);
      return;
    }

    UI.renderAnswerFeedback(question, selectedIndex, isCorrect);
  },

  /**
   * Liigub järgmise küsimuse juurde
   */
  nextQuestion() {
    this.state.currentQuestionIndex++;
    this.state.answeredCorrectly = false;

    if (this.state.currentQuestionIndex >= 15) {
      this.state.won = true;
      this.state.gameOver = true;
      UI.renderResult(this.state);
      return;
    }

    UI.renderGame(this.getQuestion());
  },

  /**
   * Lõpetab mängu pooleli
   */
  quitGame() {
    this.state.gameOver = true;
    UI.renderResult(this.state);
  },

  /**
   * Kuvab ülesande info (assignment.md + lahendus)
   */
  async showAssignmentInfo(assignmentId) {
    const assignment = this.state.assignments.find(a => a.id === assignmentId);
    if (!assignment) return;
    this.state.currentAssignment = assignment;
    this.state.screen = 'info';
    await UI.renderAssignmentInfo(assignment);
  },

  /**
   * Läheb tagasi menüüsse
   */
  backToMenu() {
    this.state.screen = 'menu';
    UI.renderMenu(this.state.assignments);
  }
};
