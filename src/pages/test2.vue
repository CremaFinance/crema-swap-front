<template>
  <div class="circle-container">
    <svg
      id="textPathDemo"
      class="round-text"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="200"
      viewBox="0 0 200 200"
    >
      <path
        id="text-path1"
        d="M 100 100 m -96 0 a 96 96 0 1 0 192 0 a 96 96 0 1 0 -192 0"
        fill="none"
        stroke="rgba(0,0,0,0)"
        stroke-dasharray="5,2"
        stroke-width="1"
      />
      <text class="circle-text">
        <textPath xlink:href="#text-path1" class="text-content" textLength="360" startOffset="0">
          7eC2421RFsdyXrXk4MhCFHUWHQG8T17YKAS USDC
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          7eC2421RFsdyXrXk4MhCFHUWHQG8T17YKAS USDT
          <!-- <animate attributeName="startOffset" from="0" to="314" begin="0s" dur="10s"
                repeatCount="indefinite" /> -->
        </textPath>
      </text>
    </svg>
    <svg
      id="textPathDemo"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="200"
      viewBox="0 0 200 200"
    >
      <path
        d="M 100 100 m -100 0 a 100 100 0 1 0 200 0 a 100 100 0 1 0 -200 0"
        fill="none"
        stroke="#4BB5FF"
        stroke-dasharray="5,2"
        stroke-width="1"
      />
    </svg>
  </div>
</template>

<style lang="less">
.circle-container {
  width: 400px;
  height: 400px;
  position: relative;
}
.text-content {
  fill: rgba(255, 255, 255, 0.5);
  font-size: 6px;
}

svg {
  /* width: 100%; */
  width: 400px;
  overflow: visible;
  transform-origin: center;
  position: absolute;
  left: 0px;
  top: 0px;
}

.round-text {
  z-index: 10;
  cursor: pointer;
}

.round-text:hover {
  animation: circle 30s infinite linear;
}

section {
  margin: 50px 10px;
}

@keyframes circle {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
