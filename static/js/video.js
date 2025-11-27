  modalVideo = document.querySelector('#modal-video');
  heroVideo = document.querySelector('#hero-video');

  document.querySelector('section:first-of-type img').addEventListener("click", (event) => {
    modalVideo.style.display = "block";
    heroVideo.play();
  });

  modalVideo.addEventListener("click", (event) => {
    heroVideo.pause();
    modalVideo.style.display = "none";
  });

  heroVideo.addEventListener('ended', () => {
    modalVideo.style.display = "none";
  });