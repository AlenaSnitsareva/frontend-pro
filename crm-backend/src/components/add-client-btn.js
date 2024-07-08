export default function btnModalWindow() {
    const addBtn = document.getElementById("btn-add-contact");
    addBtn.addEventListener("click", async () => {
        const moduleModalWindow = await import("./create-modal.js");
        moduleModalWindow.createModalWindow("Новый клиент", {});

        const tl = new gsap.timeline();
        tl.fromTo(
            ".modal-container",
            { opacity: 0 },
            { opacity: 1, duration: 0.1 },
        ).fromTo(".modal-window", { y: -600 }, { y: 0, duration: 0.2 });
    });
}
