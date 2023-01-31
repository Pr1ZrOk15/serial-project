"use strict";

// Loader
const loader = document.querySelector(".loader");

setTimeout(() => {
  loader.style.opacity = "0";
  setTimeout(() => {
    loader.classList.add("hide");
  }, 200);
}, 500);

// Modal
const openModal = document.querySelector("[data-modal]"),
  modal = document.querySelector(".modal");

openModal.addEventListener("click", modalOpen);

function modalOpen() {
  modal.classList.add("show");
  modal.classList.remove("hide");
  document.body.style.overflow = "hidden";
  clearInterval(modalTimer);
}

function closeModal() {
  modal.classList.add("hide");
  modal.classList.remove("show");
  document.body.style.overflow = "";
}

modal.addEventListener("click", (e) => {
  if (e.target == modal || e.target.getAttribute("data-modalClose") == "") {
    closeModal();
  }
});

const modalTimer = setTimeout(() => {
  modalOpen();
}, 5000);

// Tabs

const tabHeaderItems = document.querySelector(".tabheader__items"),
  tabHeaderItem = document.querySelectorAll(".tabheader__item"),
  tabContent = document.querySelectorAll(".tabcontent");

function hidenTabContent() {
  tabContent.forEach((item) => {
    item.classList.add("hide");
    item.classList.remove("show");
  });

  tabHeaderItem.forEach((content) => {
    content.classList.remove("tabheader__item_active");
  });
}

function showTabContent(i = 0) {
  tabContent[i].classList.add("show");
  tabContent[i].classList.add("anime");
  tabContent[i].classList.remove("hide");
  tabHeaderItem[i].classList.add("tabheader__item_active");
}

hidenTabContent();
showTabContent();

tabHeaderItems.addEventListener("click", (e) => {
  const target = e.target;
  if (target && target.classList.contains("tabheader__item")) {
    tabHeaderItem.forEach((item, index) => {
      if (target == item) {
        hidenTabContent();
        showTabContent(index);
      }
    });
  }
});

// Class
class MenuCard {
  constructor(img, alt, title, descr, price, parentElement, ...classes) {
    this.img = img;
    this.alt = alt;
    this.title = title;
    this.descr = descr;
    this.price = price;
    this.classes = classes;
    this.parentElement = document.querySelector(parentElement);
    this.transfer = 11000;
    this.changeUZS();
  }
  changeUZS() {
    this.price = this.price * this.transfer;
  }
  render() {
    const element = document.createElement("div");

    if (this.classes.length === 0) {
      this.element = "menu__item";
      element.classList.add(this.element);
    } else {
      this.classes.forEach((className) => element.classList.add(className));
    }

    element.innerHTML = `
      <img src=${this.img} alt=${this.alt} />
      <h3 class="menu__item-subtitle">${this.title}</h3>
      <div class="menu__item-descr">${this.descr}</div>
      <div class="menu__item-divider"></div>
      <div class="menu__item-price">
        <div class="menu__item-cost">Price:</div>
        <div class="menu__item-total"><span>${this.price}</span> month</div>
      </div>`;
    this.parentElement.append(element);
  }
}

new MenuCard(
  "img/tabs/1.png",
  "vegy",
  'Plan "Usual"',
  "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit nesciunt facere, sequi exercitationem praesentium ab cupiditate beatae debitis perspiciatis itaque quaerat id modi corporis delectus ratione nobis harum voluptatum in.",
  10,
  ".menu .container"
).render();

new MenuCard(
  "img/tabs/2.jpg",
  "elite",
  "Plan “Premium”",
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque aliquid molestiae, sit eveniet, tempora ipsum quaerat recusandae sapiente doloremque corporis dolores quas consectetur ut labore distinctio libero reiciendis harum sequi?,",
  15,
  ".menu .container"
).render();

new MenuCard(
  "img/tabs/3.jpg",
  "post",
  'Plan "VIP"',
  "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatibus natus nobis minus corporis atque enim vitae, modi eligendi commodi itaque voluptatum ipsum. Nemo reiciendis, id rem dolorum rerum consequuntur eos.",
  20,
  ".menu .container"
).render();

// Slider
const sliderContainer = document.querySelector(".slider-container"),
  slides = document.querySelectorAll(".offer__slide"),
  nextBtn = document.querySelector(".offer__slider-next"),
  prevBtn = document.querySelector(".offer__slider-prev"),
  curent = document.querySelector("#current"),
  total = document.querySelector("#total");

let idx = 0;
let slideIdx = 1;

// total
if (slides.length < 10) {
  total.textContent = `0${slides.length}`;
} else {
  total.textContent = slides.length;
}

// curent
function currentSlie() {
  if (slides.length < 10) {
    curent.textContent = `0${slideIdx}`;
  } else {
    curent.textContent = slideIdx;
  }
}
currentSlie();

function changeSilde() {
  if (idx > slides.length - 1) {
    idx = 0;
  } else if (idx < 0) {
    idx = slides.length - 1;
  }
  sliderContainer.style.transform = `translateX(-${idx * 100}%)`;
}

nextBtn.addEventListener("click", () => {
  idx++;
  changeSilde();
  if (slideIdx > slides.length - 1) {
    slideIdx = 1;
  } else {
    slideIdx++;
  }
  currentSlie();
});

prevBtn.addEventListener("click", () => {
  idx--;
  changeSilde();
  if (slideIdx == 1) {
    slideIdx = slides.length;
  } else {
    slideIdx--;
  }
  currentSlie();
});

// Forms
const forms = document.querySelectorAll("form");
forms.forEach((item) => {
  postData(item);
});
const msg = {
  loading: "loading...",
  sucsess: "So'rovingiz muvofaqiyatli yuborildi !",
  failure: "So'rov yuborilmoqda",
};
function postData(form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const statusText = document.createElement("div");
    statusText.textContent = msg.loading;
    setTimeout(() => {
      statusText.remove();
    }, 1000);
    form.append(statusText);

    const formData = new FormData(form);

    const obj = {};

    formData.forEach((val, key) => {
      obj[key] = val;
    });

    fetch("server.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((data) => data.text())
      .then((data) => {
        showThangsModal(msg.sucsess);
      })
      .catch(() => {
        showThangsModal(msg.failure);
      })
      .finally(() => {
        form.reset();
        statusText.remove();
      });

    // const surov = new XMLHttpRequest();
    // surov.open("POST", "server.php");
    // surov.setRequestHeader("Content-Type", "application/json");

    // const obj = {};
    // const formData = new FormData(form);

    // formData.forEach((val, key) => {
    //   obj[key] = val;
    // });
    // surov.send(formData);

    // surov.addEventListener("load", () => {
    //   if (surov.status === 200) {
    //     setTimeout(() => {
    //       statusText.remove();
    //     }, 1500);
    //     showThangsModal(msg.sucsess);
    //     form.reset();
    //   } else {
    //     showThangsModal(msg.failure);
    //     setTimeout(() => {
    //       statusText.remove();
    //     }, 1500);
    //   }
    // });
  });
}

// showThangsModal

function showThangsModal(massage) {
  const prevModal = document.querySelector(".modal__dialog");
  prevModal.classList.add("hide");
  modalOpen();

  const thanksModal = document.createElement("div");
  thanksModal.classList.add("modal__dialog");

  thanksModal.innerHTML = `
  <div class="modal__content">
    <div data-modalClose="" class="modal__close">&times;</div>
      <div class="modal__title">
          ${massage}
      </div>
  </div>
  `;
  modal.append(thanksModal);
  setTimeout(() => {
    thanksModal.remove();
    closeModal();
    prevModal.classList.add("show");
    prevModal.classList.remove("hide");
  }, 1500);
}

// Promise ---> va'da degan ma'noni anglatadi !

// const isCommingFriend = true;

// const promise = new Promise((resolve, reject) => {
//   if (isCommingFriend) {
//     const msg = "Do'stim men keldim !";
//     resolve(msg);
//   } else {
//     const error = "Do'stim uzur men bora olmayman !";
//     reject(error);
//   }
// });

// promise
//   .then((msg) => console.log(msg))
//   .catch((error) => console.log(error))
//   .finally(() => console.log("Kelsang ham kelmasang ham telefon qilib qoy !"));

// // API

// fetch("https://jsonplaceholder.typicode.com/posts")
//   .then((response) => response.json())
//   .then((data) => console.log(data));
