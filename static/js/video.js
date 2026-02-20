var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

let player;
window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player('video-player', {});
};

modalVideo = document.querySelector('#modal-video');

document.querySelector('section:first-of-type img').addEventListener("click", (event) => {
  modalVideo.style.display = "block";
  player.playVideo();
});

modalVideo.addEventListener("click", (event) => {
  modalVideo.style.display = "none";
  player.pauseVideo();
});
