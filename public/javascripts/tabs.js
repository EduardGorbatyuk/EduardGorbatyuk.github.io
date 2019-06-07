/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
var tabButtons=document.querySelectorAll(".tabContainer .buttonContainer button");
// eslint-disable-next-line no-undef
var tabPanels=document.querySelectorAll(".tabContainer  .tabPanel");

function showPanel(panelIndex,colorCode) {
    tabButtons.forEach(function(node){
        node.style.backgroundColor="";
        node.style.color="";
    });
    tabButtons[panelIndex].style.backgroundColor=colorCode;
    tabButtons[panelIndex].style.color="white";
    tabPanels.forEach(function(node){
        node.style.display="none";
    });
    tabPanels[panelIndex].style.display="block";
    tabPanels[panelIndex].style.backgroundColor=colorCode;
}
showPanel(0,'#403f3f');

// function delLeague(e) {
//     var elem = e.parentNode.id;
//     document.getElementById(elem).remove();
//     document.getElementById(elem).remove();    
// }

// delLeague();