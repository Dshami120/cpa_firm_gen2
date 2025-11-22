document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            navLinks.classList.toggle("open");
        });
    }

    async function handleFormSubmit(form, endpoint) {
        const statusEl = form.querySelector(".form-status");
        if (!statusEl) return;

        statusEl.textContent = "";
        statusEl.classList.remove("form-status--ok", "form-status--error");

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Something went wrong. Please try again.");
            }

            statusEl.textContent = data.message || "Thank you! We will be in touch shortly.";
            statusEl.classList.add("form-status--ok");
            form.reset();
        } catch (err) {
            statusEl.textContent = err.message || "Unable to submit form at this time.";
            statusEl.classList.add("form-status--error");
        }
    }

    document.querySelectorAll("form[data-form='contact-home']").forEach(form => {
        form.addEventListener("submit", e => {
            e.preventDefault();
            handleFormSubmit(form, "/api/contact");
        });
    });

    document.querySelectorAll("form[data-form='contact-page']").forEach(form => {
        form.addEventListener("submit", e => {
            e.preventDefault();
            handleFormSubmit(form, "/api/contact");
        });
    });

    document.querySelectorAll("form[data-form='newsletter']").forEach(form => {
        form.addEventListener("submit", e => {
            e.preventDefault();
            handleFormSubmit(form, "/api/newsletter");
        });
    });
});
