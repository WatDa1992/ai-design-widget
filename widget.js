(() => {
  const root = document.getElementById("design-assistant-root");
  if (!root) return;

  const productId = root.dataset.productId;
  const category = root.dataset.category;
  const imageUrl = root.dataset.productImage;

  root.innerHTML = `
    <h2>🎨 Design Assistant for ${category}</h2>
    <p><strong>Product ID:</strong> ${productId}</p>
    <div class="preview">
      <img src="${imageUrl}" alt="Product Preview" id="product-preview" />
      <div id="overlay-box" class="overlay-box"></div>
    </div>
    <div class="controls">
      <input type="text" placeholder="Describe your design idea..." id="design-prompt" />
      <input type="color" id="color-picker" value="#ff0000" />
      <select id="pattern-picker">
        <option value="">Choose Pattern</option>
        <option value="stripes">Stripes</option>
        <option value="dots">Dots</option>
        <option value="grid">Grid</option>
      </select>
    </div>
    <div class="footer">
      <button id="submit-design">Submit Design</button>
    </div>
  `;

  const overlay = document.getElementById("overlay-box");

  document.getElementById("color-picker").oninput = (e) => {
    overlay.style.backgroundColor = e.target.value;
  };

  document.getElementById("pattern-picker").onchange = (e) => {
    const val = e.target.value;
    const patterns = {
      stripes: "repeating-linear-gradient(45deg, rgba(255,255,255,0.4), rgba(255,255,255,0.4) 10px, transparent 10px, transparent 20px)",
      dots: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
      grid: "repeating-linear-gradient(#ffffff80 0 1px, transparent 1px 20px), repeating-linear-gradient(90deg, #ffffff80 0 1px, transparent 1px 20px)"
    };
    overlay.style.backgroundImage = patterns[val] || "";
  };

document.getElementById("submit-design").onclick = async () => {
  const prompt = document.getElementById("design-prompt").value;
  const color = document.getElementById("color-picker").value;
  const pattern = document.getElementById("pattern-picker").value;
  const fullPrompt = `${prompt}. Use color: ${color}, with pattern: ${pattern}`;

  const overlay = document.getElementById("overlay-box");
  overlay.innerHTML = "🎨 Generating design...";

  try {
    const res = await fetch("https://replicate-ai-backend.vercel.app/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: fullPrompt })
    });

    const data = await res.json();
    const imageUrl = data?.output?.[0] || data?.image;

    if (imageUrl) {
      overlay.innerHTML = `<img src="${imageUrl}" alt="Generated Design" style="max-width: 100%; border-radius: 8px;" />`;
    } else {
      overlay.innerHTML = "⚠️ No image returned.";
    }
  } catch (err) {
    console.error(err);
    overlay.innerHTML = "❌ Failed to generate design.";
  }
};

})();
