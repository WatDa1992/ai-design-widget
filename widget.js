// widget.js (full version with Step 2: Apply Pattern to Product Mockup)
(() => {
  const root = document.getElementById("design-assistant-root");
  if (!root) return;

  root.innerHTML = `
    <h2>🧠 Custom AI Design Assistant</h2>
    <div class="controls">
      <input type="text" id="design-prompt" placeholder="Describe your pattern (e.g. flames, peonies, waves)..." />
      <select id="product-type">
        <option value="hoodie">Hoodie</option>
        <option value="shoe">Shoe</option>
        <option value="cap">Cap</option>
      </select>
      <button id="submit-pattern">Generate Pattern</button>
    </div>
    <div class="preview">
      <canvas id="design-canvas" width="512" height="512"></canvas>
      <p id="status-text"></p>
    </div>
  `;

  const canvas = document.getElementById("design-canvas");
  const ctx = canvas.getContext("2d");
  const statusText = document.getElementById("status-text");

  document.getElementById("submit-pattern").onclick = async () => {
    const prompt = document.getElementById("design-prompt").value;
    const productType = document.getElementById("product-type").value;

    if (!prompt) {
      alert("Please enter a design prompt.");
      return;
    }

    statusText.textContent = "🎨 Generating design...";

    try {
      const res = await fetch("https://replicate-ai-backend.vercel.app/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();
      const patternUrl = data?.output?.[0] || data?.image;

      if (!patternUrl) {
        statusText.textContent = "⚠️ No image returned.";
        return;
      }

      // Load pattern and product template images
      const [patternImg, productImg] = await Promise.all([
        loadImage(patternUrl),
        loadImage(`/mockups/${productType}.png`)
      ]);

      // Draw product + overlay pattern
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(productImg, 0, 0, canvas.width, canvas.height);

      ctx.globalAlpha = 0.6;
      ctx.drawImage(patternImg, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      statusText.textContent = "✅ Design applied to product.";

    } catch (err) {
      console.error(err);
      statusText.textContent = "❌ Failed to generate design.";
    }
  };

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }
})();
