import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Flip } from "gsap/all";


const debug = true


gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, MotionPathPlugin, Flip);

let position = 70
gsap.set('.last-card', {
  background: 'linear-gradient(140deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 94%, rgba(255, 255, 255, 1) 96%, rgba(255, 255, 255, 1) 98%, rgba(0, 0, 0, 0) 100%, rgba(0, 0, 0, 0) 100%)',
});

const ShineTl = gsap.timeline({ repeat: -1 })
  .to('.last-card', {
    duration: 2,
    background: 'linear-gradient(140deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 1) 2%, rgba(255, 255, 255, 1) 4%, rgba(0, 0, 0, 0) 6%, rgba(0, 0, 0, 0) 100%)',
    ease: 'power2.in',
    onComplete: () => {
      position = 92;
    },
  })
  .to('.last-card', {
    duration: 2,
    background: 'linear-gradient(140deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 94%, rgba(255, 255, 255, 1) 96%, rgba(255, 255, 255, 1) 98%, rgba(0, 0, 0, 0) 100%, rgba(0, 0, 0, 0) 100%)',
    ease: 'power2.in',
    onComplete: () => {
      position = 0;
    },
  });
ShineTl;


let scrollDisabled = false;
let canEnableScroll = false;
let FromHero = null;
let ToHero = null;

function disableScroll() {
  if (!scrollDisabled) {
    scrollDisabled = true;
    window.addEventListener('scroll', captureScroll, { passive: false });
    window.addEventListener('wheel', captureScroll, { passive: false }); // Mouse scroll
    window.addEventListener('touchmove', captureScroll, { passive: false }); // Touch scroll on mobile
    window.addEventListener('keydown', captureKeyScroll); // Arrow keys or spacebar scroll
  }
}

function enableScroll() {
  if (scrollDisabled) {
    scrollDisabled = false;
    window.removeEventListener('scroll', captureScroll);
    window.removeEventListener('wheel', captureScroll);
    window.removeEventListener('touchmove', captureScroll);
    window.removeEventListener('keydown', captureKeyScroll);
  }
}

// This will prevent the scroll but allow the scroll event to be captured
function captureScroll(event) {
  event.preventDefault(); // Prevent actual scroll
  // You can do other things like log the scroll position, handle custom logic, etc.
  console.log("shit")
  if (canEnableScroll) {
    canEnableScroll = false
    console.log("SHISHISHISHISHITTTTTSHIT")
    hideDetails(ToHero, FromHero)
  }
}

// Handle keyboard scroll events
function captureKeyScroll(event) {
  const keys = [32, 37, 38, 39, 40]; // Spacebar and arrow keys
  if (keys.includes(event.keyCode)) {
    event.preventDefault(); // Prevent the scroll
    console.log('Key scroll event captured: ', event); // Handle the event here
  }
}
var root = document.documentElement;
var body = document.body;
var pages = document.querySelectorAll(".tile");
const tiles = [...document.querySelectorAll('.firstCard'), ...document.querySelectorAll('.card')];

let lastNumber = 0
function showDetails(fromHero, toHero, increment = 0) {
  // position the details on top of the item (scaled down)
  FromHero = fromHero
  ToHero = toHero

  gsap.set(".tileRight h1, .tileRight h3, .tileRight h2, .tileRight h4, .tileRight p", {
    opacity: 0
  })
  gsap.set(".tileRight", {
    //display: "none",
  })

  Flip.fit(toHero, fromHero, { scale: false, fitChild: document.querySelector('.tile') });

  // record the state
  const state = Flip.getState(toHero);

  // set the final state
  gsap.set(toHero, { clearProps: true }); // wipe out all inline stuff so it's in the native state (not scaled)
  gsap.set(toHero, { visibility: "visible" });

  Flip.from(state, {
    duration: 0.5,
    ease: "power2.in",
    scale: true,
    onStart: () => {
      gsap.to('.tile', {
        borderRadius: '0px',
        duration: 1,
        //delay: 0.5,
      })
    }
  })
    .fromTo(".tileRight h1", {
      y: -30,
    }, {
      y: 0,
      opacity: 1,
    })
    .to(".tileRight h3", {
      opacity: 1,
    }, "+=0.1")

    .fromTo(".tileRight h2", {
      y: -30,
      color: '#9B1E26'
    }, {
      y: 0,
      opacity: 1,
    }, "+=0.1")
    .to(".tileRight h2", {
      scale: 1.1
    }, "+=0.1")
    .add(() => {
      increaseNumberAnimation('savingQuantity', lastNumber, increment, 0.1)
      lastNumber = increment
    })
    .to(".tileRight h2", {
      scale: 1,
      color: "#DE8B70",
    }, "+=0.3")
    .fromTo(".tileRight h4", {
      y: 10,
    }, {
      y: 0,
      opacity: 1,
    }, "+=0.1")
    .to(".tileRight p", {
      opacity: 1,
      onComplete: () => {
        canEnableScroll = true;
      }
    }, "+=0.1")

}


function hideDetails(fromHero, toHero) {
  gsap.set(fromHero, { overflow: "hidden" });
  console.log("This is called", fromHero, toHero)

  // record the current state of details
  const state = Flip.getState(fromHero);

  // scale details down so that its detailImage fits exactly on top of activeItem
  Flip.fit(fromHero, toHero, { scale: true, fitChild: document.querySelector('.tile01') });

  // animate from the original state to the current one.
  Flip.from(state, {
    scale: true,
    duration: 0.5,
    delay: 0.2, // 0.2 seconds because we want the details to slide up first, then flip.
    onStart: () => {
      gsap.to(fromHero, { opacity: 0, duration: 0.2, delay: 0.3 })
      gsap.to('.tile', {
        borderRadius: '60px',
        duration: 1,
      })

    },
    onComplete: () => {
      setTimeout(() => {
        enableScroll();
      }, 1000)
    }
    //onInterrupt: () => tl.kill()
  })
    .set(fromHero, { visibility: "hidden" });

  //activeItem = null;
}

function increaseNumberAnimation(elementId, lastNumber, endNumber, speed = 10) {
  let steps = 1
  if (endNumber - lastNumber > 700) steps = 7
  const element = document.getElementById(elementId)

  if (!element) return

  const animationRunning = JSON.parse(element.dataset.animationRunning ?? false)

  if (animationRunning) return

  element.dataset.animationRunning = true

  incNbrRec(lastNumber, endNumber, element, speed, steps)
}

function incNbrRec(currentNumber, endNumber, element, speed, steps) {
  if (currentNumber <= endNumber) {
    element.innerHTML = currentNumber.toLocaleString();
    setTimeout(function () {
      incNbrRec(currentNumber + steps, endNumber, element, speed, steps)
    }, speed) //Delay a bit before calling the function again.
  } else {
    element.dataset.animationRunning = false
  }
}

const card = document.querySelectorAll('.card');
const fakeCard1 = document.querySelectorAll('.cardFake');
const fakeCard2 = document.querySelectorAll('.cardFake2');
const cardWidth = card[0].offsetWidth;
const margin = 20

const CARDS = [...document.querySelectorAll('.cardFake'), ...document.querySelectorAll('.firstCard'), ...document.querySelectorAll('.card'), ...document.querySelectorAll('.cardFake2')];

const rotate = gsap.timeline({
  scrollTrigger: {
    trigger: ".wheelCon",
    start: "-120px top",
    end: "3800% top",
    pin: true,
    markers: true,
    scrub: true,
    //snap: 1 / card.length,
    invalidateOnRefresh: true,
  }
});


rotate
  .to('.savingCon', {
    opacity: 0,
    duration: 0
  }, 0)
  .to(".card, .cardFake, .cardFake2", {
    opacity: 0.5,
    duration: 2,
    onStart: () => {
      gsap.to(".savingCon", {
        opacity: 1,
        duration: 0.5
      })
    }
  })
  .to(".card01", {
    opacity: 1,
    duration: 2,
  }, "<")
  .add(() => {
    if (!debug) {
      disableScroll()
      showDetails(tiles[0], pages[0], 252)
    }
  })

  //first slide 
  .to(".wheelCon", {
    x: -cardWidth - margin,
  }, "+=1")
  .to(CARDS[6 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[6], {
    opacity: 1
  }, '<')
  .to(CARDS[6 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[6 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[6 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[6 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[6 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[6 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[6 + 3], {
    y: '240px',
    rotate: '24deg'
  }, '<')
  .add(() => {
    if (!debug) {
      disableScroll()
      showDetails(tiles[1], pages[1], 402)
    }
  })

  //second slide
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 2,
  }, "+=1")
  .to(CARDS[7 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[7], {
    opacity: 1
  }, '<')
  .to(CARDS[7 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[7 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[7 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[7 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[7 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[7 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[7 + 3], {
    y: '240px',
    rotate: '24deg'
  }, '<')
  .add(() => {
    if (!debug) {
      disableScroll()
      showDetails(tiles[2], pages[2], 702)
    }
  })


  //third slide
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 3,
  }, "+=1")
  .to(CARDS[8 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[8], {
    opacity: 1
  }, '<')
  .to(CARDS[8 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[8 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[8 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[8 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[8 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[8 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[8 + 3], {
    y: '240px',
    rotate: '24deg'
  }, '<')
  .add(() => {
    if (!debug) {
      disableScroll()
      showDetails(tiles[3], pages[3], 2502)
    }
  })

  //fourth slide
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 4,
  }, "+=1")
  .to(CARDS[9 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[9], {
    opacity: 1
  }, '<')
  .to(CARDS[9 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[9 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[9 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[9 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[9 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[9 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[9 + 3], {
    y: '240px',
    rotate: '24deg'
  }, '<')
  .add(() => {
    if (!debug) {
      disableScroll()
      showDetails(tiles[4], pages[4], 2622)
    }
  })

  // 5 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 5,
  }, "+=1")
  .to(CARDS[10 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[10], {
    opacity: 1
  }, '<')
  .to(CARDS[10 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[10 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[10 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[10 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[10 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[10 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[10 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 2827, 0.1)
      lastNumber = 2827
    }
  }, '<')


  // 6 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 6,
  }, "+=1")
  .to(CARDS[11 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[11], {
    opacity: 1
  }, '<')
  .to(CARDS[11 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[11 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[11 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[11 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[11 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[11 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[11 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 2842, 0.1)
      lastNumber = 2842
    }
  }, '<')


  // 7 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 7,
  }, "+=1")
  .to(CARDS[12 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[12], {
    opacity: 1
  }, '<')
  .to(CARDS[12 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[12 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[12 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[12 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[12 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[12 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[12 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 2882, 0.1)
      lastNumber = 2882
    }
  }, '<')


  // 8 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 8,
  }, "+=1")
  .to(CARDS[13 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[13], {
    opacity: 1
  }, '<')
  .to(CARDS[13 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[13 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[13 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[13 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[13 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[13 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[13 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 3032, 0.1)
      lastNumber = 3032
    }
  }, '<')


  // 9 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 9,
  }, "+=1")
  .to(CARDS[14 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[14], {
    opacity: 1
  }, '<')
  .to(CARDS[14 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[14 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[14 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[14 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[14 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[14 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[14 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 3382, 0.1)
      lastNumber = 3382
    }
  }, '<')


  // 10 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 10,
  }, "+=1")
  .to(CARDS[15 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[15], {
    opacity: 1
  }, '<')
  .to(CARDS[15 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[15 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[15 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[15 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[15 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[15 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[15 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 3507, 0.1)
      lastNumber = 3507
    }
  }, '<')


  // 11 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 11,
  }, "+=1")
  .to(CARDS[16 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[16], {
    opacity: 1
  }, '<')
  .to(CARDS[16 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[16 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[16 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[16 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[16 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[16 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[16 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 3957, 0.1)
      lastNumber = 3957
    }
  }, '<')


  // 12 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 12,
  }, "+=1")
  .to(CARDS[17 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[17], {
    opacity: 1
  }, '<')
  .to(CARDS[17 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[17 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[17 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[17 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[17 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[17 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[17 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 3982, 0.1)
      lastNumber = 3982
    }
  }, '<')


  // 13 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 13,
  }, "+=1")
  .to(CARDS[18 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[18], {
    opacity: 1
  }, '<')
  .to(CARDS[18 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[18 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[18 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[18 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[18 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[18 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[18 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 4132, 0.1)
      lastNumber = 4132
    }
  }, '<')


  // 14 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 14,
  }, "+=1")
  .to(CARDS[19 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[19], {
    opacity: 1
  }, '<')
  .to(CARDS[19 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[19 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[19 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[19 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[19 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[19 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[19 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 4182, 0.1)
      lastNumber = 4182
    }
  }, '<')


  // 15 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 15,
  }, "+=1")
  .to(CARDS[20 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[20], {
    opacity: 1
  }, '<')
  .to(CARDS[20 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[20 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[20 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[20 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[20 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[20 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[20 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 4192, 0.1)
      lastNumber = 4192
    }
  }, '<')


  // 16 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 16,
  }, "+=1")
  .to(CARDS[21 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[21], {
    opacity: 1
  }, '<')
  .to(CARDS[21 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[21 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[21 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[21 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[21 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[21 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[21 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 4392, 0.1)
      lastNumber = 4392
    }
  }, '<')


  // 17 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 17,
  }, "+=1")
  .to(CARDS[22 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[22], {
    opacity: 1
  }, '<')
  .to(CARDS[22 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[22 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[22 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[22 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[22 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[22 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[22 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 4542, 0.1)
      lastNumber = 4542
    }
  }, '<')


  // 18 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 18,
  }, "+=1")
  .to(CARDS[23 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[23], {
    opacity: 1
  }, '<')
  .to(CARDS[23 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[23 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[23 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[23 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[23 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[23 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[23 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 4542, 0.1)
      lastNumber = 4542
    }
  }, '<')


  // 19 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 19,
  }, "+=1")
  .to(CARDS[24 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[24], {
    opacity: 1
  }, '<')
  .to(CARDS[24 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[24 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[24 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[24 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[24 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[24 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[24 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 4592, 0.1)
      lastNumber = 4592
    }
  }, '<')


  // 20 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 20,
  }, "+=1")
  .to(CARDS[25 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[25], {
    opacity: 1
  }, '<')
  .to(CARDS[25 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[25 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[25 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[25 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[25 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[25 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[25 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 4642, 0.1)
      lastNumber = 4642
    }
  }, '<')


  // 21 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 21,
  }, "+=1")
  .to(CARDS[26 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[26], {
    opacity: 1
  }, '<')
  .to(CARDS[26 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[26 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[26 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[26 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[26 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[26 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[26 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 4667, 0.1)
      lastNumber = 4667
    }
  }, '<')


  // 22 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 22,
  }, "+=1")
  .to(CARDS[27 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[27], {
    opacity: 1
  }, '<')
  .to(CARDS[27 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[27 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[27 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[27 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[27 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[27 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[27 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 4767, 0.1)
      lastNumber = 4767
    }
  }, '<')


  // 23 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 23,
  }, "+=1")
  .to(CARDS[28 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[28], {
    opacity: 1
  }, '<')
  .to(CARDS[28 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[28 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[28 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[28 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[28 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[28 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[28 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 4967, 0.1)
      lastNumber = 4967
    }
  }, '<')


  // 24 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 24,
  }, "+=1")
  .to(CARDS[29 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[29], {
    opacity: 1
  }, '<')
  .to(CARDS[29 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[29 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[29 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[29 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[29 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[29 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[29 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 5017, 0.1)
      lastNumber = 5017
    }
  }, '<')


  // 25 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 25,
  }, "+=1")
  .to(CARDS[30 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[30], {
    opacity: 1
  }, '<')
  .to(CARDS[30 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[30 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[30 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[30 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[30 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[30 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[30 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 5067, 0.1)
      lastNumber = 5067
    }
  }, '<')


  // 26 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 26,
  }, "+=1")
  .to(CARDS[31 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[31], {
    opacity: 1
  }, '<')
  .to(CARDS[31 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[31 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[31 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[31 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[31 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[31 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[31 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 5567, 0.1)
      lastNumber = 5567
    }
  }, '<')


  // 27 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 27,
  }, "+=1")
  .to(CARDS[32 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[32], {
    opacity: 1
  }, '<')
  .to(CARDS[32 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[32 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[32 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[32 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[32 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[32 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[32 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 5717, 0.1)
      lastNumber = 5717
    }
  }, '<')


  // 28 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 28,
  }, "+=1")
  .to(CARDS[33 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[33], {
    opacity: 1
  }, '<')
  .to(CARDS[33 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[33 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[33 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[33 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[33 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[33 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[33 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 5817, 0.1)
      lastNumber = 5817
    }
  }, '<')


  // 29 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 29,
  }, "+=1")
  .to(CARDS[34 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[34], {
    opacity: 1
  }, '<')
  .to(CARDS[34 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[34 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[34 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[34 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[34 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[34 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[34 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 6017, 0.1)
      lastNumber = 6017
    }
  }, '<')


  // 30 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 30,
  }, "+=1")
  .to(CARDS[35 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[35], {
    opacity: 1
  }, '<')
  .to(CARDS[35 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[35 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[35 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[35 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[35 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[35 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[35 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 6517, 0.1)
      lastNumber = 6517
    }
  }, '<')


  // 31 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 31,
  }, "+=1")
  .to(CARDS[36 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[36], {
    opacity: 1
  }, '<')
  .to(CARDS[36 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[36 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[36 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[36 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[36 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[36 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[36 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 6617, 0.1)
      lastNumber = 6617
    }
  }, '<')


  // 32 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 32,
  }, "+=1")
  .to(CARDS[37 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[37], {
    opacity: 1
  }, '<')
  .to(CARDS[37 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[37 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[37 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[37 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[37 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[37 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[37 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 6667, 0.1)
      lastNumber = 6667
    }
  }, '<')


  // 33 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 33,
  }, "+=1")
  .to(CARDS[38 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[38], {
    opacity: 1
  }, '<')
  .to(CARDS[38 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[38 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[38 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[38 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[38 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[38 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[38 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 6717, 0.1)
      lastNumber = 6717
    }
  }, '<')


  // 34 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 34,
  }, "+=1")
  .to(CARDS[39 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[39], {
    opacity: 1
  }, '<')
  .to(CARDS[39 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[39 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[39 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[39 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[39 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[39 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[39 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 6262, 0.1)
      lastNumber = 6262
    }
  }, '<')


  // 35 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 35,
  }, "+=1")
  .to(CARDS[40 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[40], {
    opacity: 1
  }, '<')
  .to(CARDS[40 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[40 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[40 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[40 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[40 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[40 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[40 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 6292, 0.1)
      lastNumber = 6292
    }
  }, '<')


  // 36 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 36,
  }, "+=1")
  .to(CARDS[41 - 1], {
    opacity: 0.5
  }, '<')
  .to(CARDS[41], {
    opacity: 1
  }, '<')
  .to(CARDS[41 - 3], {
    y: '240px',
    rotate: '-15deg'
  }, '<')
  .to(CARDS[41 - 2], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[41 - 1], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[41 + 0], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[41 + 1], {
    y: '30px',
    rotate: '8deg',
  }, '<')
  .to(CARDS[41 + 2], {
    y: '110px',
    rotate: '16deg'
  }, '<')
  .to(CARDS[41 + 3], {
    y: '240px',
    rotate: '24deg',
    onComplete: () => {
      increaseNumberAnimation('savingQuantity', lastNumber, 6462, 0.1)
      lastNumber = 6462
    }
  }, '<')
  .to('.savingCon', {
    //position: 'absolute',
    opacity: 0,
    duration: 0.5
  })


window.onload = function () {
  const container = document.querySelector('.wheel');
  const card7 = document.querySelector('.card01');

  const containerWidth = container.offsetWidth;
  const cardPosition = card7.offsetLeft;

  // Scroll the container to where card 7 is positioned
  container.scrollLeft = cardPosition - containerWidth / 2 + card7.offsetWidth / 2;

  // Translate card 7 to center it visually
  const offsetToCenter = (containerWidth / 2) - (card7.offsetWidth / 2) - card7.offsetLeft;

  container.style.transform = `translateX(${offsetToCenter}px)`;
  gsap.set(CARDS[2], {
    y: '240px',
    rotate: '-15deg'
  })
  gsap.set(CARDS[3], {
    y: '110px',
    rotate: '-16deg'
  })
  gsap.set(CARDS[4], {
    y: '30px',
    rotate: '-8deg'
  })
  gsap.set(CARDS[5], {
    y: '-20px',
    rotate: '0deg',
    zIndex: 11
  })
  gsap.set(CARDS[6], {
    y: '30px',
    rotate: '8deg',
  })
  gsap.set(CARDS[7], {
    y: '110px',
    rotate: '16deg'
  })
  gsap.set(CARDS[8], {
    y: '240px',
    rotate: '24deg'
  })
  gsap.set(window, {
    // scroll to the top 
    scrollTo: {
      y: 0
    },
    onComplete: () => {
      gsap.fromTo(".savingCon", {
        opacity: 0,
      }, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          gsap.fromTo(".savingCon", {
            opacity: 0,
          }, {
            opacity: 0,
            duration: 0.5,
          })
        }
      })
    }
  })
};
