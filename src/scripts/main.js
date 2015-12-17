import { World, Particle, Constraint } from 'baby-verlet';
import TetheredElement from './TetheredElement';
import Scene from './Scene';

let world = new World({
  width: window.innerWidth,
  height: window.innerHeight,
  gravity: [0, 0],
  airFriction: 0.02
});

let scene = new Scene({
  physics: world,
});

let mouseParticle = new Particle({ position: [9999, 9999], fixed: true });
world.add(mouseParticle);
$(window).on('mousemove', e => {
  mouseParticle.moveTo(e.pageX, e.pageY);
});

$('.icon').each(function () {
  let el = $(this).find('.icon-content')[0];
  addTetheredElement(el);

  if (this.dataset.app === 'colorchat') {
    $(this).find('.colorchat-icon-letter').each(function () {
      let hue = Math.round(Math.random() * 360);
      this.style.color = `hsl(${hue},100%,65%)`;
      addTetheredElement(this);
    });
  }
});

let taglineTimeout;

$('.icon').on('mouseenter', function () {
  if (!scene.running) return;
  if (taglineTimeout) clearTimeout(taglineTimeout);

  $('.tagline-text').text($(this).data('tagline'));
  $('.tagline').addClass('tagline-active-pre');
  taglineTimeout = setTimeout(function () {
    $('.tagline').addClass('tagline-active')
  }, 0);
});

$('.icon').on('mouseleave', function () {
  if (!scene.running) return;
  if (taglineTimeout) clearTimeout(taglineTimeout);

  $('.tagline').removeClass('tagline-active');
  taglineTimeout = setTimeout(function () {
    $('.tagline').removeClass('tagline-active-pre');
  }, 1000)
});

function addTetheredElement(el)  {
  let baseOpts = {
    physics: world,
    particles: { mouse: mouseParticle }
  };

  scene.add(new TetheredElement({ ...baseOpts, el }));
}

function setState() {
  let w = $(window).width();
  if (scene.running && w <= 1024) {
    scene.stop();
    scene.reset();
  } else if (!scene.running && w > 1024) {
    scene.start();
  }
}

setState();
$(window).resize(setState);
