var PLAY_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none"/></svg>';

function buildGrid(projects) {
  var reel = document.getElementById('reel');
  if (!reel) return;
  reel.innerHTML = '';

  projects.forEach(function(p) {
    var a = document.createElement('a');
    a.className = 'frame';

    if (p.vimeoId) {
      a.href = '#';
      a.dataset.vimeoId = p.vimeoId;
    } else {
      a.href = 'https://vimeo.com/serhatdogantekin';
      a.target = '_blank';
      a.rel = 'noopener';
    }

    var thumbSrc = p.thumbnail || '';
    var needsVimeoThumb = !thumbSrc && p.vimeoId;

    a.innerHTML =
      '<div class="thumb">' +
        '<img src="' + thumbSrc + '" alt="" loading="lazy"' + (needsVimeoThumb ? ' data-vimeo-thumb="' + p.vimeoId + '"' : '') + '>' +
        '<div class="play-overlay">' + PLAY_SVG +
          '<span class="overlay-title">' + (p.title || '') + '</span>' +
        '</div>' +
      '</div>';

    reel.appendChild(a);
  });

  document.querySelectorAll('img[data-vimeo-thumb]').forEach(function(img) {
    var id = img.getAttribute('data-vimeo-thumb');
    fetch('https://vimeo.com/api/oembed.json?url=https://vimeo.com/' + id + '&width=1920')
      .then(function(r) { return r.json(); })
      .then(function(d) { 
        if (d.thumbnail_url) {
          img.src = d.thumbnail_url.replace(/_[\d]+x[\d]+/, '_1920x1080');
        }
      })
      .catch(function() {});
  });

  initModal();
}

function initModal() {
  var modal  = document.getElementById('modal');
  var iframe = document.getElementById('modal-iframe');
  var btn    = document.getElementById('modal-close');

  function openModal(id) {
    iframe.src = 'https://player.vimeo.com/video/' + id + '?autoplay=1&title=0&byline=0&portrait=0';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    iframe.src = '';
    document.body.style.overflow = '';
  }

  if (btn) btn.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', function(e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });

  document.querySelectorAll('.frame[data-vimeo-id]').forEach(function(f) {
    f.addEventListener('click', function(e) {
      e.preventDefault();
      openModal(this.dataset.vimeoId);
    });
  });
}

fetch('/_data/projects.json')
  .then(function(r) { return r.json(); })
  .then(function(data) { buildGrid(data.projects || []); })
  .catch(function() {
    fetch('_data/projects.json')
      .then(function(r) { return r.json(); })
      .then(function(data) { buildGrid(data.projects || []); })
      .catch(function() {});
  });

fetch('/_data/settings.json')
  .then(function(res) {
    if (!res.ok) throw new Error();
    return res.json();
  })
  .then(function(data) {
    if (data.site_title) document.title = data.site_title;
    if (data.site_description) {
      var desc = document.createElement('meta');
      desc.name = 'description';
      desc.content = data.site_description;
      document.head.appendChild(desc);
    }
    if (data.keywords) {
      var keys = document.createElement('meta');
      keys.name = 'keywords';
      keys.content = data.keywords;
      document.head.appendChild(keys);
    }
  })
  .catch(function() {});
