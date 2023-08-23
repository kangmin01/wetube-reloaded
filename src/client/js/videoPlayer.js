const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("volume");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let volumeValue = 0.5; // 초기값, mute 되기 이전 볼륨
video.volume = volumeValue;
let controlsTimeout = null;
let controlsMovementTimeout = null;

let videoPlayStatus = false;

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleVideoEnded = () => {
  playBtnIcon.classList = "fas fa-play";
};

const handleMute = (e) => {
  if (video.muted) {
    video.muted = false;
    video.volume = volumeValue;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleInputVolume = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtnIcon.classList = "fas fa-volume-up";
  }
  if (value == 0) {
    video.muted = true;
    muteBtnIcon.classList = "fas fa-volume-mute";
  } else {
    volumeValue = value;
  }
  video.volume = value;
};

const formatTime = (seconds) => {
  const startIdx = seconds >= 3600 ? 11 : 14;
  return new Date(seconds * 1000).toISOString().substring(startIdx, 19);
};

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleInputTimeline = (event) => {
  const {
    target: { value },
  } = event;

  video.currentTime = value;
};

const handleTimelineMousedown = () => {
  videoPlayStatus = video.paused ? false : true;
  video.pause();
};

const handleTimelineMouseup = () => {
  if (videoPlayStatus) {
    video.play();
  } else {
    video.pause();
  }
};

const handleFullScreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 2000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 1000);
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

window.addEventListener("keydown", function (event) {
  if (event.target == textarea) {
    return;
  }
  if (event.code == "Space") {
    handlePlayClick();
  } else if (event.key == "M" || event.key == "m") {
    handleMute();
  } else if (event.key == "F" || event.key == "f") {
    handleFullScreen();
  }
});
playBtn.addEventListener("click", handlePlayClick);
video.addEventListener("click", handlePlayClick);
video.addEventListener("ended", handleVideoEnded);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleInputVolume);
video.readyState
  ? handleLoadedMetadata()
  : video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
timeline.addEventListener("input", handleInputTimeline);
timeline.addEventListener("mousedown", handleTimelineMousedown);
timeline.addEventListener("mouseup", handleTimelineMouseup);
fullScreenBtn.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
