const pizzaPrice = document.querySelectorAll(".pizza-price");
const pizzaName = document.querySelectorAll(".pizza-name");
const pizzaImg = document.querySelectorAll(".pizza-picture");
const addBtn = document.querySelectorAll(".add-to-cart-btn");
const h2 = document.querySelector("h2");
const emptyBasket = document.querySelector(".empty-basket");
const basketAside = document.querySelector(".basket-aside");
const confirmOrderBtn = document.querySelector(".confirm-order-btn");

const listPizzas = [];

function createElement(tag, attributes = {}, textContent = "") {
  const element = document.createElement(tag);
  for (const key in attributes) {
    if (key === "className") element.className = attributes[key];
    else element.setAttribute(key, attributes[key]);
  }
  if (textContent) element.textContent = textContent;
  return element;
}

function createPanier(name, counter, price, total) {
  const divTotal = createElement("div", { className: "baskets-with-pizza" });

  const ul = createElement("ul", { className: "basket-products" });
  divTotal.appendChild(ul);

  const liItem = createElement("li", { className: "basket-product-item" });
  ul.appendChild(liItem);

  const spanName = createElement(
    "span",
    { className: "basket-product-item-name" },
    name
  );
  liItem.appendChild(spanName);

  const spanDetails = createElement("span", {
    className: "basket-product-details",
  });
  liItem.appendChild(spanDetails);

  const spanQuantity = createElement(
    "span",
    { className: "basket-product-details-quantity" },
    counter
  );
  spanDetails.appendChild(spanQuantity);

  const spanPrice = createElement(
    "span",
    { className: "basket-product-details-unit-price" },
    price
  );
  spanDetails.appendChild(spanPrice);

  const spanPriceTotal = createElement(
    "span",
    { className: "basket-product-details-total-price" },
    total
  );
  spanDetails.appendChild(spanPriceTotal);

  const imgRemove = createElement("img", {
    src: "../images/remove-icon.svg",
    alt: "remove",
    className: "basket-product-remove-icon",
  });
  liItem.appendChild(imgRemove);

  return divTotal;
}
let pDelievry;
function createConfirmOrder(prixTotal) {
  const divTotal = createElement("div", { className: "confirm-order" });

  const totalOrder = createElement("p", { className: "total-order" });
  divTotal.appendChild(totalOrder);

  const spanTitle = createElement(
    "span",
    { className: "total-order-title" },
    "Order total"
  );
  totalOrder.appendChild(spanTitle);

  const spanPrice = createElement(
    "span",
    { className: "total-order-price" },
    `$${prixTotal}`
  );
  totalOrder.appendChild(spanPrice);

  pDelievry = document.createElement("p");
  pDelievry.className = "delivery-info";
  pDelievry.innerHTML =
    "<p class='delivery-info'>This is a <span>carbon neutral</span> delivery</p>";
  divTotal.appendChild(pDelievry);

  const confirmOrder = createElement(
    "a",
    { href: "#", className: "confirm-order-btn" },
    "Confirm order"
  );
  confirmOrder.addEventListener("click", () => {
    const myCardOrderConfirmed = createOrderModal()
    document.body.appendChild(myCardOrderConfirmed)
  });
  divTotal.appendChild(confirmOrder);

  return divTotal;
}

let counter = 0;
let toto = 0;

async function afficherPizza() {
  const rep = await fetch("http://51.38.232.174:3001/products");
  const data = await rep.json();
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    const pizza = data[i];
    pizzaName[i].textContent = pizza.name;
    pizzaImg[i].src = pizza.image;
    pizzaImg[i].alt = pizza.name;
    pizzaPrice[i].textContent = `$${pizza.price}`;
    toto++;
    addBtn[i].setAttribute("data-id", toto);

    addBtn[i].addEventListener("click", () => {
      counter++;
      h2.innerText = `Votre panier (${counter})`;
      emptyBasket.innerHTML = "";
      console.log(data);

      const pizzaObj = listPizzas.find((pizzas) => pizzas.id === pizza.id);

      if (pizzaObj === undefined) {
        const newPizzaObj = {
          id: pizza.id,
          quantity: 1,
          price: pizza.price,
          name: pizza.name,
        };
        listPizzas.push(newPizzaObj);
      } else {
        pizzaObj.quantity += 1;
      }

      basketAside.innerHTML = "";
      const panierHeader = createElement("h2", {}, `Votre panier (${counter})`);
      basketAside.appendChild(panierHeader);

      let totalPrice = 0;
      for (const pizza of listPizzas) {
        const myCard = createPanier(
          pizza.name,
          `${pizza.quantity}x`,
          `@ $${pizza.price}`,
          `$${pizza.price * pizza.quantity}`
        );
        basketAside.appendChild(myCard);
        totalPrice += pizza.price * pizza.quantity;
      }

      const BtnConfirm = createConfirmOrder(totalPrice);
      basketAside.appendChild(BtnConfirm);
    });
  }
}

function createOrderModal() {
  const orderWrapper = createElement("div", {
    className: "order-modal-wrapper",
  });

  const orderModal = createElement("div", { className: "order-modal" });

  const checkmarkImg = createElement("img", {
    src: "../images/carbon_checkmark-outline.svg",
    alt: "",
  });

  const orderTitle = createElement(
    "p",
    { className: "order-modal-title" },
    "Order Confirmed"
  );

  const orderSubtitle = createElement(
    "p",
    { className: "order-modal-subtitle" },
    "We hope you enjoy your food!"
  );

  const orderDetailList = createElement("ul", { className: "order-detail" });

  const productItems = [
    {
      name: "Pizza aux anchois",
      quantity: "1x",
      unitPrice: "$5.50",
      totalPrice: "$15.50",
    },
    {
      name: "Pizza aux anchois",
      quantity: "1x",
      unitPrice: "$5.50",
      totalPrice: "$15.50",
    },
    {
      name: "Pizza aux anchois",
      quantity: "1x",
      unitPrice: "$5.50",
      totalPrice: "$15.50",
    },
  ];

  for (const product of productItems) {
    const productItem = createElement("li", {
      className: "order-detail-product-item",
    });

    const productImage = createElement("img", {
      className: "order-detail-product-image",
      src: "https://cdn.dummyjson.com/recipe-images/1.webp",
      alt: "",
    });
    const productName = createElement(
      "span",
      { className: "order-detail-product-name" },
      product.name
    );
    const productQuantity = createElement(
      "span",
      { className: "order-detail-product-quantity" },
      product.quantity
    );
    const productUnitPrice = createElement(
      "span",
      { className: "order-detail-product-unit-price" },
      `@ ${product.unitPrice}`
    );
    const productTotalPrice = createElement(
      "span",
      { className: "order-detail-product-total-price" },
      product.totalPrice
    );

    productItem.append(
      productImage,
      productName,
      productQuantity,
      productUnitPrice,
      productTotalPrice
    );
    orderDetailList.appendChild(productItem);
  }

  const totalPriceItem = createElement("li", {
    className: "order-detail-total-price",
  });

  const totalTitle = createElement(
    "span",
    { className: "total-order-title" },
    "Order total"
  );
  const totalPrice = createElement(
    "span",
    { className: "total-order-price" },
    "$46.50"
  );

  totalPriceItem.append(totalTitle, totalPrice);

  const newOrderBtn = createElement(
    "a",
    { className: "new-order-btn", href: "#" },
    "Start new order"
  );

  orderWrapper.appendChild(orderModal);
  orderModal.append(
    checkmarkImg,
    orderTitle,
    orderSubtitle,
    orderDetailList,
    totalPriceItem,
    newOrderBtn
  );

  return orderWrapper;
}
window.addEventListener("DOMContentLoaded", afficherPizza);
