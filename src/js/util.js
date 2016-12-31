function deleteElement(el) {
    el.parentElement.removeChild(el);
}

function ajax(method, target) {
    let request = new XMLHttpRequest();
    request.open(method, target, true);
    return request;
}



//Swipe detection swiped from SO, test when live on mobile

// document.addEventListener('touchstart', handleTouchStart, false);
// document.addEventListener('touchmove', handleTouchMove, false);

// var xDown = null;                                                        
// var yDown = null;                                                        

// function handleTouchStart(evt) {                                         
//     xDown = evt.touches[0].clientX;                                      
//     yDown = evt.touches[0].clientY;                                      
// };                                                

// function handleTouchMove(evt) {
//     if ( ! xDown || ! yDown ) {
//         return;
//     }

//     var xUp = evt.touches[0].clientX;                                    
//     var yUp = evt.touches[0].clientY;

//     var xDiff = xDown - xUp;
//     var yDiff = yDown - yUp;

//     if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
//         if ( xDiff > 0 ) {
//             /* left swipe */ 
//         } else {
//             /* right swipe */
//         }                       
//     } else {
//         if ( yDiff > 0 ) {
//             /* up swipe */ 
//         } else { 
//             /* down swipe */
//         }                                                                 
//     }
//     /* reset values */
//     xDown = null;
//     yDown = null;                                             
// };
