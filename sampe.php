<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/responsive.css">
    <title>Document</title>
</head>
<body>
    <button onclick="toggleFullscreen()">Toggle Fullscreen</button>
    <script>
        let isFakeFullscreen = false;

function toggleFullscreen() {
  const elem = document.documentElement;

  // Use real Fullscreen API if available
  if (document.fullscreenEnabled || document.webkitFullscreenEnabled) {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      exitFullscreen();
    } else {
      enterFullscreen(elem);
    }
  } else {
    // Fallback for iOS Safari
    simulateFullscreen();
  }
}

function enterFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function simulateFullscreen() {
  const body = document.body;
  if (!isFakeFullscreen) {
    body.classList.add("fullscreen-fallback");
  } else {
    body.classList.remove("fullscreen-fallback");
  }
  isFakeFullscreen = !isFakeFullscreen;
}

    </script>
</body>
</html>