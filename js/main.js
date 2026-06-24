var PLAY_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none"/></svg>';

function buildGrid(projects) {
  var reel = document.getElementById('reel');
  if (!reel) return;
  reel.innerHTML = '';

  projects.forEach(function(p) {
    var a = document.createElement('a');
    a.className = 'frame';
    a.href = '#';

    if (p.vimeoId) {
      a.dataset.vimeoId = p.vimeoId;
    }

    var hasThumb = p.thumbnail && p.thumbnail.trim() !== '';
    var imgTag = '<img src="' + (hasThumb ? p.thumbnail : '') + '" alt="" loading="lazy"'
      + (p.vimeoId ? ' data-vimeo-thumb="' + p.vimeoId + '" data-has-custom="' + (hasThumb ? '1' : '0') + '"' : '')
      + '>';

    a.innerHTML =
      '<div class="thumb">' +
        imgTag +
        '<div class="play-overlay">' +
          PLAY_SVG +
          '<span class="overlay-title">' + (p.title || '') + '</span>' +
        '</div>' +
      '</div>';

    reel.appendChild(a);
  });

  // Fetch higher-res Vimeo thumbnails (width=1280) for items without a custom thumbnail
  document.querySelectorAll('img[data-vimeo-thumb]').forEach(function(img) {
    if (img.getAttribute('data-has-custom') === '1') return;
    var id = img.getAttribute('data-vimeo-thumb');
    fetch('https://vimeo.com/api/oembed.json?url=https://vimeo.com/' + id + '&width=1280')
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d.thumbnail_url) img.src = d.thumbnail_url;
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
    // wrap iframe in modal-inner if not already
    if (!document.querySelector('.modal-inner')) {
      var inner = document.createElement('div');
      inner.className = 'modal-inner';
      modal.appendChild(inner);
      inner.appendChild(iframe);
    }
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
  if (modal) modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  document.querySelectorAll('.frame[data-vimeo-id]').forEach(function(f) {
    f.addEventListener('click', function(e) {
      e.preventDefault();
      openModal(this.dataset.vimeoId);
    });
  });
}

// Load projects
fetch('/_data/projects.json')
  .then(function(r) { return r.json(); })
  .then(function(d) { buildGrid(d.projects || []); })
  .catch(function() {
    fetch('_data/projects.json')
      .then(function(r) { return r.json(); })
      .then(function(d) { buildGrid(d.projects || []); });
  });
