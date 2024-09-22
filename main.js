import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Flip } from "gsap/all";
import { TweenLite } from "gsap/gsap-core";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, Flip, TweenLite);

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
    rotate: '0deg'
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
};



var root = document.documentElement;
var body = document.body;
var pages = document.querySelectorAll(".tile");
const tiles = [...document.querySelectorAll('.firstCard'), ...document.querySelectorAll('.card')];

for (var i = 0; i < pages.length; i++) {
  addListeners(tiles[i], pages[i]);
}

function addListeners(tile, page) {

  tile.addEventListener("click", function () {
    animateHero(tile, page);
  });

  page.addEventListener("click", function () {
    animateHero(page, tile);
  });
}

function animateHero(fromHero, toHero) {

  var clone = fromHero.cloneNode(true);
  console.log(calculatePosition(fromHero), calculatePosition(toHero))

  var from = calculatePosition(fromHero);
  var to = calculatePosition(toHero);

  TweenLite.set([fromHero, toHero], { visibility: "hidden" });
  TweenLite.set(clone, { position: "absolute", margin: 0 });

  body.appendChild(clone);

  var style = {
    x: to.left - from.left,
    y: to.top - from.top,
    width: to.width,
    height: to.height,
    autoRound: false,
    onComplete: onComplete
  };

  TweenLite.set(clone, from);
  TweenLite.to(clone, 0.3, style)

  function onComplete() {
    TweenLite.set(toHero, { visibility: "visible" });
    body.removeChild(clone);
  }
}

function calculatePosition(element) {

  var rect = element.getBoundingClientRect();

  var scrollTop = window.pageYOffset || root.scrollTop || body.scrollTop || 0;
  var scrollLeft = window.pageXOffset || root.scrollLeft || body.scrollLeft || 0;

  var clientTop = root.clientTop || body.clientTop || 0;
  var clientLeft = root.clientLeft || body.clientLeft || 0;

  return {
    top: Math.round(rect.top + scrollTop - clientTop),
    left: Math.round(rect.left + scrollLeft - clientLeft),
    height: rect.height,
    width: rect.width,
  };
}

const card = document.querySelectorAll('.card');
const fakeCard1 = document.querySelectorAll('.cardFake');
const fakeCard2 = document.querySelectorAll('.cardFake2');
const cardWidth = card[0].offsetWidth;
const margin = 20

const CARDS = [...document.querySelectorAll('.cardFake'), ...document.querySelectorAll('.firstCard'), ...document.querySelectorAll('.card'), ...document.querySelectorAll('.cardfake2')];

console.log(CARDS)

const rotate = gsap.timeline({
  scrollTrigger: {
    trigger: ".cardCon",
    start: "-150px top",
    end: "100% top",
    pin: true,
    markers: true,
    scrub: true,
    snap: 1 / card.length,
    invalidateOnRefresh: true
  }
});


rotate
  .to(".card, .cardFake, .cardFake2", {
    opacity: 0.5,
    duration: 2,
  })
  .to(".card01", {
    opacity: 1,
    duration: 2,
    onComplete: () => {
      //animateHero(tiles[0], pages[0])
    }
  }, "<")


  //first slide 
  .to(".wheelCon", {
    x: -cardWidth - margin,
  })
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
};

