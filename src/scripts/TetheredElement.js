import { Particle, Constraint } from 'baby-verlet';

class TetheredElement {
  constructor({ el, physics, particles }) {
    this.el = el;
    this.metrics = el.getBoundingClientRect();
    this.physics = physics;
    this.particles = particles;
    this.constraints = {};
    this.setup();
  }

  setup() {
    let position = this.getCenter();

    this.createParticle('center', { position });
    this.createConstraint('mouse', {
      particles: [this.particles.center, this.particles.mouse],
      maxLength: 300,
      stiffness: .003,
      length: 0
    });

    this.createParticle('anchor', { position, fixed: true });
    this.createConstraint('tether', {
      particles: [this.particles.anchor, this.particles.center],
      stiffness: .01,
      length: 0
    });
  }

  getCenter() {
    return [
      this.metrics.left + this.metrics.width / 2,
      this.metrics.top + this.metrics.height / 2
    ];
  }

  createParticle(name, opts) {
    let particle = new Particle(opts);
    this.particles[name] = particle;
    this.physics.add(particle);
  }

  createConstraint(name, opts) {
    let constraint = new Constraint(opts);
    this.constraints[name] = constraint;
    this.physics.add(constraint);
  }

  update() {
    let x = this.particles.center.position.x - this.metrics.left - this.metrics.width / 2;
    let y = this.particles.center.position.y - this.metrics.top - this.metrics.height / 2;
    this.el.style.transform = `translate(${x}px, ${y}px)`;
  }

  reset() {
    this.el.style.transform = '';
    let { center, anchor } = this.particles;
    center.moveTo(...anchor.position.toArray());
  }
}

export default TetheredElement;
