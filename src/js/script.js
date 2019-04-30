window.onload=function(){
    var menuElem = document.getElementById('list-lang'),
        titleElem = menuElem.querySelector('.lang');
        document.onclick = function(event) {
        var target = elem = event.target;
        while (target != this) {
              if (target == menuElem) {
              if(elem.tagName == 'A') {
                titleElem.innerHTML = elem.textContent;
                titleElem.style.backgroundImage =  getComputedStyle(elem, null)['backgroundImage']
              }
              menuElem.classList.toggle('open')
                  return;
              }
              target = target.parentNode;
          }
        menuElem.classList.remove('open');
    }
}
    