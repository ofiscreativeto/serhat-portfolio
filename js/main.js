function buildGrid(projects) {
  var reel = document.getElementById('reel');
  if (!reel) return;
  reel.innerHTML = '';
  projects.forEach(function(p) {
    var a = document.createElement('a');
    a.className = 'frame';
    a.dataset.vimeoId = p.vimeoId;
    a.innerHTML = '<div class="thumb"><img src="' + (p.thumbnail || '') + '" data-vimeo-thumb="' + p.vimeoId + '"></div>';
    a.addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('modal-iframe').src = 'https://player.vimeo.com/video/' + p.vimeoId + '?autoplay=1';
      document.getElementById('modal').classList.add('open');
    });
    reel.appendChild(a);
  });
  document.querySelectorAll('img[data-vimeo-thumb]').forEach(function(img) {
    var id = img.getAttribute('data-vimeo-thumb');
    fetch('https://vimeo.com/api/oembed.json?url=https://vimeo.com/' + id)
      .then(function(r) { return r.json(); })
      .then(function(d) { if(d.thumbnail_url) img.src = d.thumbnail_url; });
  });
}
document.getElementById('modal-close').addEventListener('click', function() {
  document.getElementById('modal').classList.remove('open');
  document.getElementById('modal-iframe').src = '';
});
fetch('/_data/projects.json').then(r => r.json()).then(d => buildGrid(d.projects));
