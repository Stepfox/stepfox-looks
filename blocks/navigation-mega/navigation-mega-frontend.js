(function(){
  function positionPanels(doc){
    try{
      var items = doc.querySelectorAll('.wp-block-stepfox-navigation-mega-item');
      items.forEach(function(item){
        var panel = item.querySelector('.wp-block-stepfox-navigation-mega');
        if(!panel) return;
        // If used outside navigation, we can still use local wrapper when not fullwidth
        var nav = item.closest('.wp-block-navigation');
        var navRect = nav ? nav.getBoundingClientRect() : { top: 0, height: 0, bottom: 0, left: 0 };
        var cs = nav ? doc.defaultView.getComputedStyle(nav) : null;
        var pos = cs ? cs.position : 'static';
        var topBase = navRect.bottom;
        // In the editor canvas (iframe), absolute positioning tends to be more accurate
        var isEditorCanvas = !!doc.defaultView.frameElement;
        // Use navigation (if present) or the item itself as the positioning container
        var container = nav || item;
        var containerRect = container.getBoundingClientRect();
        if (panel.classList.contains('is-fullwidth')) {
          container.style.position = 'relative';
        }
        
        // Fullwidth uses absolute positioning; non-fullwidth stays in normal flow
        var isFull = panel.classList.contains('is-fullwidth');
        panel.style.position = isFull ? 'absolute' : 'static';
        panel.style.top = isFull ? '100%' : '';
        
        // Measure the mega menu link element's distance to left edge
        var megaMenuLink = item.querySelector('.wp-block-navigation-item__content');
        var linkRect = megaMenuLink ? megaMenuLink.getBoundingClientRect() : item.getBoundingClientRect();
        var isEditorCanvas = doc.body.classList.contains('is-root-container') || !!doc.defaultView.frameElement;
        
        // For fullwidth: offset by container's left so panel spans viewport from 0
        var leftOffset = isFull ? -containerRect.left : 0;
        
        panel.style.left = leftOffset + 'px';
        panel.style.transform = 'none';
        if (isFull) {
          panel.style.width = '100vw';
          panel.style.maxWidth = '100vw';
        } else {
          panel.style.width = '';
          panel.style.maxWidth = '';
        }
        
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
      var openTimer = null;
      var closeTimer = null;
      var isEditorCanvas = doc.body.classList.contains('is-root-container') || !!doc.defaultView.frameElement;
      var editorAutoOpen = isEditorCanvas && item.getAttribute('data-editor-auto-open') === '1';
      var open = function(){
        if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
        if (!item.classList.contains('is-open')) item.classList.add('is-open');
        schedule();
      };
      var close = function(e){
        // In editor with autoOpen enabled, never close via hover/focus changes
        if (editorAutoOpen) return;
        if (openTimer) { clearTimeout(openTimer); openTimer = null; }
        // If moving within the item or into the panel, do not close
        try {
          var rt = e && (e.relatedTarget || e.toElement);
          if (rt && (item.contains(rt))) {
            return; // still inside item/panel
          }
        } catch(_e){}
        // Delay close by ~200ms
        closeTimer = setTimeout(function(){
          item.classList.remove('is-open');
        }, 200);
      };
      item.addEventListener('mouseenter', open, { passive: true });
      item.addEventListener('focusin', open, { passive: true });
      item.addEventListener('mouseleave', close, { passive: true });
      item.addEventListener('focusout', function(e){
        // Keep open if focus moves within item
        var rt = e && e.relatedTarget;
        if (rt && item.contains(rt)) return;
        close(e);
      }, { passive: true });
      
      // Keep panel open while hovering the panel itself
      var panel = item.querySelector('.wp-block-stepfox-navigation-mega');
      if (panel) {
        panel.addEventListener('mouseenter', open, { passive: true });
        panel.addEventListener('mouseleave', close, { passive: true });
      }

      // If editor set autoOpen, respect it only in the Site Editor (iframe) context
      if (editorAutoOpen) {
        open();
      }
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


