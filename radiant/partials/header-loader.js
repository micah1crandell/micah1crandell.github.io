(function() {
  // Inserts the shared header into any page containing <div id="site-header"></div>
  // Resolves the partial path relative to this script's src so it works from subfolders.
  function resolvePartialsDir() {
    // Prefer currentScript if available and correct
    var scriptSrc = null;
    if (document.currentScript && /partials\/header-loader\.js(?:\?.*)?$/.test(document.currentScript.src)) {
      scriptSrc = document.currentScript.src;
    }
    // Otherwise, search all scripts for one that looks like the header-loader
    if (!scriptSrc) {
      var scripts = document.getElementsByTagName('script');
      for (var i = 0; i < scripts.length; i++) {
        var s = scripts[i];
        if (s.src && /partials\/header-loader\.js(?:\?.*)?$/.test(s.src)) {
          scriptSrc = s.src;
          break;
        }
      }
    }
    // Fallback: derive from the current page location
    if (!scriptSrc) {
      try {
        var loc = window.location;
        // If the page is under /radiant/, assume partials at /radiant/partials/
        if (/\/radiant\//.test(loc.pathname)) {
          var base = loc.origin + loc.pathname.replace(/(\/radiant\/).*/, '$1');
          return base + 'partials/';
        }
      } catch (e) { /* ignore */ }
      // Last resort: relative 'partials/'
      return 'partials/';
    }
    // Ensure it ends with 'partials/header-loader.js' and trim to the directory path
    return scriptSrc.replace(/header-loader\.js(?:\?.*)?$/, '');
  }

  function rebaseHeaderLinks(host, baseRadiantUrl) {
    try {
      // Ensure trailing slash on base
      if (baseRadiantUrl.charAt(baseRadiantUrl.length - 1) !== '/') baseRadiantUrl += '/';
      // If baseRadiantUrl is absolute, use it directly; otherwise rely on current location
      var base = (/^([a-z]+:)?\/\//i.test(baseRadiantUrl) || baseRadiantUrl.startsWith('file:'))
        ? new URL(baseRadiantUrl)
        : new URL(baseRadiantUrl, window.location.href);
      host.querySelectorAll('a[href]').forEach(function(a){
        var href = a.getAttribute('href');
        if (!href) return;
        // Skip absolute, hash, mailto, tel, javascript
        var lower = href.toLowerCase();
        if (lower.startsWith('http') || lower.startsWith('#') || lower.startsWith('mailto:') || lower.startsWith('tel:') || lower.startsWith('javascript:')) return;
        // Rebase relative link to Radiant root
        try {
          var abs = new URL(href, base);
          // Preserve full href including scheme so it works under file:// and http(s)
          a.setAttribute('href', abs.href);
        } catch (e) { /* ignore */ }
      });
    } catch (e) {
      // ignore
    }
  }

  function insertHeader() {
    var host = document.querySelector('#site-header');
    if (!host) return;

    var partialsDir = resolvePartialsDir(); // e.g., https://site/radiant/partials/
    var headerUrl = partialsDir + 'header.html';

    fetch(headerUrl, { cache: 'no-cache' })
      .then(function(res) { return res.text(); })
      .then(function(html) {
        host.innerHTML = html;

        // After injecting, make header links work from any subfolder by rebasing to the Radiant root
        // partialsDir => .../radiant/partials/ => strip trailing 'partials/' to get the Radiant root
        var baseRadiant = partialsDir.replace(/\/?partials\/?$/, '/');
        rebaseHeaderLinks(host, baseRadiant);

        // After injecting, wire mobile menu toggle
        var menuToggle = host.querySelector('.menu-toggle');
        var navLinks = host.querySelector('.nav-links');
        if (menuToggle && navLinks) {
          menuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('open');
            menuToggle.classList.toggle('open');
          });
        }

        // If we're on the training resources page, intercept dropdown links to smooth scroll
        try {
          var onTrainingPage = /training_resources\.html$/.test(window.location.pathname);
          if (onTrainingPage) {
            var trLinks = host.querySelectorAll('a[href^="training_resources.html#"], a[href$="training_resources.html"], a[href*="training_resources.html#"]');
            if (trLinks && trLinks.length) {
              trLinks.forEach(function(a){
                a.addEventListener('click', function(e){
                  var href = a.getAttribute('href');
                  // Only smooth scroll for same-page anchors
                  if (href && href.indexOf('#') > -1) {
                    var id = href.substring(href.indexOf('#') + 1);
                    var target = document.getElementById(id);
                    if (target) {
                      e.preventDefault();
                      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      if (navLinks && navLinks.classList) navLinks.classList.remove('open');
                      if (menuToggle && menuToggle.classList) menuToggle.classList.remove('open');
                    }
                  }
                });
              });
            }
          }
        } catch (err) {
          // no-op: smooth scroll enhancement failed
        }
      })
      .catch(function(err) {
        console.error('Failed to load header partial:', err);
        // Fallback: inject a minimal header so navigation isn't empty in local previews
        var fallback = '' +
          '<header class="nav-header">' +
          '  <div class="nav-content">' +
          '    <a href="home.html" class="logo"><span class="material-symbols-outlined">graphic_eq<\/span>RADIANT PRODUCTION<\/a>' +
          '    <button class="menu-toggle" aria-label="Open menu">' +
          '      <span class="bar bar1"><\/span><span class="bar bar2"><\/span><span class="bar bar1"><\/span>' +
          '    <\/button>' +
          '    <nav class="nav-links">' +
          '      <button class="cta"><a href="home.html" class="hover-underline-animation">Home<\/a><\/button>' +
          '      <button class="cta"><a href="volunteers.html" class="hover-underline-animation">Volunteers<\/a><\/button>' +
          '      <div class="dropdown">' +
          '        <button class="cta"><a href="training_resources.html" class="hover-underline-animation">Training Resources &#9660;<\/a><\/button>' +
          '        <div class="dropdown-content">' +
          '          <a href="camera_operator_training.html">Camera Operators<\/a>' +
          '          <a href="training_resources.html#position-audio-engineers">Video Directors<\/a>' +
          '          <a href="training_resources.html#position-lighting-technicians">Lighting Engineers<\/a>' +
          '          <a href="training_resources.html#position-stage-design">Stage Managers<\/a>' +
          '          <a href="training_resources.html#position-media-graphics">Computer Graphics Operators<\/a>' +
          '          <a href="training_resources.html#position-audio-engineers">Audio Engineers<\/a>' +
          '          <a href="training_resources.html#position-live-stream-directors">Live Stream Directors<\/a>' +
          '        <\/div>' +
          '      <\/div>' +
          '      <div class="dropdown">' +
          '        <button class="cta"><a href="javascript:void(0)" class="hover-underline-animation">About Us &#9660;<\/a><\/button>' +
          '        <div class="dropdown-content">' +
          '          <a href="audio_gear.html">Audio Gear<\/a>' +
          '          <a href="video_gear.html">Video Gear<\/a>' +
          '          <a href="lighting_gear.html">Lighting Gear<\/a>' +
          '          <a href="music_videos.html">Music Videos<\/a>' +
          '          <a href="other_projects.html">Other Projects<\/a>' +
          '        <\/div>' +
          '      <\/div>' +
          '      <button class="cta"><a href="stage.html" class="hover-underline-animation">Stage Design History<\/a><\/button>' +
          '      <button class="cta"><a href="contact.html" class="hover-underline-animation">Connect<\/a><\/button>' +
          '    <\/nav>' +
          '  <\/div>' +
          '<\/header>';
        host.innerHTML = fallback;
        try {
          var baseRadiant = resolvePartialsDir().replace(/\/?partials\/?$/, '/');
          rebaseHeaderLinks(host, baseRadiant);
        } catch (_) {}
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertHeader);
  } else {
    insertHeader();
  }
})();
