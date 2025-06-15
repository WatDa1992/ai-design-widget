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
      <input type="text" placeholder="Design details (themes, patterns, colors...)" id="design-input" />
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

  document.getElementById("submit-design").onclick = async () => {
    const design = document.getElementById("design-input").value;
    const view = document.getElementById("view-picker").value;
    const fullPrompt = `Generate a ${view} view design for a ${category}. Design notes: ${design}`;

    overlay.innerHTML = "🎨 Generating design...";

    try {
      const res = await fetch("https://replicate-ai-backend.vercel.app/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt })
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Backend error:", text);
        overlay.innerHTML = `❌ Failed to generate. ${text}`;
        return;
      }

      const data = await res.json();
      const imageUrl = data?.output?.[0] || data?.image;

      if (imageUrl) {
        overlay.innerHTML = `<img src="${imageUrl}" alt="Generated Design" style="max-width: 100%; border-radius: 8px;" />`;
      } else {
        overlay.innerHTML = "⚠️ No image returned.";
      }
    } catch (err) {
      console.error("❌ Network or JSON error:", err);
      overlay.innerHTML = "❌ Network error or timeout.";
    }
  };
})();
