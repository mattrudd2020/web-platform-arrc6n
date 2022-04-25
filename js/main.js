console.log('hello!');

function init() {
  const swipeup = document.querySelector('.swipeup');

  // reset position of the loading screen
  // gsap.set(swipeup, {
  //  autoAlpha: 1,

  
function loaderIn() {
    // GSAP tween to stretch the loading screen across the whole screen
    return gsap.set(swipeup, {
           autoAlpha: 1,
           attr: {d: "M 0 100 V 100 Q 50 100 100 100 V 100 z"}  //bottom line
          },
          {
           duration: .8,
           ease: "power4.in",
           attr: {d: "M 0 100 V 50 Q 50 0 100 50 V 100 z"}      //arc top
          },
          {
           duration: .5,
           ease: "power2",
           attr: {d: "M 0 100 V 0 Q 50 0 100 0 V 100 z"}        //full square
          }
         );
 }
  
   
function loaderAway() {
  // GSAP tween to hide the loading screen
  return gsap.to(swipeup, 
    {
      delay: .2,
      duration: .3,
      ease: "power2.in",
      attr: {d: "M 0 100 V 50 Q 50 100 100 50 V 100 z"}    //arc dip
    },
    {
      delay: .2,
      duration: .3,
      ease: "power2.in",
      attr: {d: "M 0 100 V 100 Q 50 100 100 100 V 100 z"}    //bottom line final
    }
  );
}
  
//GLOBAL HOOKS

  // do something before the transition starts
  barba.hooks.before(() => {
    document.querySelector('html').classList.add('is-transitioning');
    barba.wrapper.classList.add('is-animating');
  });

  // kill old ScrollTriggers + Loco Scroll
  barba.hooks.afterLeave(() => {
    let count = 0;
    let triggers = ScrollTrigger.getAll();
    triggers.forEach(function (trigger) {
      count += 1;
      trigger.kill();
    });
    console.log(count + ' ST killed');
    
    // kill loco scroll
    scroll.destroy();
    initSmoothScroll(data.next.container);
    
  });

  // scroll to the top of the page
  barba.hooks.enter(() => {
    window.scrollTo(0, 0);
  });

  // do something after the transition finishes
  barba.hooks.after((data) => {
    document.querySelector('html').classList.remove('is-transitioning');
    barba.wrapper.classList.remove('is-animating');
    
    // update locomotive scroll
    scroll.update();
    // run animations & setup ScrollTriggers after new barba container has loaded in
    //animateTitle();
    setupScrollTriggers();

    // log out all STs after transition
    gsap.delayedCall(0.01, () =>
      ScrollTrigger.getAll().forEach((t) =>
        console.log('ST available for', t.vars.id, 'on', data.next.namespace)
      )
    );
  });

// BARBA INIT

  barba.init({
    transitions: [
      {
        async leave() {
          await loaderIn();
        },
        enter() {
          loaderAway();
        },
      },
    ],
  });
}
console.log('Barba initiated!');

window.addEventListener('load', function () {
  init();
  
  setupScrollTriggeranims();

  
  
  // log out all STs after load
  gsap.delayedCall(0.01, () =>
    ScrollTrigger.getAll().forEach((t) =>
      console.log(
        'ST available for',
        t.vars.id,
        'on',
        document.querySelector('#intro').getAttribute('data-barba-namespace')
      )
    )
  );
});


function setupScrollTriggeranims() {


// Using Locomotive Scroll from Locomotive --> https://github.com/locomotivemtl/locomotive-scroll
// connected to ScrollTrigger via
// https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.scrollerProxy() //

const scroller = document.querySelector('[data-scroll-container]')

const locoScroll = new LocomotiveScroll({
  el: scroller,
  smooth: true,
  getSpeed: true,
  lerp: 0.1
});
// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
locoScroll.on("scroll", ScrollTrigger.update);

// tell ScrollTrigger to use these proxy methods for the ".smooth-scroll" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy(scroller, {
  scrollTop(value) {
    return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
  getBoundingClientRect() {
    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
  },
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: scroller.style.transform ? "transform" : "fixed"
});

ScrollTrigger.defaults({
  scroller: scroller
})

//LOTTIE ANIMATION

LottieScrollTrigger({
    target: "#quote",
    path: "https://uploads-ssl.webflow.com/61a80bd2a3ff0e334f69bd03/61df93ff2941d82f928e5377_FINAL-NEW_LETTERS2.json",
    speed: "medium",
    pin: "#LottieSection",
    start: "top top",
    end: "bottom top",
    pinnedContainer: '#LottieSection',
    scrub: 1,
    markers: true
  }); 
  

function LottieScrollTrigger(vars) {
    let playhead = {frame: 0},
      target = gsap.utils.toArray(vars.target)[0],
      speeds = {slow: "+=2000", medium: "+=1000", fast: "+=500"},
      st = {trigger: target, pin: true, start: "top top", end: speeds[vars.speed] || "+=1000", scrub: 1},
      animation = lottie.loadAnimation({
        container: target,
        renderer: vars.renderer || "svg",
        loop: false,
        autoplay: false,
        path: vars.path
      });
    for (let p in vars) { // let users override the ScrollTrigger defaults
      st[p] = vars[p];
    }
    animation.addEventListener("DOMLoaded", function() {
      gsap.to(playhead, {
        frame: animation.totalFrames - 1,
        ease: "none",
        onUpdate: () => animation.goToAndStop(playhead.frame, true),
        scrollTrigger: st
    });  
    // in case there are any other ScrollTriggers on the page and the loading of this Lottie asset caused layout changes
 ScrollTrigger.sort();
    ScrollTrigger.refresh(); 
  });
  return animation;   
}
//Not loading after above animation!?//
const boxes = gsap.utils.toArray('.box');

// Set things up
gsap.set(boxes, {autoAlpha: 0, y: 100});

boxes.forEach((box, i) => {
  // Set up your animation
  const anim = gsap.to(box, {delay: 1, duration: 2, autoAlpha: 1, y: 0, ease:"power3", paused: true});
  
  // Use callbacks to control the state of the animation
  ScrollTrigger.create({
    trigger: box,
  	pinnedContainer: "#LottieSection",
    end: "top top",
    once: true,
    markers: true,
    onEnter: self => {
      // If it's scrolled past, set the state
      // If it's scrolled to, play it
      self.progress === 1 ? anim.progress(1) : anim.play()
    }
  });
});

// HORIZONTAL

const horizontalSections = gsap.utils.toArray('.horizontal')

horizontalSections.forEach(function (sec, i) {	
  
  var thisPinWrap = sec.querySelector('.pin-wrap');
  var thisAnimWrap = thisPinWrap.querySelector('.animation-wrap');
  
  var getToValue = () => -(thisAnimWrap.scrollWidth - window.innerWidth); 
  
  gsap.fromTo(thisAnimWrap, { 
    x: () => thisAnimWrap.classList.contains('to-right') ? 0 : getToValue() 
  }, { 
    x: () => thisAnimWrap.classList.contains('to-right') ? getToValue() : 0, 
    ease: "none",
    scrollTrigger: {
      trigger: sec,		
      scroller: scroller,
      start: "top top",
      end: () => "+=" + (thisAnimWrap.scrollWidth - window.innerWidth),
      pin: thisPinWrap,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      scrub: true,
      snap: 1,
      //markers: true
    }
  });

});	



// FOOTER CODE
gsap.set('.footer-container', { yPercent: -50 })

const uncover = gsap.timeline({ paused:true })

uncover
.to('.footer-container', { yPercent: 0, ease: 'none' })
;

ScrollTrigger.create({  
  trigger: '.copy2',
  start: 'bottom bottom',
  end: '+=75%',
  animation: uncover,
  scrub: true,  
  markers: true,
})

// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();

/////////TITLE SWITCH & PARA FADE///////

let panels = gsap.utils.toArray(".panel");
  
let tl2 = gsap.timeline({
  scrollTrigger: {
    trigger: ".text-container",
    start: "top top",
    end: "+=300%",
    scrub: true,
    pin: true,
    scroller: scroller
  }
});


let stayTime = 1; // seconds between each text flip on the timeline (not literally seconds on screen - we're just spacing them out on the timeline)
let textElements = gsap.utils.toArray(".text"); // get an Array of all the ".text" elements

// loop through each text element and add an autoAlpha flip at the appropriate times on the timeline
textElements.forEach((el, i) => {
  tl2.set(el, {autoAlpha: 1}, i * stayTime);
  if (i !== 0) { // if it's the first one, we don't need to toggle the previous one off.
    tl2.set(textElements[i - 1], {autoAlpha: 0}, i * stayTime);
  }
});
// add some space at the end of the timeline so the last one stays for the correct duration before things get unpinned.
tl2.set({}, {delay: stayTime});

tl2.to(".panel.first", {
  yPercent: -100
});

tl2.to("#para-text", {opacity: 0,}, "<1");


gsap.set(".panel", {zIndex: (i, target, targets) => targets.length - i});





// CASESTUDY PAGE CODE!
  
function pinnedSidePanel() {

gsap.set(".panel", { zIndex: (i, target, targets) => targets.length - i });

var caseimages = gsap.utils.toArray('.panel:not(.purple)');

caseimages.forEach((caseimage, i) => {
   
   var tl = gsap.timeline({
     
     scrollTrigger: {
       trigger: "section.black",

       
       start: () => "top -" + (window.innerHeight * (i)),
       
       end: () => "+=" + window.innerHeight,
       scrub: true,
       toggleActions: "play none reverse none",
       invalidateOnRefresh: true,     
     }
     
   })
   
   tl
   .fromTo(caseimage, { height: () => { return "100%" } }, { height: () => { return "0%" }, ease: "none" })
   ;
   
});
 
 


ScrollTrigger.create({

    trigger: "section.black",
    //markers: true,
  
    /*---*/
    pin: '.p-wrap',
  
    start: () => "top top",
    end: () => "+=" + ((caseimages.length) * window.innerHeight),
    invalidateOnRefresh: true,
   
});



ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
ScrollTrigger.refresh();
  
}

}