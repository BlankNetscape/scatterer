document.getElementById("close-sidebar").addEventListener("click", () => {
  document.getElementById("sidebar").classList.add("hide-sidebar");
  document.getElementById("fab-container").classList.remove("hidden");
});

document.getElementById("show-sidebar").addEventListener("click", () => {
  document.getElementById("sidebar").classList.remove("hide-sidebar");
  document.getElementById("fab-container").classList.add("hidden");
});

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let image = new Image();
document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        image.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

function generateParticles() {
  if (!image.src) return alert("Please select an image first.");

  const particleSize = parseInt(document.getElementById("particleSize").value);
  const particleAmount = parseInt(
    document.getElementById("particleAmountValue").value
  );
  const scatterType = document.getElementById("scatterType").value;

  let seedInput = document.getElementById("seed").value;
  if (!seedInput) {
    seed = Math.floor(Math.random() * 1000000);
    document.getElementById("seed").placeholder = seed;
  } else {
    seed = parseInt(seedInput);
  }
  const bgColor = document.getElementById("bgColor").value;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  function perlinNoise(x, y) {
    function fade(t) {
      return t * t * t * (t * (t * 6 - 15) + 10);
    }
    function lerp(a, b, t) {
      return a + t * (b - a);
    }
    function grad(hash, x, y) {
      const h = hash & 3;
      const u = h < 2 ? x : y;
      const v = h < 2 ? y : x;
      return (h & 1 ? -u : u) + (h & 2 ? -2.0 * v : 2.0 * v);
    }
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = fade(x);
    const v = fade(y);
    const p = new Array(512);
    for (let i = 0; i < 256; i++) p[256 + i] = p[i] = i;
    const aa = p[p[X] + Y];
    const ab = p[p[X] + Y + 1];
    const ba = p[p[X + 1] + Y];
    const bb = p[p[X + 1] + Y + 1];
    return lerp(
      lerp(grad(aa, x, y), grad(ba, x - 1, y), u),
      lerp(grad(ab, x, y - 1), grad(bb, x - 1, y - 1), u),
      v
    );
  }

  for (let i = 0; i < particleAmount; i++) {
    let x, y;
    if (scatterType === "organic") {
      x = (perlinNoise(i * 0.1, seed * 0.1) * 0.5 + 0.5) * canvas.width;
      y = (perlinNoise(i * 0.1, seed * 0.1 + 10) * 0.5 + 0.5) * canvas.height;
      console.log(x, y);
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() * canvas.height;
    }

    const aspectRatio = image.width / image.height;
    const width = particleSize * aspectRatio;
    ctx.drawImage(image, x, y, width, particleSize);
  }
}

function saveImage() {
  const fileInput = document.getElementById("fileInput");
  const fileName =
    fileInput.files.length > 0
      ? fileInput.files[0].name.replace(/\..+$/, "")
      : "image";
  const particleSize = document.getElementById("particleSize").value;
  const particleAmount = document.getElementById("particleAmountValue").value;
  let seedInput = document.getElementById("seed").value;
  if (!seedInput) {
    seed = document.getElementById("seed").placeholder;
  } else {
    seed = seedInput
  }
  const scatterType = document.getElementById("scatterType").value;

  const link = document.createElement("a");
  link.download = `${fileName}-${particleSize}px-${particleAmount}-${scatterType}-seed${seed}.png`;
  link.href = canvas.toDataURL();
  link.click();
}

document
  .getElementById("generate")
  .addEventListener("click", generateParticles);
document
  .getElementById("generate-fab")
  .addEventListener("click", generateParticles);
document.getElementById("save").addEventListener("click", saveImage);
document.getElementById("save-fab").addEventListener("click", saveImage);
