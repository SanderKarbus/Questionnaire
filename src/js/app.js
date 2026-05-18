/**
 * Miljonimäng - peamine rakendus
 *
 * Käivitab rakenduse ja seob kõik komponendid.
 */
(function () {
  function init() {
    UI.init();
    Game.init();
    Game.loadAssignments();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
