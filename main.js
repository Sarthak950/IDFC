import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Flip } from "gsap/all";


const debug = false
let canScroll = false;
let scrollPosition = 0

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
    }, "+=0.1")
    .add(() => {
      canScroll = true
    })

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
        //enableScroll();
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

if (document.documentElement.clientWidth > 768) {
  const rotate = gsap.timeline({
    scrollTrigger: {
      trigger: ".wheelCon",
      start: "-120px top",
      end: "40% top",
      pin: true,
      scrub: true,
      markers: false,
      //snap: 1 / card.length,
      invalidateOnRefresh: true,
    }
  });
}
const secondScrollFun = () => gsap.timeline({ paused: true })
  .add(() => {
    scrollPosition = 2
    if (!debug) {
      showDetails(tiles[0], pages[0], 252)
    }
  })

const thirdScrollFun = () => gsap.timeline({ paused: true })
  .add(() => {
    scrollPosition = 3
    if (!debug) {
      hideDetails(ToHero, FromHero)
    }
  })
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
    rotate: '24deg',
    onComplete: () => {
      canScroll = true
    }
  }, '<')


const fourthScrollFun = () => gsap.timeline({ paused: true })
  .add(() => {
    scrollPosition = 4
    if (!debug) {
      showDetails(tiles[1], pages[1], 402)
    }
  })

const fifthScrollFun = () => gsap.timeline({ paused: true })
  .add(() => {
    scrollPosition = 5
    if (!debug) {
      hideDetails(ToHero, FromHero)
    }
  })
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
    rotate: '24deg',
    onComplete: () => {
      canScroll = true
    }
  }, '<')


const sixthScrollFun = () => gsap.timeline({ paused: true })
  .add(() => {
    scrollPosition = 6
    if (!debug) {
      showDetails(tiles[2], pages[2], 702)
    }
  })

const seventhScrollFun = () => gsap.timeline({ paused: true })
  .add(() => {
    scrollPosition = 7
    if (!debug) {
      hideDetails(ToHero, FromHero)
    }
  })
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
    rotate: '24deg',
    onComplete: () => {
      canScroll = true
    }
  }, '<')

const eightScrollFun = () => gsap.timeline({ paused: true })
  .add(() => {
    scrollPosition = 8
    if (!debug) {
      showDetails(tiles[3], pages[3], 2502)
    }
  })

const ninthScrollFun = () => gsap.timeline({ paused: true })
  .add(() => {
    scrollPosition = 9
    if (!debug) {
      hideDetails(ToHero, FromHero)
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
    rotate: '24deg',
    onComplete: () => {
      canScroll = true
    }
  }, '<')

const tenthScrollFun = () => gsap.timeline({ paused: true })
  .add(() => {
    scrollPosition = 10
    if (!debug) {
      showDetails(tiles[4], pages[4], 2622)
    }
  })
const eleventhScrollFun = () => gsap.timeline({ paused: true })
  .add(() => {
    scrollPosition = 11
    if (!debug) {
      hideDetails(ToHero, FromHero)
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
      canScroll = true
    }
  }, '<')


const _12thScrollFun = () => gsap.timeline({ paused: true })
  // 6 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 6,
  })
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
      canScroll = true
    }
  }, '<')

const _13thScrollFun = () => gsap.timeline({ paused: true })
  // 7 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 7,
  })
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
      canScroll = true
    }
  }, '<')

const _14thScrollFun = () => gsap.timeline({ paused: true })
  // 8 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 8,
  })
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
      canScroll = true
    }
  }, '<')

const _15thScrollFun = () => gsap.timeline({ paused: true })
  // 9 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 9,
  })
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
      canScroll = true
    }
  }, '<')

const _16thScrollFun = () => gsap.timeline({ paused: true })
  // 10 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 10,
  })
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
      canScroll = true
    }
  }, '<')

const _17thScrollFun = () => gsap.timeline({ paused: true })
  // 11 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 11,
  })
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
      canScroll = true
    }
  }, '<')

const _18thScrollFun = () => gsap.timeline({ paused: true })
  // 12 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 12,
  })
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
      canScroll = true
    }
  }, '<')

const _19thScrollFun = () => gsap.timeline({ paused: true })
  // 13 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 13,
  })
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
      canScroll = true
    }
  }, '<')

const _20thScrollFun = () => gsap.timeline({ paused: true })
  // 14 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 14,
  })
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
      canScroll = true
    }
  }, '<')

const _21thScrollFun = () => gsap.timeline({ paused: true })
  // 15 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 15,
  })
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
      canScroll = true
    }
  }, '<')

const _22thScrollFun = () => gsap.timeline({ paused: true })
  // 16 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 16,
  })
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
      canScroll = true
    }
  }, '<')

const _23thScrollFun = () => gsap.timeline({ paused: true })
  // 17 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 17,
  })
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
      canScroll = true
    }
  }, '<')

const _24thScrollFun = () => gsap.timeline({ paused: true })
  // 18 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 18,
  })
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
      canScroll = true
    }
  }, '<')

const _25thScrollFun = () => gsap.timeline({ paused: true })
  // 19 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 19,
  })
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
      canScroll = true
    }
  }, '<')

const _26thScrollFun = () => gsap.timeline({ paused: true })
  // 20 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 20,
  })
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
      canScroll = true
    }
  }, '<')

const _27thScrollFun = () => gsap.timeline({ paused: true })
  // 21 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 21,
  })
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
      canScroll = true
    }
  }, '<')

const _28thScrollFun = () => gsap.timeline({ paused: true })
  // 22 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 22,
  })
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
      canScroll = true
    }
  }, '<')

const _29thScrollFun = () => gsap.timeline({ paused: true })
  // 23 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 23,
  })
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
      canScroll = true
    }
  }, '<')

const _30thScrollFun = () => gsap.timeline({ paused: true })
  // 24 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 24,
  })
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
      canScroll = true
    }
  }, '<')

const _31thScrollFun = () => gsap.timeline({ paused: true })
  // 25 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 25,
  })
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
      canScroll = true
    }
  }, '<')

const _32thScrollFun = () => gsap.timeline({ paused: true })
  // 26 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 26,
  })
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
      canScroll = true
    }
  }, '<')

const _33thScrollFun = () => gsap.timeline({ paused: true })
  // 27 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 27,
  })
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
      canScroll = true
    }
  }, '<')

const _34thScrollFun = () => gsap.timeline({ paused: true })
  // 28 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 28,
  })
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
      canScroll = true
    }
  }, '<')

const _35thScrollFun = () => gsap.timeline({ paused: true })
  // 29 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 29,
  })
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
      canScroll = true
    }
  }, '<')

const _36thScrollFun = () => gsap.timeline({ paused: true })
  // 30 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 30,
  })
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
      canScroll = true
    }
  }, '<')

const _37thScrollFun = () => gsap.timeline({ paused: true })
  // 31 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 31,
  })
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
      canScroll = true
    }
  }, '<')

const _38thScrollFun = () => gsap.timeline({ paused: true })
  // 32 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 32,
  })
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
      canScroll = true
    }
  }, '<')

const _39thScrollFun = () => gsap.timeline({ paused: true })
  // 33 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 33,
  })
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
      canScroll = true
    }
  }, '<')

const _40thScrollFun = () => gsap.timeline({ paused: true })
  // 34 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 34,
  })
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
      canScroll = true
    }
  }, '<')

const _41thScrollFun = () => gsap.timeline({ paused: true })
  // 35 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 35,
  })
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
      canScroll = true
    }
  }, '<')

const _42thScrollFun = () => gsap.timeline({ paused: true })
  // 36 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 36,
  })
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
      canScroll = true
    }
  }, '<')


const _43thScrollFun = () => gsap.timeline({ paused: true })
  .to(".hero, .tempDivWrapper", {
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      gsap.set(".hero, .tempDivWrapper", {
        display: 'none',
        duration: 0
      })
      setTimeout(() => {
        enableScroll()
      }, 1000)
    }
  })






window.onload = function () {

  // scroll to element with id fakeDiv


  if (window.innerWidth < 768) {
    //const tile = document.querySelector('.tile');
    //const tileOffsetTop = tile.offsetTop;
    //
    //tile.style.top = `-${tileOffsetTop}px`;
    //console.log("tilePosition", tileOffsetTop)
  }
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
    duration: 0.1,
    onComplete: () => {
      setTimeout(function () { window.scrollTo(0, 0); }, 1)
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
            onComplete: () => {
              canScroll = true
            }
          })
        }
      })
    }
  })

  disableScroll()
};

const firstScrollFun = () => {
  return gsap.timeline({ paused: true })
    .add(() => {
      console.log("Shit", document.documentElement.clientWidth)
      if (document.documentElement.clientWidth < 768) {
        console.log("Shit 2")
        const tl = gsap.timeline()
        tl
          .to(".cardCon", {
            y: "-350px",
            duration: 0.7
          })
          .to(".hero", {
            y: "-400px",
            duration: 0.7
          }, "<")
          .to(".savingCon", {
            y: "50px",
            onComplete: () => {
              console.log("fitst completed")
            }
          }, "<")
      } else {
        console.log("Shit 3")
        gsap.to(window, {
          scrollTo: {
            y: 450,
          },
          onStart: () => console.log("this is Started")
        })
      }
    })
    .to('.savingCon', {
      opacity: 0,
      duration: 0
    }, "<")
    .to(".card, .cardFake, .cardFake2", {
      opacity: 0.5,
      duration: 0.5,
      onStart: () => {
        gsap.to(".savingCon", {
          opacity: 1,
          duration: 0.5
        })
      }
    }, "<")
    .to(".card01", {
      opacity: 1,
      duration: 1,
    }, "<")
    .add(() => {
      canScroll = true
      scrollPosition = 1
    })
}

const firstScrollReverseFun = () => gsap.timeline({ paused: true })
  .to(".card, .cardFake, .cardFake2", {
    opacity: 1,
    duration: 1,
  })
  .to(window, {
    scrollTo: {
      y: 0,
    }
  }, "<")
  .to('.savingCon', {
    opacity: 0,
    duration: 0
  }, "<")
  .add(() => {
    scrollPosition = 0
    canScroll = true
  })


function captureScroll(event) {
  event.preventDefault();
  console.log("Scroll Detected", scrollPosition)
  if (window.innerWidth < 768) {
    const tile = document.querySelector('.tile');
    const tileOffsetTop = tile.offsetTop;

    tile.style.top = `-${tileOffsetTop}px`;
    console.log("tilePosition", tileOffsetTop)
  }

  if (canScroll) {
    canScroll = false
    console.log("Scroll captured", scrollPosition)
    if (scrollPosition === 0) {
      const firstScroll = firstScrollFun()
      firstScroll.play()
    } else if (scrollPosition === 1) {
      //if (event.deltaY > 0) {
      const secondScroll = secondScrollFun()
      secondScroll.play()
      //} else {
      //  console.log("this")
      //  const firstScrollReverse = firstScrollReverseFun()
      //  firstScrollReverse.play()
      //}
    } else if (scrollPosition === 2) {
      //if (event.deltaY > 0) {
      const thirdScroll = thirdScrollFun()
      thirdScroll.play()
      //} else {
      //  const secondScrollReverse = secondScrollReverseFun()
      //  secondScrollReverse.play()
      //}
    } else if (scrollPosition === 3) {
      //if (event.deltaY > 0) {
      const fourthScroll = fourthScrollFun()
      fourthScroll.play()
      //} else {
      //  const thirdScrollReverse = thirdScrollReverseFun()
      //  thirdScrollReverse.play()
      //}
    } else if (scrollPosition === 4) {
      //if (event.deltaY > 0) {
      const fifthScroll = fifthScrollFun()
      fifthScroll.play()
      //} else {
      //  const fourthScrollReverse = fourthScrollReverseFun()
      //  fourthScrollReverse.play()
      //}
    } else if (scrollPosition === 5) {
      //if (event.deltaY > 0) {
      const sixthScroll = sixthScrollFun()
      sixthScroll.play()
      //} else {
      //  const fifthScrollReverse = fifthScrollReverseFun()
      //  fifthScrollReverse.play()
      //}
    } else if (scrollPosition === 6) {
      //if (event.deltaY > 0) {
      const seventhScroll = seventhScrollFun()
      seventhScroll.play()
      //} else {
      //  const sixthScrollReverse = sixthScrollReverseFun()
      //  sixthScrollReverse.play()
      //}
    } else if (scrollPosition === 7) {
      //if (event.deltaY > 0) {
      const eightScroll = eightScrollFun()
      eightScroll.play()
      //} else {
      //  const seventhScrollReverse = seventhScrollReverseFun()
      //  seventhScrollReverse.play()
      //}
    } else if (scrollPosition === 8) {
      //if (event.deltaY > 0) {
      const ninthScroll = ninthScrollFun()
      ninthScroll.play()
      //} else {
      //  const eightScrollReverse = eighthScrollReverseFun()
      //  eightScrollReverse.play()
      //}
    } else if (scrollPosition === 9) {
      //if (event.deltaY > 0) {
      const tenthScroll = tenthScrollFun()
      tenthScroll.play()
      //} else {
      //  const ninthScrollReverse = ninthScrollReverseFun()
      //  ninthScrollReverse.play()
      //}
    } else if (scrollPosition === 10) {
      //if (event.deltaY > 0) {
      const eleventhScroll = eleventhScrollFun()
      eleventhScroll.play()
      //} else {
      //  const tenthScrollReverse = tenthScrollReverseFun()
      //  tenthScrollReverse.play()
      //}
    } else if (scrollPosition === 11) {
      //if (event.deltaY > 0) {
      scrollPosition = 12
      const _12thScroll = _12thScrollFun()
      _12thScroll.play()
      //} else {
      //  const eleventhScrollReverse = eleventhScrollReverseFun()
      //  eleventhScrollReverse.play()
      //}
    } else if (scrollPosition === 12) {
      scrollPosition = 13
      const _13thScroll = _13thScrollFun()
      _13thScroll.play()
    } else if (scrollPosition === 13) {
      scrollPosition = 14
      const _14thScroll = _14thScrollFun()
      _14thScroll.play()
    } else if (scrollPosition === 14) {
      scrollPosition = 15
      const _15thScroll = _15thScrollFun()
      _15thScroll.play()
    } else if (scrollPosition === 15) {
      scrollPosition = 16
      const _16thScroll = _16thScrollFun()
      _16thScroll.play()
    } else if (scrollPosition === 16) {
      scrollPosition = 17
      const _17thScroll = _17thScrollFun()
      _17thScroll.play()
    } else if (scrollPosition === 17) {
      scrollPosition = 18
      const _18thScroll = _18thScrollFun()
      _18thScroll.play()
    } else if (scrollPosition === 18) {
      scrollPosition = 19
      const _19thScroll = _19thScrollFun()
      _19thScroll.play()
    } else if (scrollPosition === 19) {
      scrollPosition = 20
      const _20thScroll = _20thScrollFun()
      _20thScroll.play()
    } else if (scrollPosition === 20) {
      scrollPosition = 21
      const _21thScroll = _21thScrollFun()
      _21thScroll.play()
    } else if (scrollPosition === 21) {
      scrollPosition = 22
      const _22thScroll = _22thScrollFun()
      _22thScroll.play()
    } else if (scrollPosition === 22) {
      scrollPosition = 23
      const _23thScroll = _23thScrollFun()
      _23thScroll.play()
    } else if (scrollPosition === 23) {
      scrollPosition = 24
      const _24thScroll = _24thScrollFun()
      _24thScroll.play()
    } else if (scrollPosition === 24) {
      scrollPosition = 25
      const _25thScroll = _25thScrollFun()
      _25thScroll.play()
    } else if (scrollPosition === 25) {
      scrollPosition = 26
      const _26thScroll = _26thScrollFun()
      _26thScroll.play()
    } else if (scrollPosition === 26) {
      scrollPosition = 27
      const _27thScroll = _27thScrollFun()
      _27thScroll.play()
    } else if (scrollPosition === 27) {
      scrollPosition = 28
      const _28thScroll = _28thScrollFun()
      _28thScroll.play()
    } else if (scrollPosition === 28) {
      scrollPosition = 29
      const _29thScroll = _29thScrollFun()
      _29thScroll.play()
    } else if (scrollPosition === 29) {
      scrollPosition = 30
      const _30thScroll = _30thScrollFun()
      _30thScroll.play()
    } else if (scrollPosition === 30) {
      scrollPosition = 31
      const _31thScroll = _31thScrollFun()
      _31thScroll.play()
    } else if (scrollPosition === 31) {
      scrollPosition = 32
      const _32thScroll = _32thScrollFun()
      _32thScroll.play()
    } else if (scrollPosition === 32) {
      scrollPosition = 33
      const _33thScroll = _33thScrollFun()
      _33thScroll.play()
    } else if (scrollPosition === 33) {
      scrollPosition = 34
      const _34thScroll = _34thScrollFun()
      _34thScroll.play()
    } else if (scrollPosition === 34) {
      scrollPosition = 35
      const _35thScroll = _35thScrollFun()
      _35thScroll.play()
    } else if (scrollPosition === 35) {
      scrollPosition = 36
      const _36thScroll = _36thScrollFun()
      _36thScroll.play()
    } else if (scrollPosition === 36) {
      scrollPosition = 37
      const _37thScroll = _37thScrollFun()
      _37thScroll.play()
    } else if (scrollPosition === 37) {
      scrollPosition = 38
      const _38thScroll = _38thScrollFun()
      _38thScroll.play()
    } else if (scrollPosition === 38) {
      scrollPosition = 39
      const _39thScroll = _39thScrollFun()
      _39thScroll.play()
    } else if (scrollPosition === 39) {
      scrollPosition = 40
      const _40thScroll = _40thScrollFun()
      _40thScroll.play()
    } else if (scrollPosition === 40) {
      scrollPosition = 41
      const _41thScroll = _41thScrollFun()
      _41thScroll.play()
    } else if (scrollPosition === 41) {
      console.log("this is happening")
      scrollPosition = 42
      const _42thScroll = _42thScrollFun()
      _42thScroll.play()
    } else if (scrollPosition === 42) {
      console.log("this is happening 2")
      scrollPosition = 43
      const _43thScroll = _43thScrollFun()
      _43thScroll.play()
    }
  }


}

const secondScrollReverseFun = () => gsap.timeline({ paused: true })
  .add(() => {
    scrollPosition = 3
    if (!debug) {
      hideDetails(ToHero, FromHero)
    }
  })


const thirdScrollReverseFun = () => gsap.timeline({ paused: true })
  .to(".wheelCon", {
    x: 0,
  })
  .to(CARDS[6 - 1], {
    opacity: 1
  }, '<')
  .to(CARDS[6], {
    opacity: 0.5
  }, '<')

  .to(CARDS[6 - 3], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[6 - 2], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[6 - 1], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[6 + 0], {
    y: '30px',
    rotate: '8deg'
  }, '<')
  .to(CARDS[6 + 1], {
    y: '110px',
    rotate: '16deg',
  }, '<')
  .to(CARDS[6 + 2], {
    y: '240px',
    rotate: '16deg',
  }, '<')
  .add(() => {
    scrollPosition = 2
    if (!debug) {
      showDetails(tiles[0], pages[0], 252)
    }
  })

const fourthScrollReverseFun = () => gsap.timeline({ paused: true })
  .add(() => {
    scrollPosition = 4
    console.log("4 Reverse")
    if (!debug) {
      showDetails(tiles[1], pages[1], 402)
    }
  })

const fifthScrollReverseFun = () => gsap.timeline({ paused: true })
  .to(".wheelCon", {
    x: (-cardWidth - margin),
    onComplete: () => console.log("5 Reverse")
  })
  .to(CARDS[7 - 1], {
    opacity: 1
  }, '<')
  .to(CARDS[7], {
    opacity: 0.5
  }, '<')

  .to(CARDS[7 - 3], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[7 - 2], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[7 - 1], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[7 + 0], {
    y: '30px',
    rotate: '8deg'
  }, '<')
  .to(CARDS[7 + 1], {
    y: '110px',
    rotate: '16deg',
  }, '<')
  .to(CARDS[7 + 2], {
    y: '240px',
    rotate: '16deg',
  }, '<')
  .add(() => {
    scrollPosition = 4
    if (!debug) {
      showDetails(tiles[1], pages[1], 402)
    }
  })



const sixthScrollReverseFun = () => gsap.timeline({ paused: true })
  .add(() => {
    console.log("6 Reverse")
    scrollPosition = 5
    if (!debug) {
      hideDetails(ToHero, FromHero)
    }
  })

const seventhScrollReverseFun = () => gsap.timeline({ paused: true })
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 2,
  })
  .to(CARDS[8 - 1], {
    opacity: 1
  }, '<')
  .to(CARDS[8], {
    opacity: 0.5
  }, '<')

  .to(CARDS[8 - 3], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[8 - 2], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[8 - 1], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[8 + 0], {
    y: '30px',
    rotate: '8deg'
  }, '<')
  .to(CARDS[8 + 1], {
    y: '110px',
    rotate: '16deg',
  }, '<')
  .to(CARDS[8 + 2], {
    y: '240px',
    rotate: '16deg',
  }, '<')
  .add(() => {
    scrollPosition = 6
    if (!debug) {
      hideDetails(ToHero, FromHero)
    }
  })

const eighthScrollReverseFun = () => gsap.timeline({ paused: true })
  .add(() => {
    scrollPosition = 8
    if (!debug) {
      hideDetails(ToHero, FromHero)
    }
  })

const ninthScrollReverseFun = () => gsap.timeline({ paused: true })
  //fourth slide
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 3,
  })
  .to(CARDS[9 - 1], {
    opacity: 1
  }, '<')
  .to(CARDS[9], {
    opacity: 0.5
  }, '<')
  .to(CARDS[9 - 3], {
    y: '110px',
    rotate: '-16deg'
  }, '<')
  .to(CARDS[9 - 2], {
    y: '30px',
    rotate: '-8deg'
  }, '<')
  .to(CARDS[9 - 1], {
    y: '-20px',
    rotate: '0deg'
  }, '<')
  .to(CARDS[9 + 0], {
    y: '30px',
    rotate: '8deg'
  }, '<')
  .to(CARDS[9 + 1], {
    y: '110px',
    rotate: '16deg',
  }, '<')
  .to(CARDS[9 + 2], {
    y: '240px',
    rotate: '16deg',
  }, '<')
  .add(() => {
    scrollPosition = 9
    if (!debug) {
      showDetails(tiles[3], pages[3], 2502)
    }
  })


const tenthScrollReverseFun = () => gsap.timeline({ paused: true })
  .add(() => {
    scrollPosition = 10
    if (!debug) {
      hideDetails(ToHero, FromHero)
    }
  })

const eleventhScrollReverseFun = () => gsap.timeline({ paused: true })
  // 5 th slide 
  .to(".wheelCon", {
    x: (-cardWidth - margin) * 4,
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
      canScroll = true
    }
  }, '<')

  .add(() => {
    scrollPosition = 11
    if (!debug) {
      showDetails(tiles[4], pages[4], 2622)
    }
  })
