function buildGrid(projects) {
  var reel = document.getElementById('reel');
  if (!reel) return;
  projects.forEach(function(p) {
    var a = document.createElement('a');
    a.className = 'frame';
    a.innerHTML = '<div class="thumb"><img src="' + p.thumbnail + '"></div>';
    a.addEventListener('click', function(e) {
      e.preventDefault();
      var modal = document.getElementById('modal');
      document.getElementById('modal-iframe').src = 'https://player.vimeo.com/video/' + p.vimeoId + '?autoplay=1';
      modal.classList.add('open');
    });
    reel.appendChild(a);
  });
}
document.getElementById('modal-close').addEventListener('click', function() {
  document.getElementById('modal').classList.remove('open');
  document.getElementById('modal-iframe').src = '';
});
fetch('/_data/projects.json').then(r => r.json()).then(d => buildGrid(d.projects));
