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

const wheel = document.querySelector(".wheel");
const card = gsap.utils.toArray(".card-wrapper");
function setup() {
  let radius = wheel.offsetWidth * 1.18;
  let centerx = wheel.offsetWidth / 2;
  let centery = wheel.offsetWidth / 0.75;
  let total = card.length;
  let slice = (2 * Math.PI) / total;

  card.forEach((item, i) => {
    let angle = i * slice;

    let x = centerx + radius * Math.sin(angle);
    let y = centery - radius * Math.cos(angle);

    gsap.set(item, {
      rotation: angle + "_rad",
      xPercent: -50,
      yPercent: -50,
      x: x,
      y: y
    });
  });
};

window.addEventListener("resize", setup);
setup()



var root = document.documentElement;
var body = document.body;
var pages = document.querySelectorAll(".tile");
var tiles = document.querySelectorAll(".card");

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
    //ease: 'power1.easeOut',
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



const angle = -360 / 37

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
  .to(".card", {
    opacity: 0.5,
    duration: 2,
  })
  .to(".card01", {
    opacity: 1,
    duration: 2,
  }, "<")

  .to(".wheel", {
    rotate: () => angle,
    ease: "none",
    duration: card.length,
  }, '+=0.5')
