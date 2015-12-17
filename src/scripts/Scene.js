class Scene {
  constructor({ physics, elements=[] }) {
    this.physics = physics;
    this.elements = elements;
    this.running = false;
  }

  add(element) {
    this.elements.push(element);
  }

  start() {
    this.running = true;
    this.run();
  }

  stop() {
    this.running = false;
  }

  run() {
    if (!this.running) return;
    this.physics.update();
    this.elements.forEach(e => e.update());
    requestAnimationFrame(() => this.run());
  }

  reset() {
    this.elements.forEach(e => e.reset());
  }
}

export default Scene;
