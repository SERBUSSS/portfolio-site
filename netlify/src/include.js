function includeHTML() {
    const elements = document.querySelectorAll("[data-include]");
    const promises = [];

    elements.forEach((el) => {
        const file = el.getAttribute("data-include");
        const promise = fetch(file)
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    return Promise.reject(new Error(`Failed to fetch ${file}`));
                }
            })
            .then(html => {
                el.innerHTML = html;
            })
            .catch(error => {
                console.error("Error loading content:", error);
                el.innerHTML = "Content not found.";
            });

        promises.push(promise);
    });

    return Promise.all(promises);
}

document.addEventListener("DOMContentLoaded", includeHTML);

