<template>
  <div class="loader"></div>
</template>

<style>
.loader {
  width: 1em;
  aspect-ratio: 4;
  --gradient: no-repeat
    radial-gradient(circle closest-side, var(--c-fg-2) 100%, var(--c-bg-0) 0%);
  background:
    var(--gradient) 0% 50%,
    var(--gradient) 50% 50%,
    var(--gradient) 100% 50%;
  background-size: calc(100% / 3) 100%;
  animation: loader 610ms infinite linear;
}
@keyframes loader {
  33% {
    background-size:
      calc(100% / 3) 0%,
      calc(100% / 3) 100%,
      calc(100% / 3) 100%;
  }
  50% {
    background-size:
      calc(100% / 3) 100%,
      calc(100% / 3) 0%,
      calc(100% / 3) 100%;
  }
  66% {
    background-size:
      calc(100% / 3) 100%,
      calc(100% / 3) 100%,
      calc(100% / 3) 0%;
  }
}
</style>
