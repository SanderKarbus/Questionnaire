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
   * Arvestab ka seda, kas 50:50 on juba kaks varianti eemaldanud (optionElements abil)
   */
  simulateAudience(question, optionElements = []) {
    const numOptions = question.options.length;
    const correctIdx = question.correctIndex;
    
    // Tuvastame, millised nupud on juba 50:50 poolt elimineeritud
    const activeIndices = [];
    for (let i = 0; i < numOptions; i++) {
      const btn = optionElements[i];
      // Kui nuppu pole sisendis või see pole elimineeritud, on ta aktiivne
      if (!btn || !btn.classList.contains('eliminated')) {
        activeIndices.push(i);
      }
    }

    // Genereerime esialgsed suvalised "kaalud" (weights) ainult aktiivsetele nuppudele
    const weights = new Array(numOptions).fill(0);
    
    activeIndices.forEach(idx => {
      if (idx === correctIdx) {
        // Õige vastus saab alati tugeva kaalu (nt 50-80)
        weights[idx] = Math.floor(Math.random() * 31) + 50;
      } else {
        // Vale vastus saab väiksema kaalu (nt 10-30)
        weights[idx] = Math.floor(Math.random() * 21) + 10;
      }
    });

    // Arvutame kaalude kogusumma, et teisendada need täpseteks protsentideks
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    
    // Teisendame protsentideks
    let percentages = weights.map(w => totalWeight > 0 ? Math.round((w / totalWeight) * 100) : 0);
    
    // Kuna ümaristamine võib summa viia 99% või 101% peale, korrigeerime vahe õige vastuse pealt
    const currentSum = percentages.reduce((sum, p) => sum + p, 0);
    const difference = 100 - currentSum;
    percentages[correctIdx] += difference;

    return percentages;
  }
};
