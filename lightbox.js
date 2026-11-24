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

function openLightbox(src, alt, caption) {
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightboxCaption.textContent = caption;
  lightbox.showModal();
}

document.querySelectorAll("main .hero__image img, main .project img").forEach((image) => {
  image.classList.add("image-lightbox__trigger");
  image.tabIndex = 0;
  image.setAttribute("role", "button");
  image.setAttribute("aria-label", `View larger image: ${image.alt}`);

  const caption = image.closest("figure")?.querySelector("figcaption")?.textContent.trim() || image.alt;
  image.addEventListener("click", () => openLightbox(image.currentSrc || image.src, image.alt, caption));
  image.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(image.currentSrc || image.src, image.alt, caption);
    }
  });
});

const businessCardLink = document.querySelector("[data-business-card]");
if (businessCardLink) {
  const businessCardStorageKey = "cnc-business-card-downloaded";
  let downloadAlreadyTriggered = false;

  try {
    downloadAlreadyTriggered = localStorage.getItem(businessCardStorageKey) === "true";
  } catch (error) {
    console.error("Unable to check whether the business card was previously downloaded.", error);
  }

  businessCardLink.addEventListener("click", (event) => {
    event.preventDefault();

    if (!downloadAlreadyTriggered) {
      downloadAlreadyTriggered = true;
      const downloadLink = document.createElement("a");
      downloadLink.href = businessCardLink.href;
      downloadLink.download = businessCardLink.download;
      document.body.append(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      try {
        localStorage.setItem(businessCardStorageKey, "true");
      } catch (error) {
        console.error("Unable to save the business card download status.", error);
      }
    }

    openLightbox(
      businessCardLink.href,
      "CNC Welding & Fabrication business card",
      "CNC Welding & Fabrication business card"
    );
  });
}

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
