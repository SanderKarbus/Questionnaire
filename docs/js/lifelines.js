/**
 * Miljonimäng - õlekõrred
 *
 * Õlekõrred:
 * - 50:50 - eemaldab 2 vale vastust
 * - Vihje - kuvab küsimuse juures oleva vihje
 * - Publik - simuleerib publiku hääletuse
 */

const Lifelines = {

  /**
   * 50:50 - eemaldab kaks vale vastusevarianti
   * Jätab õige vastuse + ühe juhusliku vale vastuse
   */
  fiftyFifty(question, optionElements) {
    const wrongIndices = [];
    for (let i = 0; i < question.options.length; i++) {
      if (i !== question.correctIndex) {
        wrongIndices.push(i);
      }
    }

    const shuffledWrong = Game.shuffle(wrongIndices);
    const removeIndices = shuffledWrong.slice(0, 2);

    for (const idx of removeIndices) {
      const btn = optionElements[idx];
      if (btn) {
        btn.classList.add('eliminated');
        btn.disabled = true;
        btn.innerHTML = '';
      }
    }

    return removeIndices;
  },

  /**
   * Vihje - kuvab eelgenereeritud vihje
   */
  getHint(question) {
    return question.hint || 'Sellele küsimusele vihjet pole.';
  },

  /**
   * Publik - simuleerib publiku hääletuse
   * Õige vastus saab kõrgema protsendi, aga mitte alati 100%
   */
  simulateAudience(question) {
    const numOptions = question.options.length;
    const correctIdx = question.correctIndex;

    // Õige vastus saab 40-75% häältest
    const correctPercentage = Math.floor(Math.random() * 36) + 40;

    const remaining = 100 - correctPercentage;
    const otherShares = [];
    let remainingSum = remaining;

    for (let i = 0; i < numOptions; i++) {
      if (i === correctIdx) continue;
      if (i === numOptions - 1 || (i === correctIdx + 1 && i === numOptions - 1)) {
        // Last non-correct option gets whatever's left
        otherShares.push(remainingSum);
      } else {
        const share = Math.floor(Math.random() * remainingSum);
        otherShares.push(share);
        remainingSum -= share;
      }
    }

    const percentages = [];
    let otherIdx = 0;
    for (let i = 0; i < numOptions; i++) {
      if (i === correctIdx) {
        percentages.push(correctPercentage);
      } else {
        percentages.push(otherShares[otherIdx++]);
      }
    }

    return percentages;
  }
};
