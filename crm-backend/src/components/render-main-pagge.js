export function renderMainPagge() {
    const header = createHeader();
    const main = createMain();
    return [header, main];
}

function createHeader() {
    const header = document.createElement("header");
    const logoLink = document.createElement("a");
    const imgLogo = document.createElement("img");
    const search = document.createElement("input");

    header.classList.add("header");
    logoLink.classList.add("logo");
    search.classList.add("search");

    logoLink.href = "#";
    imgLogo.src = "./src/assets/img/logo.svg";
    imgLogo.alt = "Skb, система управления контактными данными";
    search.id = "search";
    search.type = "search";
    search.placeholder = "Введите запрос";

    logoLink.append(imgLogo);
    header.append(logoLink);
    header.append(search);

    return header;
}

function createMain() {
    const main = document.createElement("main");
    const hiddenTitle = document.createElement("h1");
    const title = document.createElement("h2");
    const table = document.createElement("table");
    const thead = createThead();
    const tbody = document.createElement("tbody");
    const loadingContainer = document.createElement("div");
    const loading = document.createElement("div");
    const loadingSvg = document.createElement("svg");
    const btnContainer = document.createElement("div");
    const btnAddClient = document.createElement("button");

    main.classList.add("main");
    title.classList.add("section-title");
    table.classList.add("table");
    tbody.classList.add("tbody");
    loadingContainer.classList.add("tbody-loading");
    loading.classList.add("loading");
    loadingSvg.classList.add("loading-svg");
    btnContainer.classList.add("btn-add-container");
    btnAddClient.classList.add("btn-add-contact");

    hiddenTitle.hidden = "true";
    title.innerHTML = "Клиенты";
    tbody.id = "tbody";
    loadingContainer.id = "tbody-loading";
    loading.id = "loading";
    loadingSvg.innerHTML = `<svg class="loading-svg" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 20C2 29.941 10.059 38 20 38C29.941 38 38 29.941 38 20C38 10.059 29.941 2 20 2C17.6755 2 15.454 2.4405 13.414 3.243" stroke="#9873FF" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round"></path>
                        </svg>`;
    btnAddClient.innerHTML = "Добавить клиента";

    listenerBtnAddClient(btnAddClient);

    table.append(thead);
    table.append(tbody);
    loading.append(loadingSvg);
    loadingContainer.append(loading);
    btnContainer.append(btnAddClient);
    main.append(hiddenTitle);
    main.append(title);
    main.append(table);
    main.append(loadingContainer);
    main.append(btnContainer);

    return main;
}

function createThead() {
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    const thId = document.createElement("th");
    const thFullName = document.createElement("th");
    const thCreatedAT = document.createElement("th");
    const thApdatedAt = document.createElement("th");
    const thContacts = document.createElement("th");
    const thActions = document.createElement("th");

    const theadList = [
        thId,
        thFullName,
        thCreatedAT,
        thApdatedAt,
        thContacts,
        thActions,
    ];

    thead.classList.add("thead");
    tr.classList.add("thead__list");
    theadList.forEach((item) => {
        item.classList.add("thead__item");
    });
    [thId, thFullName, thCreatedAT, thApdatedAt].forEach((item) => {
        item.classList.add("sort");
    });
    thId.classList.add("action-thead");

    thId.innerHTML = `ID<div class="arrow-th"><img src="./src/assets/img/arrow_up.svg" alt="Сортировка по возрастанию"></div>`;
    thId.setAttribute("data-key", "id");
    thFullName.innerHTML = `Фамилия Имя Отчество<div class="arrow-th">
                                    <img src="./src/assets/img/arrow_down.svg" alt="Сортировка по убыванию">
                                </div><span class="action-thead"> А-Я</span>`;
    thFullName.setAttribute("data-key", "surname");
    thCreatedAT.innerHTML = `Дата и время создания&nbsp;<div class="arrow-th">
                                    <img src="./src/assets/img/arrow_down.svg" alt="Сортировка по убыванию">
                                </div>`;
    thCreatedAT.setAttribute("data-key", "createdAt");
    thApdatedAt.innerHTML = `Последние изменения&nbsp<div class="arrow-th">
      <img src="./src/assets/img/arrow_down.svg" alt="Сортировка по убыванию">
      </div>
      `;
    thApdatedAt.setAttribute("data-key", "updatedAt");
    thContacts.innerHTML = `Контакты`;
    thActions.innerHTML = `Действия`;

    theadList.forEach((item) => {
        tr.append(item);
    });
    thead.append(tr);
    return thead;
}

function listenerBtnAddClient(addBtn) {
    addBtn.addEventListener("click", async () => {
        const moduleModalWindow = await import("./create-modal.js");
        moduleModalWindow.createModalWindow("Новый клиент", {});

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
}
