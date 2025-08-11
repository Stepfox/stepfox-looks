(function(){
  function positionPanels(doc){
    try{
      var items = doc.querySelectorAll('.wp-block-stepfox-navigation-mega-item');
      items.forEach(function(item){
        var panel = item.querySelector('.wp-block-stepfox-navigation-mega');
        if(!panel) return;
        var nav = item.closest('.wp-block-navigation');
        var navRect = nav ? nav.getBoundingClientRect() : { top: 0, height: 0, bottom: 0 };
        var cs = nav ? doc.defaultView.getComputedStyle(nav) : null;
        var pos = cs ? cs.position : 'static';
        var topBase = navRect.bottom;
        // In the editor canvas (iframe), absolute positioning tends to be more accurate
        var isEditorCanvas = !!doc.defaultView.frameElement;
        // Set navigation as relative positioned container
        if (nav) {
          nav.style.position = 'relative';
        }
        
        // Use absolute positioning relative to the navigation
        panel.style.position = 'absolute';
        panel.style.top = '100%';
        
        // Measure the mega menu link element's distance to left edge
        var megaMenuLink = item.querySelector('.wp-block-navigation-item__content');
        var linkRect = megaMenuLink ? megaMenuLink.getBoundingClientRect() : item.getBoundingClientRect();
        var isEditorCanvas = doc.body.classList.contains('is-root-container') || !!doc.defaultView.frameElement;
        
        // Calculate: container left = -(link distance to left)
        var linkDistanceToLeft = linkRect.left;
        var leftOffset = -linkDistanceToLeft;
        
        panel.style.left = leftOffset + 'px';
        panel.style.transform = 'none';
        panel.style.width = '100vw';
        panel.style.maxWidth = '100vw';
        
        // Prevent horizontal scroll
        if (isEditorCanvas) {
          // In Site Editor iframe
          if (doc.body) doc.body.style.overflowX = 'hidden';
          if (doc.documentElement) doc.documentElement.style.overflowX = 'hidden';
        } else {
          // On frontend
          document.body.style.overflowX = 'hidden';
        }
        panel.style.zIndex = '9999';
      });
    }catch(e){/* noop */}
  }

  function initContext(doc){
    var scheduled = false;
    var run = function(){
      scheduled = false;
      positionPanels(doc);
    };
    var schedule = function(){
      if (scheduled) return;
      scheduled = true;
      doc.defaultView.requestAnimationFrame(run);
    };
    if(doc.readyState === 'loading'){
      doc.addEventListener('DOMContentLoaded', run, { passive: true });
    } else { run(); }
    // Reflow on resize and scroll (for sticky/fixed nav)
    doc.defaultView.addEventListener('resize', schedule, { passive: true });
    doc.defaultView.addEventListener('scroll', schedule, { passive: true });
    doc.addEventListener('scroll', schedule, { passive: true });
    // Observe mutations to recalc when menu changes
    var Observer = doc.defaultView.MutationObserver || MutationObserver;
    if(Observer){
      var obs = new Observer(function(){ schedule(); });
      obs.observe(doc.documentElement, { childList: true, subtree: true, attributes: true });
    }
    // Ensure recalculation when user opens the panel
    doc.querySelectorAll('.wp-block-stepfox-navigation-mega-item').forEach(function(item){
      ['mouseenter','focusin'].forEach(function(evt){
        item.addEventListener(evt, schedule, { passive: true });
      });
    });
  }

  // Top document
  initContext(document);
  
  // Site editor iframe
  var iframes = document.querySelectorAll('iframe[name="editor-canvas"], iframe.edit-site-visual-editor__editor-canvas');
  iframes.forEach(function(iframe){
    try{
      var idoc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
      if(idoc) initContext(idoc);
    }catch(e){/* ignore */}
  });
  
  // Also try to detect iframes that load later
  setTimeout(function(){
    var newIframes = document.querySelectorAll('iframe[name="editor-canvas"], iframe.edit-site-visual-editor__editor-canvas');
    newIframes.forEach(function(iframe){
      try{
        var idoc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
        if(idoc) initContext(idoc);
      }catch(e){/* ignore */}
    });
  }, 2000);
})();


