import { deleteClient } from "./server.js";

export function createTbody(data) {
    const loading = document.getElementById("tbody-loading");
    const loadingAnimation = document.getElementById("loading");
    const tbody = document.getElementById("tbody");
    tbody.innerHTML = "";
    if (data.length === 0) {
        loadingAnimation.style.display = "none";
        return;
    } else {
        loadingAnimation.style.display = "block";
    }

    loading.style.display = "none";
    data.forEach((client) => {
        const clientItem = createItemTr(client);
        tbody.append(clientItem);
    });
}

function createItemTr(client) {
    const tr = document.createElement("tr");

    const tdID = document.createElement("td");
    const tdFullName = document.createElement("td");
    const tdFullNameLink = document.createElement("a");
    const tdDateCreate = document.createElement("td");
    const tdLatestChange = document.createElement("td");
    const tdContacts = document.createElement("td");
    const contactsContainer = document.createElement("ul");
    const tdActions = document.createElement("td");

    const clientChangeContainer = document.createElement("div");
    const changeBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");

    tr.classList.add("tbody-client");
    [
        tdID,
        tdFullName,
        tdDateCreate,
        tdLatestChange,
        tdContacts,
        tdActions,
    ].forEach((el) => {
        el.classList.add("tbody-col");
    });

    tdID.classList.add("client-id");
    tdFullName.classList.add("client-full-name");
    tdFullNameLink.classList.add("client-full-name-link");
    changeBtn.classList.add("client-change");
    deleteBtn.classList.add("client-delete");
    contactsContainer.classList.add("client-contact-container");
    clientChangeContainer.classList.add("client-change-container");

    tdID.innerHTML = `${client.id}`;
    tdFullNameLink.innerHTML = `${client.surname} ${client.name} ${client.lastName}`;
    tdFullNameLink.href = `?id=${client.id}`;
    tdDateCreate.innerHTML = `<time class="client-date" datetime="${client.createdAt}">${dateConversion(client.createdAt)}</time> <span class="client-time">${timeConversion(client.createdAt)}</span>`;
    tdLatestChange.innerHTML = `<time class="client-date" datetime="${client.updatedAt}">${dateConversion(client.updatedAt)}</time> <span class="client-time">${timeConversion(client.updatedAt)}</span>`;
    changeBtn.innerHTML = "Изменить";
    deleteBtn.innerHTML = "Удалить";

    const numberOfContact = document.createElement("li");
    numberOfContact.classList.add("numb-of-contacts");
    numberOfContact.style.display = "none";

    client.contacts.forEach((cont) => {
        const contactBtn = createClientContactBtn(cont);
        contactsContainer.append(contactBtn);
        tdContacts.append(contactsContainer);
        if (contactsContainer.children.length > 5) {
            numberOfContact.innerHTML = `+${contactsContainer.children.length - 4}`;
            contactsContainer.children[4].style.display = "none";
            contactBtn.style.display = "none";
            numberOfContact.style.display = "flex";
            numberOfContact.addEventListener("click", () => {
                contactBtn.style.display = "";
                numberOfContact.style.display = "none";
            });
        }
    });
    contactsContainer.append(numberOfContact);

    tdFullNameLink.addEventListener("click", async (e) => {
        e.preventDefault;
    });

    changeBtn.addEventListener("click", async () => {
        const moduleModalWindow = await import("./create-modal.js");
        moduleModalWindow.createModalWindow("Изменить данные", client);
        const tl = new gsap.timeline();
        tl.fromTo(
            ".modal-container",
            { opacity: 0 },
            { opacity: 1, duration: 0.1 },
        ).fromTo(
            ".modal-window",
            { y: -600, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.2 },
        );
    });

    deleteBtn.addEventListener("click", () => {
        createModalDeleteItem(client.id);
        const tl = new gsap.timeline();
        tl.fromTo(
            ".modal-container",
            { opacity: 0 },
            { opacity: 1, duration: 0.1 },
        ).fromTo(
            ".modal-window",
            { y: -600, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.2 },
        );
    });

    clientChangeContainer.append(changeBtn);
    clientChangeContainer.append(deleteBtn);
    tdActions.append(clientChangeContainer);
    tdFullName.append(tdFullNameLink);
    tr.append(tdID);
    tr.append(tdFullName);
    tr.append(tdDateCreate);
    tr.append(tdLatestChange);
    tr.append(tdContacts);
    tr.append(tdActions);

    return tr;
}

function createClientContactBtn(cont) {
    const contactBtn = document.createElement("li");
    const contactValue = document.createElement("span");
    const contactBG = document.createElement("div");

    const LinkTypeString = setImgContactTypeAndCheckTypeLink(contactBtn, cont);

    contactBtn.classList.add("client-contact-img");
    contactValue.classList.add("client-contact-value");
    contactBG.classList.add("client-contact-bg");

    contactValue.innerHTML = `${cont.type}:&nbsp<a class="contact-link"  target="_blank" href="${LinkTypeString}${cont.value}">${cont.value}</a>`;

    contactBG.append(contactValue);
    contactBtn.append(contactBG);

    return contactBtn;
}

function setImgContactTypeAndCheckTypeLink(el, cont) {
    if (cont.type === "Телефон" || cont.type === "Дополнительный телефон") {
        el.classList.add("client-contact-phone");
        return "tel:";
    } else if (cont.type === "Email") {
        el.classList.add("client-contact-email");
        return "mailto:";
    } else if (cont.type === "VK") {
        el.classList.add("client-contact-vk");
        return "https://vk.com/";
    } else if (cont.type === "Facebook") {
        el.classList.add("client-contact-fb");
        return "http://www.facebook.com/";
    } else if (cont.type === "Другое") {
        el.classList.add("client-contact-other");
        return "#:";
    }
}

function dateConversion(string) {
    let date = "";
    const dateString = string.split("T")[0];
    const dateArr = dateString.split("-");
    dateArr.forEach((value) => {
        date = value + "." + date;
    });
    return date.slice(0, -1);
}

function timeConversion(string) {
    let time = string.split("T")[1].slice(0, 6);
    return time.slice(0, -1);
}

function createModalDeleteItem(clientId) {
    const container = document.getElementById("container");
    const modalContainer = document.createElement("div");

    const modalWindow = document.createElement("div");
    const modalTitle = document.createElement("h2");
    const modalQuestion = document.createElement("p");
    const modalDeleteCancelContainer = document.createElement("div");
    const modalDelete = document.createElement("button");
    const modalCancel = document.createElement("button");

    modalTitle.innerHTML = "Удалить клиента";
    modalQuestion.innerHTML =
        "Вы действительно хотите удалить данного клиента?";
    modalDelete.innerHTML = "Удалить";
    modalCancel.innerHTML = "Отмена";

    modalWindow.onclick = (e) => {
        e.stopPropagation();
    };

    modalContainer.onclick = () => {
        modalContainer.remove();
    };

    modalDelete.addEventListener("click", () => {
        deleteClient(clientId);
        modalContainer.remove();
    });
    modalCancel.addEventListener("click", () => {
        modalContainer.remove();
    });

    modalContainer.classList.add("modal-container");
    modalWindow.classList.add("modal-window");
    modalTitle.classList.add("modal-delete-title");
    modalQuestion.classList.add("modal-delete-question");
    modalDeleteCancelContainer.classList.add("container-save-cancel");
    modalDelete.classList.add("btn-reset");
    modalCancel.classList.add("btn-reset");
    modalDelete.classList.add("modal-save-btn");
    modalCancel.classList.add("modal-cancel-btn");

    modalDeleteCancelContainer.append(modalTitle);
    modalDeleteCancelContainer.append(modalQuestion);
    modalDeleteCancelContainer.append(modalDelete);
    modalDeleteCancelContainer.append(modalCancel);
    modalWindow.append(modalDeleteCancelContainer);
    modalContainer.append(modalWindow);
    container.append(modalContainer);
}
