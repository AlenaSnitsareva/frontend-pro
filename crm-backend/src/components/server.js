export async function loadingData() {
    const response = await fetch("http://localhost:3000/api/clients", {
        method: "GET",
    });
    return await catchErrors(response);
}

export async function postData(client) {
    const response = await fetch("http://localhost:3000/api/clients", {
        method: "POST",
        body: JSON.stringify({
            name: client.name,
            surname: client.surname,
            lastName: client.lastName,
            contacts: client.contacts
                ? client.contacts.map((contact) => ({
                      type: contact.type,
                      value: contact.value,
                  }))
                : [],
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    return await catchErrors(response);
}

export async function deleteClient(id) {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: "DELETE",
    });
    return await catchErrors(response);
}

export async function patchClient(client) {
    const response = await fetch(
        `http://localhost:3000/api/clients/${client.id}`,
        {
            method: "PATCH",
            body: JSON.stringify({
                name: client.name,
                surname: client.surname,
                lastName: client.lastName,
                contacts: client.contacts
                    ? client.contacts.map((contact) => ({
                          type: contact.type,
                          value: contact.value,
                      }))
                    : [],
            }),
            headers: {
                "Content-Type": "application/json",
            },
        },
    );
    return await catchErrors(response);
}

async function catchErrors(response) {
    const errors = [];

    if (response.status === 200 || response.status === 201) {
        try {
            return await response.json();
        } catch (TypeError) {
            errors.push({
                message: "Что-то пошло не так...",
            });
        }
    } else if (response.status === 404) {
        errors.push({
            message: "Ошибка: проверьте подключение к интернету.",
        });
    } else if (response.status === 422) {
        const messages = await response.json();
        messages.errors.forEach((err) => {
            errors.push({ message: err.message });
        });
    } else if (response.status === 500) {
        if (!localStorage.getItem("reload")) {
            localStorage.setItem("reload", "0");
            try {
                await response.json();
            } catch (TypeError) {
                errors.push({
                    message: "Ошибка: попробуйте обновить страницу позже.",
                });
            }
        } else if (localStorage.getItem("reload") === "0") {
            localStorage.setItem("reload", "1");
        } else if (localStorage.getItem("reload") === "1") {
            errors.push({
                message: "Ошибка: попробуйте обновить страницу позже.",
            });
            localStorage.removeItem("reload");
        }
    }
    if (errors.length) {
        const err = new Error();
        err.errorMessages = errors;
        throw err;
    }
}

export function createErrorMessage(message) {
    const errorContainer = document.getElementById("app-error-message");
    const errorMessage = document.createElement("div");

    errorContainer.classList.add("error-message-container");
    errorMessage.classList.add("error-message");

    errorMessage.textContent = message;
    errorContainer.append(errorMessage);
}
