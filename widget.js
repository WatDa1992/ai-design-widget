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
      <input type="text" placeholder="Theme (e.g. urban, floral, retro)..." id="theme-input" />
      <input type="text" placeholder="Pattern (optional)" id="pattern-input" />
      <input type="text" placeholder="Primary content (e.g. dragon, koi fish)..." id="content-input" />
      <input type="color" id="color-picker" value="#ff0000" />
      <select id="view-picker">
        <option value="front">Front View</option>
        <option value="back">Back View</option>
        <option value="side">Side View</option>
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

  document.getElementById("submit-design").onclick = async () => {
    const theme = document.getElementById("theme-input").value;
    const pattern = document.getElementById("pattern-input").value;
    const content = document.getElementById("content-input").value;
    const color = document.getElementById("color-picker").value;
    const view = document.getElementById("view-picker").value;

    const prompt = `${theme} theme, ${pattern ? pattern + ',' : ''} featuring ${content}. Use color: ${color}. View: ${view}.`;

    overlay.innerHTML = "🎨 Generating design...";

    try {
      const res = await fetch("https://replicate-ai-backend.vercel.app/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
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
