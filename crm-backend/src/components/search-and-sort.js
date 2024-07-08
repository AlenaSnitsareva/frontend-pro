import { createTbody } from "./create-items.js";
export function search(data) {
    const search = document.getElementById("search");
    search.addEventListener("input", () => {
        const filteredFioData = filterData(data, search);
        setTimeout(() => {
            createTbody(filteredFioData);
        }, 300);
    });
    return filterData(data, search);
}

function filterData(data, search) {
    const filteredFioData = data.filter((client) => {
        const fullName =
            client.surname + " " + client.name + " " + client.lastName;
        console.log(typeof fullName);
        if (
            fullName.includes(search.value) ||
            client.id.includes(search.value)
        ) {
            return client;
        }
    });
    return filteredFioData;
}

export function headButtonsSort(data) {
    const columns = document.querySelectorAll(".sort");
    columns.forEach(async (column) => {
        const key = column.getAttribute("data-key");
        if (key === "id") await updateTable(key, column, data);
        column.addEventListener("click", async () => {
            await updateTable(key, column, data);
        });
    });
}

async function updateTable(key, column, data) {
    let direction;
    const arrow = column.querySelector(".arrow-th");
    if (column.classList.contains("asc")) {
        arrow.innerHTML = `<img src="./src/assets/img/arrow_down.svg" alt="Сортировка по убыванию"/>`;
        direction = "+";
        column.classList.remove("asc");
    } else {
        arrow.innerHTML = `<img src="./src/assets/img/arrow_up.svg" alt="Сортировка по возрастанию"/>`;
        direction = "-";
        column.classList.add("asc");
    }

    createTbody(await sort(key, direction, data));
}

async function sort(key, direction, data) {
    let newDataList = await search(data);
    if (!newDataList) {
        newDataList = data;
    }
    const value = direction === "+" ? 1 : -1;
    return newDataList.sort((a, b) => {
        if (a[key] < b[key]) {
            return value * 1;
        }
        if (a[key] > b[key]) {
            return value * -1;
        }
        return 0;
    });
}
