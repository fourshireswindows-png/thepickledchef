// ── Fillet & Bone Chef Rank System ──────────────────────────────────────────
// Include this in any page that needs rank functionality
// <script src="ranks.js"></script>

var CHEF_RANKS = [
  { name: 'Commis Chef',     min: 0,   icon: '🔪' },
  { name: 'Chef de Partie',  min: 5,   icon: '🍳' },
  { name: 'Sous Chef',       min: 15,  icon: '👨‍🍳' },
  { name: 'Head Chef',       min: 35,  icon: '⭐' },
  { name: 'Executive Chef',  min: 75,  icon: '🌟' },
  { name: 'Chef Patron',     min: 150, icon: '✦' }
];

/**
 * Get full rank info for a given module count
 * @param {number} completedModules
 * @returns {object} rank info
 */
function getUserChefRank(completedModules) {
  var count = completedModules || 0;
  var currentRankIndex = 0;

  for (var i = CHEF_RANKS.length - 1; i >= 0; i--) {
    if (count >= CHEF_RANKS[i].min) {
      currentRankIndex = i;
      break;
    }
  }

  var current = CHEF_RANKS[currentRankIndex];
  var isMaxRank = currentRankIndex === CHEF_RANKS.length - 1;
  var next = isMaxRank ? null : CHEF_RANKS[currentRankIndex + 1];

  var progressPercent = 0;
  var modulesNeeded = 0;

  if (!isMaxRank) {
    var rangeSize = next.min - current.min;
    var progressInRange = count - current.min;
    progressPercent = Math.round((progressInRange / rangeSize) * 100);
    modulesNeeded = next.min - count;
  } else {
    progressPercent = 100;
    modulesNeeded = 0;
  }

  return {
    rank: current.name,
    icon: current.icon,
    completedModules: count,
    currentMin: current.min,
    nextRank: next ? next.name : null,
    nextRankIcon: next ? next.icon : null,
    modulesNeededForNextRank: modulesNeeded,
    progressPercent: progressPercent,
    isMaxRank: isMaxRank
  };
}

/**
 * Render a rank badge HTML string
 * @param {number} completedModules
 * @param {boolean} showCount - show module count
 * @returns {string} HTML
 */
function renderRankBadge(completedModules, showCount, showEmoji) {
  var r = getUserChefRank(completedModules);
  var html = '<span class="rank-badge">';
  if (showEmoji) html += r.icon + ' ';
  html += r.rank;
  if (showCount) html += ' · ' + r.completedModules + ' modules';
  html += '</span>';
  return html;
}

/**
 * Render full rank card HTML (for profile/dashboard)
 * @param {number} completedModules
 * @returns {string} HTML
 */
function renderRankCard(completedModules) {
  var r = getUserChefRank(completedModules);
  var progressBar = r.isMaxRank
    ? '<div class="rank-progress-label">Maximum rank achieved ✦</div>'
    : '<div class="rank-progress-label">' + r.modulesNeededForNextRank + ' modules until ' + r.nextRank + '</div>' +
      '<div class="rank-progress-track"><div class="rank-progress-fill" style="width:' + r.progressPercent + '%"></div></div>';

  return '<div class="rank-card">' +
    '<div class="rank-card-top">' +
      '<div class="rank-icon">' + r.icon + '</div>' +
      '<div>' +
        '<div class="rank-name">' + r.rank + '</div>' +
        '<div class="rank-modules">' + r.completedModules + ' modules completed</div>' +
      '</div>' +
    '</div>' +
    progressBar +
  '</div>';
}

/**
 * Check if completing a module triggers a rank promotion
 * @param {number} previousCount
 * @param {number} newCount
 * @returns {string|null} new rank name if promoted, null otherwise
 */
function checkPromotion(previousCount, newCount) {
  var prevRank = getUserChefRank(previousCount).rank;
  var newRank = getUserChefRank(newCount).rank;
  return prevRank !== newRank ? newRank : null;
}

// CSS for rank elements — inject once into page head
var RANK_CSS = `
.rank-badge {
  font-size: 10px;
  color: var(--gold);
  background: rgba(201,168,76,0.08);
  border: 1px solid rgba(201,168,76,0.2);
  padding: 2px 8px;
  letter-spacing: 0.05em;
  white-space: nowrap;
}
.rank-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  padding: 20px;
  margin-bottom: 16px;
}
.rank-card-top {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}
.rank-icon {
  font-size: 28px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(201,168,76,0.06);
  border: 1px solid rgba(201,168,76,0.15);
}
.rank-name {
  font-family: 'Playfair Display', serif;
  font-size: 18px;
  color: var(--cream);
  margin-bottom: 3px;
}
.rank-modules {
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.04em;
}
.rank-progress-label {
  font-size: 11px;
  color: var(--dark);
  margin-bottom: 6px;
  letter-spacing: 0.04em;
}
.rank-progress-track {
  height: 2px;
  background: var(--border);
  border-radius: 1px;
  overflow: hidden;
}
.rank-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold), var(--gold2));
  border-radius: 1px;
  transition: width 0.8s ease;
}
.promotion-toast {
  position: fixed;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg2);
  border: 1px solid var(--gold);
  padding: 12px 24px;
  z-index: 500;
  text-align: center;
  animation: toastIn 0.4s ease, toastOut 0.4s ease 3.6s forwards;
  white-space: nowrap;
}
.promotion-toast-title {
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 4px;
}
.promotion-toast-rank {
  font-family: 'Playfair Display', serif;
  font-size: 16px;
  color: var(--cream);
}
@keyframes toastIn {
  from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
@keyframes toastOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
`;

/**
 * Inject rank CSS into the page
 */
function injectRankCSS() {
  if (document.getElementById('rank-css')) return;
  var style = document.createElement('style');
  style.id = 'rank-css';
  style.textContent = RANK_CSS;
  document.head.appendChild(style);
}

/**
 * Show a promotion toast notification
 * @param {string} newRank
 * @param {string} icon
 */
function showPromotionToast(newRank, icon) {
  injectRankCSS();
  var toast = document.createElement('div');
  toast.className = 'promotion-toast';
  toast.innerHTML =
    '<div class="promotion-toast-title">Promotion Unlocked</div>' +
    '<div class="promotion-toast-rank">You are now ' + newRank + '</div>';
  document.body.appendChild(toast);
  setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 4200);
}

// Auto-inject CSS when script loads
injectRankCSS();
