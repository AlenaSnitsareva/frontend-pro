import {
    postData,
    patchClient,
    deleteClient,
    createErrorMessage,
} from "./server.js";

export function createModalWindow(typeModal, client) {
    const container = document.getElementById("container");

    window.scrollTo(0, 0);

    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal-container");
    modalContainer.onclick = () => {
        modalContainer.remove();
    };

    const modalWindow = document.createElement("form");
    modalWindow.classList.add("modal-window");
    modalWindow.onclick = (e) => {
        e.stopPropagation();
    };

    const modalHeadContainer = document.createElement("div");
    modalHeadContainer.classList.add("modal-head-container");

    const modalTitle = document.createElement("h2");
    modalTitle.classList.add("modal-title");
    modalTitle.innerHTML = `${typeModal} <span class="modal-id-client">ID: ${client.id ? client.id : ""}</span>`;

    const modalCloseBtn = document.createElement("button");
    modalCloseBtn.classList.add("btn-reset");
    modalCloseBtn.classList.add("btn-close");
    modalCloseBtn.innerHTML = `<svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M22.2332 7.73333L21.2665 6.76666L14.4998 13.5334L7.73318 6.7667L6.76652 7.73336L13.5332 14.5L6.76654 21.2667L7.73321 22.2333L14.4998 15.4667L21.2665 22.2334L22.2332 21.2667L15.4665 14.5L22.2332 7.73333Z" fill="#B0B0B0"/>
</svg>`;
    modalCloseBtn.setAttribute("type", "button");
    modalCloseBtn.addEventListener("click", () => {
        modalContainer.remove();
    });

    const modalSurnameLabel = document.createElement("label");
    modalSurnameLabel.innerHTML = `Фмилия<span class="require">*</span>`;
    modalSurnameLabel.setAttribute("for", "surname");

    const modalSurname = document.createElement("input");
    modalSurname.value = client.surname ? client.surname : "";
    modalSurname.setAttribute("id", "surname");
    modalSurname.setAttribute("name", "surname");
    modalSurname.setAttribute("required", "true");

    const modalNameLabel = document.createElement("label");
    modalNameLabel.innerHTML = `Имя<span class="require">*</span>`;
    modalNameLabel.setAttribute("for", "name");

    const modalName = document.createElement("input");
    modalName.value = client.name ? client.name : "";
    modalName.setAttribute("id", "name");
    modalName.setAttribute("name", "name");
    modalName.setAttribute("required", "true");

    const modalLastNameLabel = document.createElement("label");
    modalLastNameLabel.innerHTML = "Отчество";
    modalLastNameLabel.setAttribute("for", "lastname");

    const modalLastName = document.createElement("input");
    modalLastName.value = client.lastName ? client.lastName : "";
    modalLastName.setAttribute("id", "lastname");
    modalLastName.setAttribute("name", "lastName");

    const formLabels = [modalSurnameLabel, modalNameLabel, modalLastNameLabel];
    formLabels.forEach((label) => {
        label.classList.add("modal-label");
    });

    const formInputsFullName = [modalName, modalSurname, modalLastName];
    inputsFullNameListener(formInputsFullName);
    formInputsFullName.forEach((input) => {
        input.classList.add("modal-input");
    });

    const modalAddContact = document.createElement("button");
    modalAddContact.classList.add("btn-reset");
    modalAddContact.classList.add("add-contact-btn");
    modalAddContact.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.99998 3.66671C6.63331 3.66671 6.33331 3.96671 6.33331 4.33337V6.33337H4.33331C3.96665 6.33337 3.66665 6.63337 3.66665 7.00004C3.66665 7.36671 3.96665 7.66671 4.33331 7.66671H6.33331V9.66671C6.33331 10.0334 6.63331 10.3334 6.99998 10.3334C7.36665 10.3334 7.66665 10.0334 7.66665 9.66671V7.66671H9.66665C10.0333 7.66671 10.3333 7.36671 10.3333 7.00004C10.3333 6.63337 10.0333 6.33337 9.66665 6.33337H7.66665V4.33337C7.66665 3.96671 7.36665 3.66671 6.99998 3.66671ZM6.99998 0.333374C3.31998 0.333374 0.333313 3.32004 0.333313 7.00004C0.333313 10.68 3.31998 13.6667 6.99998 13.6667C10.68 13.6667 13.6666 10.68 13.6666 7.00004C13.6666 3.32004 10.68 0.333374 6.99998 0.333374ZM6.99998 12.3334C4.05998 12.3334 1.66665 9.94004 1.66665 7.00004C1.66665 4.06004 4.05998 1.66671 6.99998 1.66671C9.93998 1.66671 12.3333 4.06004 12.3333 7.00004C12.3333 9.94004 9.93998 12.3334 6.99998 12.3334Z" fill="#9873FF"/>
    </svg> Добавить контакт`;
    modalAddContact.setAttribute("type", "button");
    modalAddContact.addEventListener("click", () => {
        const newContact = createContact(contacts, modalAddContact, typeModal);
        contacts.append(newContact.contactContainer);
        if (contacts.children.length >= 10) {
            modalAddContact.classList.add("disabled");
        }
    });

    const contacts = document.createElement("div");
    contacts.classList.add("contacts");
    if (client.contacts) {
        client.contacts.forEach((cont) => {
            const newContact = createContact(
                contacts,
                modalAddContact,
                typeModal,
            );
            newContact.contactSelector.textContent = cont.type;
            newContact.input.value = cont.value;
            contacts.append(newContact.contactContainer);
        });
    }
    if (contacts.children.length > 0) {
        modalAddContact.classList.add("pb-25-pt-0");
    }

    const modalSaveAndCancelContainer = document.createElement("div");
    modalSaveAndCancelContainer.classList.add("container-save-cancel");

    const modalSave = document.createElement("button");
    modalSave.classList.add("btn-reset");
    modalSave.classList.add("modal-save-btn");
    modalSave.setAttribute("type", "submit");
    modalSave.innerHTML = `<svg class="modal-save-loading" id="loading-modal" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_224_6260)">
    <path d="M3.00008 8.03996C3.00008 10.8234 5.2566 13.08 8.04008 13.08C10.8236 13.08 13.0801 10.8234 13.0801 8.03996C13.0801 5.25648 10.8236 2.99996 8.04008 2.99996C7.38922 2.99996 6.7672 3.1233 6.196 3.348" stroke="#B89EFF" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
    </g>
<defs>
<clipPath id="clip0_224_6260">
<rect width="16" height="16" fill="white"/>
</clipPath>
</defs>
</svg> Сохранить`;
    modalSaveListener(
        modalContainer,
        modalSave,
        contacts,
        client,
        typeModal,
        formInputsFullName,
    );

    const modalCancel = document.createElement("button");
    modalCancel.classList.add("btn-reset");
    modalCancel.classList.add("modal-cancel-btn");
    modalCancel.setAttribute("type", "button");

    if (typeModal === "Изменить данные") {
        modalCancel.innerHTML = "Удалить клиента";
    } else if (typeModal === "Новый клиент") {
        modalCancel.innerHTML = "Отмена";
    } else if (typeModal === "Карточка клиента") {
        modalAddContact.style.display = "none";
        modalSave.style.display = "none";
        modalCloseBtn.style.display = "none";
        contacts.style.marginBottom = "12px";
        modalContainer.style.position = "static";
        modalWindow.style.position = "static";
    }
    modalCancel.addEventListener("click", () => {
        if (typeModal === "Изменить данные") {
            deleteClient(client.id);
        }
        modalContainer.remove();
    });

    const modalErrors = document.createElement("div");
    modalErrors.setAttribute("id", "app-error-message");

    modalHeadContainer.append(modalTitle);
    modalHeadContainer.append(modalCloseBtn);
    modalWindow.append(modalHeadContainer);
    modalWindow.append(modalSurnameLabel);
    modalWindow.append(modalSurname);
    modalWindow.append(modalNameLabel);
    modalWindow.append(modalName);
    modalWindow.append(modalLastNameLabel);
    modalWindow.append(modalLastName);
    modalWindow.append(contacts);
    modalWindow.append(modalAddContact);
    modalWindow.append(modalErrors);
    modalSaveAndCancelContainer.append(modalSave);
    modalSaveAndCancelContainer.append(modalCancel);
    modalWindow.append(modalSaveAndCancelContainer);
    if (typeModal === "Карточка клиента") {
        const backBtn = document.createElement("a");
        backBtn.classList.add("btn-reset");
        backBtn.classList.add("modal-save-btn");
        backBtn.innerHTML = "Вернуться на главную";
        backBtn.href = "?";
        modalSaveAndCancelContainer.append(backBtn);
    }
    modalContainer.append(modalWindow);
    container.append(modalContainer);

    return modalWindow;
}

function modalSaveListener(
    modalContainer,
    modalSave,
    contacts,
    client,
    typeModal,
    [modalName, modalSurname, modalLastName],
) {
    modalSave.addEventListener("click", async (e) => {
        e.preventDefault();
        const contactsInputs = document.querySelectorAll(".contact-input");
        contactsInputs.forEach((el) => {
            el.disabled = "true";
            if (el.value === "") {
                el.classList.add("modal-input-red");
            }
        });
        [modalName, modalSurname, modalLastName].forEach((el) => {
            el.disabled = "true";
        });
        if (modalName.value === "") {
            modalName.classList.add("modal-input-red");
        }
        if (modalSurname.value === "") {
            modalSurname.classList.add("modal-input-red");
        }
        const modalSaveLoading = document.getElementById("loading-modal");
        modalSaveLoading.classList.add("display-block");
        let contactsList = [];
        contacts.querySelectorAll(".contact").forEach((el) => {
            const type = el.children[0].children[0].innerHTML;
            const value = el.children[1].value;
            const contact = {
                type,
                value,
            };
            contactsList.push(contact);
        });

        if (typeModal === "Изменить данные") {
            try {
                await patchClient({
                    id: client.id,
                    name: modalName.value,
                    surname: modalSurname.value,
                    lastName: modalLastName.value,
                    contacts: contactsList,
                });
            } catch (err) {
                if (!err.errorMessages) {
                    modalSaveLoading.classList.remove("display-block");
                    modalContainer.remove();
                    return;
                }
                const errorContainer =
                    document.getElementById("app-error-message");
                errorContainer.innerHTML = "";
                err.errorMessages.forEach((errorMessage) => {
                    modalSaveLoading.classList.remove("display-block");
                    createErrorMessage(errorMessage.message);
                });
            }
            contactsInputs.forEach((el) => {
                el.removeAttribute("disabled");
            });
            [modalName, modalSurname, modalLastName].forEach((el) => {
                el.removeAttribute("disabled");
            });
            return;
        } else if (typeModal === "Новый клиент") {
            try {
                await postData({
                    name: modalName.value,
                    surname: modalSurname.value,
                    lastName: modalLastName.value,
                    contacts: contactsList,
                });
            } catch (err) {
                if (!err.errorMessages) {
                    modalSaveLoading.classList.remove("display-block");
                    modalContainer.remove();
                    return;
                }
                const errorContainer =
                    document.getElementById("app-error-message");
                errorContainer.innerHTML = "";
                err.errorMessages.forEach((errorMessage) => {
                    modalSaveLoading.classList.remove("display-block");
                    createErrorMessage(errorMessage.message);
                });
            }
            contactsInputs.forEach((el) => {
                el.removeAttribute("disabled");
            });
            [modalName, modalSurname, modalLastName].forEach((el) => {
                el.removeAttribute("disabled");
            });
        }
    });
}

function inputsFullNameListener(formInputsFullName) {
    const expectedString =
        "абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ -";
    formInputsFullName.forEach((input) => {
        input.addEventListener("keypress", (event) => {
            const newKey = event.key;
            if (!expectedString.includes(newKey)) {
                event.preventDefault();
            }
            if (input.name === "name" || input.name === "surname") {
                if (!(input.value === "")) {
                    input.classList.remove("modal-input-red");
                }
            }
        });

        input.addEventListener("blur", () => {
            let inputString = input.value;
            inputString = inputString.replace(/^[\s\-]+/g, "");
            inputString = inputString.replace(/[\s\-]+$/g, "");

            inputString = inputString.replace(/\-{2,}/g, "-");
            inputString = inputString.replace(/\s{1,}/g, "");

            inputString =
                inputString[0].toUpperCase() +
                inputString.slice(1).toLowerCase();

            let inputStringarr = inputString.split("");
            let inputStringWithoutLatin = "";
            inputStringarr.forEach((symb) => {
                if (expectedString.includes(symb)) {
                    inputStringWithoutLatin = inputStringWithoutLatin + symb;
                }
            });
            input.value = inputStringWithoutLatin;
        });
    });
}

function createContact(contacts, modalAddContact, typeModal) {
    const contactContainer = document.createElement("div");
    const contactSelectorContainer = document.createElement("div");
    const contactSelector = document.createElement("button");
    const contactHolder = document.createElement("ul");
    const contactTel = document.createElement("li");
    const contactAdditionalTel = document.createElement("li");
    const contactEmail = document.createElement("li");
    const contactVk = document.createElement("li");
    const contactFacebook = document.createElement("li");
    const contactOther = document.createElement("li");
    const input = document.createElement("input");
    const removeContact = document.createElement("button");

    const contactTypesArr = [
        contactTel,
        contactAdditionalTel,
        contactEmail,
        contactVk,
        contactFacebook,
        contactOther,
    ];

    contactTypesArr.forEach((type) => {
        type.addEventListener("click", () => {
            contactSelector.innerHTML = type.textContent;
        });
    });

    contactContainer.classList.add("contact");
    contactSelectorContainer.classList.add("contact-selector-container");
    contactSelector.classList.add("contact-selector");
    contactHolder.classList.add("contact-holder");
    input.classList.add("contact-input");
    removeContact.classList.add("contact-remove-contact");

    contactSelector.setAttribute("name", "contacts");
    contactSelector.innerHTML = "Телефон";
    contactTel.innerHTML = "Телефон";
    contactAdditionalTel.innerHTML = "Доп. телефон";
    contactEmail.innerHTML = "Email";
    contactVk.innerHTML = "VK";
    contactFacebook.innerHTML = "Facebook";
    contactOther.innerHTML = "Другое";
    removeContact.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_224_6297)">
<path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#B0B0B0"/>
</g>
<defs>
<clipPath id="clip0_224_6297">
<rect width="16" height="16" fill="white"/>
</clipPath>
</defs>
</svg>`;

    if (typeModal === "Карточка клиента") {
        contactHolder.style.display = "none";
        removeContact.style.display = "none";
        contactSelector.style.backgroundImage = "none";
        input.style.userSelect = "text";
    }

    input.addEventListener("keypress", () => {
        if (!(input.value === "")) {
            input.classList.remove("modal-input-red");
        }
    });

    removeContact.setAttribute("type", "button");
    contactSelector.setAttribute("type", "button");

    contactHolder.append(contactTel);
    contactHolder.append(contactAdditionalTel);
    contactHolder.append(contactEmail);
    contactHolder.append(contactVk);
    contactHolder.append(contactFacebook);
    contactHolder.append(contactOther);
    contactSelectorContainer.append(contactSelector);
    contactSelectorContainer.append(contactHolder);
    contactContainer.append(contactSelectorContainer);
    contactContainer.append(input);
    contactContainer.append(removeContact);

    if (contacts.children.length > 0) {
        modalAddContact.classList.add("pb-25-pt-0");
    }

    removeContact.addEventListener("click", () => {
        if (contacts.children.length <= 10) {
            modalAddContact.classList.add("enabled");
        }
        if (contacts.children.length === 1) {
            modalAddContact.classList.remove("pb-25-pt-0");
        }
        contactContainer.remove();
    });

    return { contactContainer, contactSelector, input, removeContact };
}
