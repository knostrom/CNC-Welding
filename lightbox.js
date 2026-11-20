const lightbox = document.createElement("dialog");
lightbox.className = "image-lightbox";
lightbox.setAttribute("aria-labelledby", "image-lightbox-caption");
lightbox.innerHTML = `
  <button class="image-lightbox__close" type="button" aria-label="Close enlarged image" autofocus>×</button>
  <figure>
    <img class="image-lightbox__image" alt="">
    <figcaption class="image-lightbox__caption" id="image-lightbox-caption"></figcaption>
  </figure>
`;
document.body.append(lightbox);

const lightboxImage = lightbox.querySelector(".image-lightbox__image");
const lightboxCaption = lightbox.querySelector(".image-lightbox__caption");

document.querySelectorAll("main .hero__image img, main .project img").forEach((image) => {
  image.classList.add("image-lightbox__trigger");
  image.tabIndex = 0;
  image.setAttribute("role", "button");
  image.setAttribute("aria-label", `View larger image: ${image.alt}`);

  function openLightbox() {
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.closest("figure")?.querySelector("figcaption")?.textContent.trim() || image.alt;
    lightbox.showModal();
  }

  image.addEventListener("click", openLightbox);
  image.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox();
    }
  });
});

lightbox.querySelector(".image-lightbox__close").addEventListener("click", () => {
  lightbox.close();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.open) {
    event.preventDefault();
    lightbox.close();
  }
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

lightbox.addEventListener("close", () => {
  lightboxImage.removeAttribute("src");
});
