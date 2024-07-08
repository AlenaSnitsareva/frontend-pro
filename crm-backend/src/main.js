import { loadingData } from "./components/server.js";

const data = await loadingData();
const appContainer = document.getElementById("container");
const searchParams = new URLSearchParams(location.search);

const clientId = searchParams.get("id");

if (clientId) {
    appContainer.innerHTML = "";
    const client = data.filter((client) => {
        if (client.id.includes(clientId)) {
            return client;
        }
    });
    const renderClientDitailsModule = await import(
        "./components/render-client-ditails.js"
    );
    await renderClientDitailsModule.renderClientDitails(client);
} else {
    const renderMainPaggeModule = await import(
        "./components/render-main-pagge.js"
    );
    renderMainPaggeModule.renderMainPagge().forEach((el) => {
        appContainer.append(el);
    });
    const createItems = await import("./components/create-items.js");
    createItems.createTbody(data);
    const search = await import("./components/search-and-sort.js");
    search.headButtonsSort(data);
    search.search(data);
}
