const pizzaPrice = document.querySelectorAll(".pizza-price");
const pizzaName = document.querySelectorAll(".pizza-name");
const pizzaImg = document.querySelectorAll(".pizza-picture");
const addBtn = document.querySelectorAll(".add-to-cart-btn");
const h2 = document.querySelector("h2");
const emptyBasket = document.querySelector(".empty-basket");
const basketAside = document.querySelector(".basket-aside");

let globaleData = [];
let listPizzas = [];
let panierPizzas = [];


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

    const spanName = createElement("span", { className: "basket-product-item-name" }, name);
    liItem.appendChild(spanName);

    const spanDetails = createElement("span", { className: "basket-product-details" });
    liItem.appendChild(spanDetails);

    const spanQuantity = createElement("span", { className: "basket-product-details-quantity" }, counter);
    spanDetails.appendChild(spanQuantity);

    const spanPrice = createElement("span", { className: "basket-product-details-unit-price" }, price);
    spanDetails.appendChild(spanPrice);

    const spanPriceTotal = createElement("span", { className: "basket-product-details-total-price" }, total);
    spanDetails.appendChild(spanPriceTotal);

    const imgRemove = createElement("img", { src: "../images/remove-icon.svg", alt: "remove", className: "basket-product-remove-icon" });
    liItem.appendChild(imgRemove);

    return divTotal;
}

function createConfirmOrder(prixTotal) {
    const divTotal = createElement("div", { className: "confirm-order" });

    const totalOrder = createElement("p", { className: "total-order" });
    divTotal.appendChild(totalOrder);

    const spanTitle = createElement("span", { className: "total-order-title" }, "Order total");
    totalOrder.appendChild(spanTitle);

    const spanPrice = createElement("span", { className: "total-order-price" }, `$${prixTotal}`);
    totalOrder.appendChild(spanPrice);

    const deliveryInfo = createElement("p", { className: "delivery-info" }, "This is a carbon neutral delivery");
    divTotal.appendChild(deliveryInfo);

    const confirmOrder = createElement("a", { href: "#", className: "confirm-order-btn" }, "Confirm order");

    confirmOrder.addEventListener("click", async () => {
        const myCardOrderConfirm = createCardOrderConfirm();
        document.body.appendChild(myCardOrderConfirm)
    })
    
    divTotal.appendChild(confirmOrder);

    return divTotal;
}

let counter = 0;
let toto = 0;

async function afficherPizza() {
    const rep = await fetch("http://51.38.232.174:3001/products");
    const data = await rep.json();
    console.log(data);
    globaleData = data;
    for (let i = 0; i < data.length; i++) {
        const dataAll = data[i];
        pizzaName[i].textContent = dataAll.name;
        pizzaImg[i].src = dataAll.image;
        pizzaImg[i].alt = dataAll.name;
        pizzaPrice[i].textContent = `$${dataAll.price}`;
        toto++;
        addBtn[i].setAttribute("data-id", toto);

        addBtn[i].addEventListener("click", () => {
            counter++;
            h2.innerText = `Votre panier (${counter})`;
            emptyBasket.innerHTML = "";
            console.log(data);

            const pizzaObj = listPizzas.find((pizza) => pizza.id == dataAll.id);

            if (pizzaObj === undefined) {
                const newPizzaObj = { id: dataAll.id, img: dataAll.image ,quantity: 1, price: dataAll.price, name: dataAll.name };
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
            console.log(listPizzas);

            const BtnConfirm = createConfirmOrder(totalPrice);
            basketAside.appendChild(BtnConfirm);
        });
    }
}

function createCardOrderConfirm() {
    let total = 0;
    const divTotal = createElement("div", { className: "order-modal-wrapper" });

    const divOrderModal = createElement("div", { className: "order-modal" });
    divTotal.appendChild(divOrderModal);

    const imgCheck = createElement("img", { src: "../images/carbon_checkmark-outline.svg", alt: "check" });
    divOrderModal.appendChild(imgCheck);

    const title = createElement("p", { className: "order-modal-title" }, "Order Confirmed");
    divOrderModal.appendChild(title);

    const subtitle = createElement("p", { className: "order-modal-subtitle" }, "We hope you enjoy your food!");
    divOrderModal.appendChild(subtitle);

    const ul = createElement("ul", { className: "order-detail" });
    divOrderModal.appendChild(ul);

    for (let i = 0; i < listPizzas.length; i++) {
        const element = listPizzas[i];
        const li = createElement("li", { className: "order-detail-product-item" });
        ul.appendChild(li);

        const imgPizza = createElement("img", {
            className: "order-detail-product-image",
            src: element.img,
            alt: element.name
        });
        li.appendChild(imgPizza);

        const spanName = createElement("span", { className: "order-detail-product-name" }, element.name);
        li.appendChild(spanName);

        const spanQuantity = createElement("span", { className: "order-detail-product-quantity" }, `${element.quantity}x`);
        li.appendChild(spanQuantity);

        const spanPrice = createElement("span", { className: "order-detail-product-unit-price" }, `@ $${element.price}`);
        li.appendChild(spanPrice);

        const prixTotalPizza = element.price * element.quantity;
        const spanTotalPrice = createElement("span", { className: "order-detail-product-total-price" }, `$${prixTotalPizza}`);
        li.appendChild(spanTotalPrice);

        total += prixTotalPizza;
    }

    const liOrder = createElement("li", { className: "order-detail-total-price" });
    ul.appendChild(liOrder);

    const spanTitle = createElement("span", { className: "total-order-title" }, "Order total");
    liOrder.appendChild(spanTitle);

    const spanPriceTotal = createElement("span", { className: "total-order-price" }, `$${total}`);
    liOrder.appendChild(spanPriceTotal);

    const newOrderBtn = createElement("a", { className: "new-order-btn" }, "Start new order");
    divOrderModal.appendChild(newOrderBtn);

    newOrderBtn.addEventListener("click", () => {
        location.reload();
    });

    return divTotal;
}

window.addEventListener("DOMContentLoaded", afficherPizza);