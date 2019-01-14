class Scroll {
  constructor(scroll) {
    this.element = scroll;
    this.elementHeight = scroll.clientHeight;
    this.windowHeight = window.innerHeight;
    this.init();
  }
  init() {
    if (!this.inView())
      document.addEventListener("scroll", this.animate.bind(this));
    else this.animate.apply(this);
  }
  inView() {
    if (
      this.element.getBoundingClientRect().top - this.windowHeight <= 0 &&
      this.element.getBoundingClientRect().bottom >= 0
    ) {
      return true;
    }

    return false;
  }
  animate() {
    if (this.inView()) {
      this.element.classList.add("js-animate");
    }
  }
}

export default () => {
  let elementsWithAnimation = [
    ...document.querySelectorAll(".js-wait-for-animate")
  ];
  elementsWithAnimation.forEach(item => new Scroll(item));
};