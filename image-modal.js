const modal = document.querySelector(".image-modal");

if (modal) {
  const preview = modal.querySelector("img");
  const closeButton = modal.querySelector(".image-modal__close");
  const images = document.querySelectorAll("main img");

  function openPreview(image) {
    preview.src = image.currentSrc || image.src;
    preview.alt = image.alt;
    modal.showModal();
  }

  images.forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-haspopup", "dialog");
    image.setAttribute("aria-label", `View image: ${image.alt || "image"}`);
    image.addEventListener("click", () => openPreview(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPreview(image);
      }
    });
  });

  closeButton.addEventListener("click", () => modal.close());
  modal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      modal.close();
    }
  });
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.close();
    }
  });
}
