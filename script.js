const magicAreas = [...document.querySelectorAll(".c-magic-area")];

const getAreaDetails = (area) => {
  const width = area.clientWidth;
  const height = area.clientHeight;

  const position = area.getBoundingClientRect();
  const top = position.top + window.scrollY;
  const left = position.left;
  console.log(position.top);
  return {
    left,
    height,
    top,
    width
  };
};

const setTweenArea = (link, magicArea) => {
  const { left, height, top, width } = getAreaDetails(link);

  gsap.set(magicArea, {
    top,
    left,
    width,
    height
  });
};

const tweenMagicArea = (target, magicArea) => {
  const { left, height, top, width } = getAreaDetails(target);

  gsap.to(magicArea, 0.5, {
    left,
    top,
    width,
    height,
    ease: Power3.easeInOut
  });
};

const getMagicActiveElement = (links) => {
  return links.filter((link) => {
    return (
      link.classList.contains("is-magic-active") ||
      link.getAttribute("aria-current") === "page"
    );
  });
};

const moveMagicArea = (links, magicArea, isTweenBack) => {
  const magicActiveElement = getMagicActiveElement(links);

  links.map((link) => {
    link.addEventListener("mouseenter", function (e) {
      tweenMagicArea(e.target, magicArea);
    });

    link.addEventListener("focus", function (e) {
      tweenMagicArea(e.target, magicArea);
    });

    if (isTweenBack && magicActiveElement.length) {
      link.addEventListener("mouseleave", function (e) {
        tweenMagicArea(magicActiveElement[0], magicArea);
      });

      link.addEventListener("focusout", function (e) {
        tweenMagicArea(magicActiveElement[0], magicArea);
      });
    }
  });
};

const setMagic = (links, magicArea) => {
  // check if .is-magic-active || aria-current="page"
  const magicActiveElement = getMagicActiveElement(links);

  if (magicActiveElement.length) {
    setTweenArea(magicActiveElement[0], magicArea);
  } else {
    setTweenArea(links[0], magicArea);
  }
};

// const onResize = (links, magicArea) => {
//   setMagic(links, magicArea);
// };

const initMagic = ({ isResize } = { isResize: false }) => {
  if (!magicAreas.length) return;

  magicAreas.map((magicArea) => {
    const targetMagicArea = magicArea.getAttribute("data-target-class");

    const links = [...document.querySelectorAll(targetMagicArea)];

    if (!links.length) return;

    setMagic(links, magicArea);

    if (!isResize) {
      const isTweenBack = magicArea.getAttribute("data-tween-back") === "true";

      moveMagicArea(links, magicArea, isTweenBack);
    }
  });
};

initMagic();

window.addEventListener(
  "resize",
  _.throttle(function () {
    initMagic({ isResize: true });
  }, 100)
);

VanillaTilt.init(document.querySelector(".c-fe30__inner"), {
  max: 20,
  perspective: 1000,
  speed: 300
});

gsap.registerPlugin(Physics2DPlugin);

document.querySelectorAll('.button').forEach(button => {

    const bounding = button.getBoundingClientRect()

    button.addEventListener('mousemove', e => {

        let dy = (e.clientY - bounding.top - bounding.height / 2) / -1
        let dx = (e.clientX - bounding.left - bounding.width / 2)  / 10

        dy = dy > 10 ? 10 : (dy < -10 ? -10 : dy);
        dx = dx > 4 ? 4 : (dx < -4 ? -4 : dx);

        button.style.setProperty('--rx', dy);
        button.style.setProperty('--ry', dx);

    });

    button.addEventListener('mouseleave', e => {

        button.style.setProperty('--rx', 0)
        button.style.setProperty('--ry', 0)

    });

    button.addEventListener('click', e => {
        button.classList.add('success');
        gsap.to(button, {
            '--icon-x': -3,
            '--icon-y': 3,
            '--z-before': 0,
            duration: .2,
            onComplete() {
                particles(button.querySelector('.emitter'), 100, -4, 6, -80, -50);
                gsap.to(button, {
                    '--icon-x': 0,
                    '--icon-y': 0,
                    '--z-before': -6,
                    duration: 1,
                    ease: 'elastic.out(1, .5)',
                    onComplete() {
                        button.classList.remove('success');
                    }
                });
            }
        });
    });

});

function particles(parent, quantity, x, y, minAngle, maxAngle) {
    let colors = [
        '#FFFF04',
        '#EA4C89',
        '#892AB8',
        '#4AF2FD',
    ];
    for(let i = quantity - 1; i >= 0; i--) {
        let angle = gsap.utils.random(minAngle, maxAngle),
            velocity = gsap.utils.random(70, 140),
            dot = document.createElement('div');
        dot.style.setProperty('--b', colors[Math.floor(gsap.utils.random(0, 4))]);
        parent.appendChild(dot);
        gsap.set(dot, {
            opacity: 0,
            x: x,
            y: y,
            scale: gsap.utils.random(.4, .7)
        });
        gsap.timeline({
            onComplete() {
                dot.remove();
            }
        }).to(dot, {
            duration: .05,
            opacity: 1
        }, 0).to(dot, {
            duration: 1.8,
            rotationX: `-=${gsap.utils.random(720, 1440)}`,
            rotationZ: `+=${gsap.utils.random(720, 1440)}`,
            physics2D: {
                angle: angle,
                velocity: velocity,
                gravity: 120
            }
        }, 0).to(dot, {
            duration: 1,
            opacity: 0
        }, .8);
    }
}