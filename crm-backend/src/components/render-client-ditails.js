export async function renderClientDitails(clientList) {
    const moduleModalWindow = await import("./create-modal.js");
    moduleModalWindow.createModalWindow("Карточка клиента", clientList[0]);
}
