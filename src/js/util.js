function deleteElement(el) {
    el.parentElement.removeChild(el);
}

function ajax(method, target) {
    let request = new XMLHttpRequest();
    request.open(method, target, true);
    return request;
}

//Test if browser supports passive event listeners

let supportsPassive = false;
try {
    let opts = Object.defineProperty({}, 'passive', {
        get: function() {
            supportsPassive = true;
        }
    });
    window.addEventListener('test', null, opts);
} catch (e) {}


function isScreenSmallerThan(size) {
    let mq = window.matchMedia(`screen and (min-width: ${size}px)`);
    if (mq.matches) {
        return false;
    } else {
        return true;
    }
}


// Swipe detection swiped from SO, test when live on mobile

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

// var xStart = null;
// var yStart = null;

// function handleTouchStart(event) {
//     xStart = event.touches[0].clientX;
//     yStart = event.touches[0].clientY;
// }

// function handleTouchMove(event) {
//     if (!xDown || !yDown) return;

//     var xEnd = event.touches[0].clientX;
//     var yEnd = event.touches[0].clientY;

//     var xTraveled = xEnd - xStart;
//     var yTraveled = yEnd - yStart;

//     if (Math.abs(yTraveled) > 100) return;

//     if (xTraveled > 0) {
//         console.log('You swiped left');
//     } else {
//         console.log('You swiped right');
//     }

//     xEnd = null;
//     yEnd = null;
// }
