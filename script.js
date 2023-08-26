'use strict';


// selection of elements
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const section3 = document.querySelector('#section--3');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.btn__operation');
const tabsContainer = document.querySelector('.operation__tab');
const tabsContent = document.querySelectorAll('.operation__box');
const header = document.querySelector('.header');
const dotContainer = document.querySelector('.dots');
///////////////////////////////////////
// Modal window


const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


// Scrolling

btnScrollTo.addEventListener('click', function(e){
  section1.scrollIntoView({behavior: 'smooth'});
});

// Page navigation

//normal method
// document.querySelectorAll('.nav__link').forEach(a=> a.addEventListener('click', function(e){
//   e.preventDefault();
//   const id = e.target.getAttribute('href');
//   document.querySelector(id).scrollIntoView({behavior: 
//   'smooth'});
// }));

//event delegation
document.querySelector('.nav__links').addEventListener('click', function(e){
  e.preventDefault();
  if(e.target.classList.contains('nav__link')){
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
})

// Tabbed component

tabsContainer.addEventListener('click', function(e){
  const clicked = e.target.closest('.btn__operation');
  console.log(clicked);
  // Gaurd unwanted click events
  if(!clicked) return;

  // Removing active classes
  tabs.forEach(t => t.classList.remove('btn__operation--active'));
  tabsContent.forEach(t => t.classList.remove('operation__box--active'));

  // showing tabs content
  clicked.classList.add('btn__operation--active');
  tabsContent.forEach(t => {
    if(t.classList.contains(`operation__box-${clicked.dataset.tab}`)) t.classList.add('operation__box--active');
  })
})

// handling hover

const handleHover = function(e){
  const link = e.target;
  
  const siblings = link.closest('.nav').querySelectorAll('.nav__link');
  if(link.classList.contains('nav__link')){
    const nav__logo = link.closest('.nav').querySelector('.nav__logo');
    siblings.forEach(s => {
      if(s != link){
        s.style.opacity = this;
        nav__logo.style.opacity = this;
      }
    });
  }
  else if(link.classList.contains('nav__logo')){
    siblings.forEach(s => s.style.opacity = this);
  }
}
const nav = document.querySelector('.nav');
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation

// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function(){
//   console.log(this.scrollY);
//   if(window.scrollY > initialCoords.top){
//     nav.classList.add('sticky');
//   }else nav.classList.remove('sticky');
// });

// sticky navigation using intersectionObserver API

const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function(entries, /*observer*/){
  const [entry] = entries;

  if(!entry.isIntersecting){
    nav.classList.add('sticky');
  }
  else nav.classList.remove('sticky');
}
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});
headerObserver.observe(header);

// Revelaing sectins
const allSections = document.querySelectorAll('.section');
const revealSection = function(entries, observer){
  const [entry] = entries;
  console.log(entries);
  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(section =>{
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// lazy image loading
const dataImages = document.querySelectorAll('img[data-src]');
const lazyLoading = function(entries, observer){
  const [entry] = entries;

  if(!entry.isIntersecting) return;

  // making lazyloading
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img');
  })
  observer.unobserve(entry.target);
}
const imgObserver = new IntersectionObserver(lazyLoading, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
});
dataImages.forEach(img =>{
  imgObserver.observe(img);
});

// Slider

const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
let currentSlide = 0;
const maxSlide = slides.length - 1;

const createDots = function(){
  slides.forEach((_, i)  =>{
    dotContainer.insertAdjacentHTML('beforeend', `<button class = "dot" data-ind = '${i}'></button>`)
  })
}
const activateDot = function(dot){
  const dots = document.querySelectorAll('.dot');
  dots.forEach(d => d.classList.remove('dot--active'));
  document.querySelector(`.dot[data-ind = "${dot}"]`).classList.add('dot--active');
}
const goToSlide = function(slide){
  slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
  activateDot(slide);
}
const nextSlide = function(){
  if(currentSlide === maxSlide) currentSlide = 0;
  else currentSlide++;
  goToSlide(currentSlide);
}
const prevSlide = function(){
  if(currentSlide === 0) currentSlide = maxSlide;
  else currentSlide--;
  goToSlide(currentSlide);
}
const init = function(){
  createDots();
  activateDot(0);
  goToSlide(0);
}
init();

// event handlers
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

// dots sliding
dotContainer.addEventListener('click', function(e){
  if(e.target.classList.contains('dot')){
    goToSlide(e.target.dataset.ind);
  }
})


// arrow key sliding
document.addEventListener('keydown', function(e){
  if(e.key === 'ArrowRight') nextSlide();
  else if(e.key === 'ArrowLeft') prevSlide();
});

//////////////////////////
/////////////////////////
////////////////////////
//  Selecting elements
// const allSections = document.querySelectorAll('.section') // it returns nodeList

// document.getElementsByClassName('header'); // it returns a collection = collection is a life Data structure of javaScript that changes according to current condition of the page if any new element add or remove from the list then it will automatically added or removed from the collection.

// document.getElementById('section--1'); // also return collection

// document.getElementsByTagName('button')// also returns collection

// creating and inserting elements
// const message = document.createElement('div');
// message.classList.add('message--cookie')
// message.innerHTML = '<p> We use cookies to make better functionality and analytics.</p> <button class="btn btn-close--cookie">Got it!</button>'

// header.prepend(message);
// header.append(message); //message can be insert only at one place if have to insert at multiple places then use cloneNode method
// header.append(message.cloneNode(true)); 
// header.after(message);
// header.before(message);


// deleting elements
// document.querySelector('.btn-close--cookie').addEventListener('click', function(){
//   message.remove();
  // message.parentElement.removeChild(message);
// });

// styles

// message.style.backgroundColor = '#37383d';
// message.style.width = '105%';
// console.log(getComputedStyle(message).height);
// message.style.height = (parseFloat(getComputedStyle(message).height) + 30 + 'px');

// attributes
// const logo = document.querySelector('#logo');
// console.log(logo.src);
// console.log(logo.getAttribute('src'));
// console.log(logo.className);
// console.log(logo.getAttribute('class'));
// logo.setAttribute('name', 'abhishek');
// console.log(logo.getAttributeNames());


// date attributes --> starts with data keyword in html
// console.log(logo.dataset.visualEffect);


// Scrolling effect:

// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const sec1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', function(e){
//   const s1chord = sec1.getBoundingClientRect();
//   console.log(s1chord);

//   console.log(e.target.getBoundingClientRect());

//   // console.log(s1chord.top); it tells distance from viewport top
//   // console.log(s1chord.left);  it tells distance from viewport left and likewise right and bottom

//   console.log('current scroll (x/y): ', window.pageXOffset, window.pageYOffset);
//   // console.log('viewport height and width', document.documentElement.clientHeight, document.documentElement.clientWidth);

//   // Scrolling
//   // window.scrollTo(s1chord.left + window.pageXOffset, s1chord.top + window.pageYOffset);

//   // old way of smooth scrolling
//   // window.scrollTo({left: s1chord.left + window.pageXOffset,
//   // top: s1chord.top + window.pageYOffset,
//   // behavior: 'smooth'});

//   // new modern way
//   sec1.scrollIntoView({behavior: 'smooth'});
// });

// Event Propogation : capturing , target and bubbling phases --> eventListener works at the time of bubbling

// // rgb(69, 25, 45)

// const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function(e){
//   e.preventDefault();
//   this.style.backgroundColor = randomColor();
//   console.log('LINK: ', e.target);
// });

// document.querySelector('.nav__links').addEventListener('click', function(e){
//   e.preventDefault();
//   this.style.backgroundColor = randomColor();
//   // this.style.flexDirection = 'column';
//   console.log('LINKs: ', e.target);
// });

// document.querySelector('.nav').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('Nav', e.target, e.currentTarget);
// })