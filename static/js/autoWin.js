(function(doc, win) {
    
    var docEl = doc.documentElement,
        resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
        recalc = function() {
            let clientWidth = docEl.clientWidth
            if(clientWidth>1920){
                clientWidth = 1920
            }

            var width = clientWidth /19.2;
            docEl.style.fontSize = width + "px";
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener("DOMContentLoaded", recalc, false);
})(document, window);