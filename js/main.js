var PLAY_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none"/></svg>';

function buildGrid(projects) {
  var reel = document.getElementById('reel');
  if (!reel) return;
  reel.innerHTML = '';
  projects.forEach(function(p) {
    var a = document.createElement('a');
    a.className = 'frame';
    a.dataset.vimeoId = p.vimeoId;
    a.innerHTML = '<div class="thumb"><img src="' + (p.thumbnail || '') + '" alt="" loading="lazy" data-vimeo-thumb="' + p.vimeoId + '"><div class="play-overlay">' + PLAY_SVG + '<span class="overlay-title">' + (p.title || '') + '</span></div></div>';
    reel.appendChild(a);
  });
  document.querySelectorAll('img[data-vimeo-thumb]').forEach(function(img) {
    if (img.src) return;
    var id = img.getAttribute('data-vimeo-thumb');
    fetch('https://vimeo.com/api/oembed.json?url=https://vimeo.com/' + id)
      .then(function(r) { return r.json(); })
      .then(function(d) { if (d.thumbnail_url) img.src = d.thumbnail_url; })
      .catch(function() {});
  });
  initModal();
}

function initModal() {
  var modal = document.getElementById('modal');
  var iframe = document.getElementById('modal-iframe');
  var btn = document.getElementById('modal-close');
  document.querySelectorAll('.frame').forEach(function(f) {
    f.addEventListener('click', function(e) {
      e.preventDefault();
      iframe.src = 'https://player.vimeo.com/video/' + this.dataset.vimeoId + '?autoplay=1&title=0&byline=0&portrait=0';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  btn.addEventListener('click', function() {
    modal.classList.remove('open');
    iframe.src = '';
    document.body.style.overflow = '';
  });
}

fetch('/_data/projects.json')
  .then(function(r) { return r.json(); })
  .then(function(data) { buildGrid(data.projects || []); });
