<!-- 
  Fillet & Bone — Shared Navigation
  Include this in every page with:
  <div id="fb-nav"></div>
  <script src="nav.js"></script>
-->

(function() {

var NAV_CSS = `
#fb-nav-bar {
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  background: rgba(13,27,42,0.97);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid #2a3f55;
  position: sticky;
  top: 0;
  z-index: 200;
  font-family: 'DM Sans', sans-serif;
  font-weight: 300;
}
#fb-nav-bar .fb-nav-logo {
  text-decoration: none;
  flex-shrink: 0;
}
#fb-nav-bar .fb-nav-logo-name {
  font-family: 'Playfair Display', serif;
  font-size: 16px;
  color: #f0ece4;
  display: block;
  line-height: 1.1;
}
#fb-nav-bar .fb-nav-logo-tag {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #c9a84c;
  opacity: 0.7;
}
#fb-nav-bar .fb-nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  justify-content: center;
}
#fb-nav-bar .fb-nav-link {
  color: #8a9bb0;
  font-size: 11px;
  text-decoration: none;
  letter-spacing: 0.05em;
  padding: 6px 10px;
  transition: color 0.2s;
  white-space: nowrap;
}
#fb-nav-bar .fb-nav-link:hover {
  color: #c9a84c;
}
#fb-nav-bar .fb-nav-link.active {
  color: #c9a84c;
}
#fb-nav-bar .fb-nav-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
#fb-nav-bar .fb-nav-btn {
  background: transparent;
  border: 1px solid #2a3f55;
  padding: 5px 11px;
  color: #8a9bb0;
  font-size: 10px;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  text-decoration: none;
  letter-spacing: 0.05em;
  transition: all 0.2s;
  white-space: nowrap;
}
#fb-nav-bar .fb-nav-btn:hover {
  border-color: #c9a84c;
  color: #c9a84c;
}
#fb-nav-bar .fb-nav-enrol {
  border: 1px solid #c9a84c;
  color: #c9a84c;
}
#fb-nav-bar .fb-nav-enrol:hover {
  background: #c9a84c;
  color: #0d1b2a;
}
#fb-nav-bar .fb-nav-signout {
  border-color: rgba(192,57,43,0.3);
  color: rgba(192,57,43,0.6);
}
#fb-nav-bar .fb-nav-signout:hover {
  border-color: #c0392b;
  color: #c0392b;
}
#fb-nav-bar .fb-nav-av {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c9a84c, #a8873a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Playfair Display', serif;
  font-size: 10px;
  color: #0d1b2a;
  cursor: pointer;
  border: 1px solid rgba(201,168,76,0.3);
  text-decoration: none;
}
#fb-nav-mobile-toggle {
  display: none;
  background: transparent;
  border: 1px solid #2a3f55;
  color: #8a9bb0;
  padding: 5px 9px;
  font-size: 14px;
  cursor: pointer;
}
#fb-nav-mobile-menu {
  display: none;
  flex-direction: column;
  background: #0a1520;
  border-bottom: 1px solid #2a3f55;
  padding: 8px 0;
  position: sticky;
  top: 58px;
  z-index: 199;
}
#fb-nav-mobile-menu.open {
  display: flex;
}
#fb-nav-mobile-menu a {
  color: #8a9bb0;
  font-size: 13px;
  text-decoration: none;
  padding: 10px 24px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 300;
  letter-spacing: 0.04em;
  border-bottom: 1px solid #1a2e42;
  transition: color 0.2s;
}
#fb-nav-mobile-menu a:hover {
  color: #c9a84c;
}
#fb-nav-mobile-menu a:last-child {
  border-bottom: none;
}
@media(max-width: 768px) {
  #fb-nav-bar { padding: 0 16px; }
  #fb-nav-bar .fb-nav-links { display: none; }
  #fb-nav-bar .fb-nav-right .fb-nav-btn:not(.fb-nav-av) { display: none; }
  #fb-nav-mobile-toggle { display: block; }
}
`;

var SUPABASE_URL = 'https://ctlwnlxifaibyezrvlau.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0bHdubHhpZmFpYnllenJ2bGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzA4MjgsImV4cCI6MjA5MjQ0NjgyOH0.xEQ0bW0y09LkH_zTho06-hcWBjfHLQ0ADTirGgBoDDs';

function getCurrentPage() {
  var path = window.location.pathname.split('/').pop() || 'index.html';
  return path;
}

function isActive(page) {
  return getCurrentPage() === page ? ' active' : '';
}

function injectNav(user) {
  // Inject CSS
  if (!document.getElementById('fb-nav-css')) {
    var style = document.createElement('style');
    style.id = 'fb-nav-css';
    style.textContent = NAV_CSS;
    document.head.appendChild(style);
  }

  var firstName = '';
  var initial = '?';
  if (user) {
    var meta = user.user_metadata;
    firstName = (meta && (meta.name || meta.full_name)) ? (meta.name || meta.full_name).split(' ')[0] : user.email.split('@')[0];
    initial = firstName[0].toUpperCase();
  }

  // Desktop nav
  var navHtml = '<nav id="fb-nav-bar">' +
    '<a href="/index.html" class="fb-nav-logo">' +
      '<span class="fb-nav-logo-name">Fillet & Bone</span>' +
      '<span class="fb-nav-logo-tag">A Culinary Masterclass</span>' +
    '</a>' +
    '<div class="fb-nav-links">' +
      '<a href="/index.html" class="fb-nav-link' + isActive('index.html') + '">Home</a>' +
      '<a href="/courses.html" class="fb-nav-link' + isActive('courses.html') + '">Courses</a>' +
      '<a href="/chat.html" class="fb-nav-link' + isActive('chat.html') + '">The Kitchen</a>' +
      '<a href="/noticeboard.html" class="fb-nav-link' + isActive('noticeboard.html') + '">Noticeboard</a>' +
      (user ? '<a href="/dashboard.html" class="fb-nav-link' + isActive('dashboard.html') + '">Dashboard</a>' : '') +
    '</div>' +
    '<div class="fb-nav-right">';

  if (user) {
    navHtml +=
      '<a href="/dashboard.html" class="fb-nav-av" title="' + firstName + ' — Dashboard">' + initial + '</a>' +
      '<a href="/upgrade.html" class="fb-nav-btn fb-nav-enrol">Upgrade</a>' +
      '<button class="fb-nav-btn fb-nav-signout" onclick="fbNavSignOut()">Sign out</button>';
  } else {
    navHtml +=
      '<a href="/auth.html" class="fb-nav-btn">Sign in</a>' +
      '<a href="/auth.html" class="fb-nav-btn fb-nav-enrol">Enrol free</a>';
  }

  navHtml += '</div>' +
    '<button id="fb-nav-mobile-toggle" onclick="fbNavToggleMobile()">☰</button>' +
  '</nav>';

  // Mobile menu
  navHtml += '<div id="fb-nav-mobile-menu">' +
    '<a href="/index.html">Home</a>' +
    '<a href="/courses.html">Courses</a>' +
    '<a href="/chat.html">The Kitchen</a>' +
    '<a href="/noticeboard.html">Noticeboard</a>' +
    (user ? '<a href="/dashboard.html">Dashboard</a>' : '') +
    (user ? '<a href="/upgrade.html">Upgrade</a>' : '') +
    (user ? '<a href="#" onclick="fbNavSignOut()">Sign out</a>' : '<a href="/auth.html">Sign in / Enrol</a>') +
  '</div>';

  var container = document.getElementById('fb-nav');
  if (container) container.innerHTML = navHtml;
}

window.fbNavSignOut = function() {
  if (window.supabase) {
    window.supabase.auth.signOut().then(function() {
      window.location.href = '/auth.html';
    });
  } else {
    // Fallback — create supabase client
    var s = window.supabase || (window.supabaseJs && window.supabaseJs.createClient(SUPABASE_URL, SUPABASE_KEY));
    if (s) s.auth.signOut().then(function() { window.location.href = '/auth.html'; });
    else window.location.href = '/auth.html';
  }
};

window.fbNavToggleMobile = function() {
  var menu = document.getElementById('fb-nav-mobile-menu');
  if (menu) menu.classList.toggle('open');
};

// Init — check auth state
function initNav() {
  // Try to use existing supabase client if available
  function tryInit() {
    if (window.supabase && window.supabase.auth) {
      window.supabase.auth.getSession().then(function(r) {
        injectNav(r.data && r.data.session ? r.data.session.user : null);
      });
    } else if (window.supabaseJs) {
      var client = window.supabaseJs.createClient(SUPABASE_URL, SUPABASE_KEY);
      client.auth.getSession().then(function(r) {
        injectNav(r.data && r.data.session ? r.data.session.user : null);
      });
    } else {
      // Supabase not loaded yet — show unauthenticated nav for now
      injectNav(null);
    }
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInit);
  } else {
    tryInit();
  }
}

initNav();

})();
