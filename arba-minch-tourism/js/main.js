(function () {
    "use strict";

    // Hide spinner on page load
    window.addEventListener("load", function () {
        const spinner = document.getElementById("spinner");
        if (spinner) {
            setTimeout(() => {
                spinner.classList.remove("show");
            }, 250);
        }
    });

    // Sticky Navbar & Back-to-Top button
    const navbar = document.getElementById("mainNavbar");
    const backToTop = document.querySelector(".back-to-top");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 45) {
            navbar?.classList.add("sticky-top");
        } else {
            navbar?.classList.remove("sticky-top");
        }

        if (backToTop) {
            if (window.scrollY > 300) {
                backToTop.style.display = "flex";
            } else {
                backToTop.style.display = "none";
            }
        }
    });

    backToTop?.addEventListener("click", function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Destination category filter
    const filterButtons = document.querySelectorAll("[data-filter]");
    const destItems = document.querySelectorAll(".dest-item");

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            filterButtons.forEach((b) => b.classList.remove("active"));
            this.classList.add("active");

            const filter = this.getAttribute("data-filter");
            destItems.forEach((item) => {
                const category = item.getAttribute("data-category");
                if (filter === "all" || category === filter) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });

    // Quick Trip Finder Search
    const searchForm = document.getElementById("tripSearchForm");
    searchForm?.addEventListener("submit", function (e) {
        e.preventDefault();
        const query = document.getElementById("tripSearchInput")?.value.trim().toLowerCase();
        const target = document.getElementById("packages");
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
        if (query) {
            const toastEl = document.getElementById("bookingToast");
            const toastBody = document.getElementById("bookingToastBody");
            if (toastEl && toastBody && window.bootstrap) {
                toastBody.textContent = `Showing Arba Minch experiences matching "${query}".`;
                new bootstrap.Toast(toastEl).show();
            }
        }
    });

    // Booking Form Submission
    const bookingForm = document.getElementById("arbaMinchBookingForm");
    bookingForm?.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("guestName")?.value || "Traveler";
        const pkg = document.getElementById("guestPackage")?.value || "Arba Minch Tour";
        const toastEl = document.getElementById("bookingToast");
        const toastBody = document.getElementById("bookingToastBody");
        if (toastEl && toastBody && window.bootstrap) {
            toastBody.textContent = `Thank you, ${name}! Your request for "${pkg}" has been received. Our Arba Minch local team will contact you shortly.`;
            new bootstrap.Toast(toastEl).show();
        }
        bookingForm.reset();
    });

    // Newsletter Form Submission
    const newsletterForm = document.getElementById("newsletterForm");
    newsletterForm?.addEventListener("submit", function (e) {
        e.preventDefault();
        const toastEl = document.getElementById("bookingToast");
        const toastBody = document.getElementById("bookingToastBody");
        if (toastEl && toastBody && window.bootstrap) {
            toastBody.textContent = "Welcome! You're subscribed to Arba Minch seasonal guides & festival updates.";
            new bootstrap.Toast(toastEl).show();
        }
        newsletterForm.reset();
    });
})();
