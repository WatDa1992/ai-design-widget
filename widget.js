(() => {
  const root = document.getElementById("design-assistant-root");
  if (!root) return;

  const productId = root.dataset.productId;
  const imageUrl = root.dataset.productImage;

  root.innerHTML = `
    <h2>🧠 Custom AI Design Assistant</h2>
    <p><strong>Product ID:</strong> ${productId}</p>

    <div class="preview">
      <img src="${imageUrl}" alt="Product Preview" id="product-preview" />
      <div id="overlay-box" class="overlay-box"></div>
    </div>

    <div class="controls">
      <input type="text" id="category-input" placeholder="What product? (e.g. sneaker, hoodie)" />
      <input type="text" id="design-prompt" placeholder="What should the design look like?" />
      <select id="view-selector">
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
    const design = document.getElementById("design-prompt").value.trim();
    const category = document.getElementById("category-input").value.trim();
    const view = document.getElementById("view-selector").value;

    const fullPrompt = `Design a ${category} with ${design}. ${view} view. Show the full ${category}, clearly centered and fully visible in frame. Studio photo, plain white background. No other objects.`;

    overlay.innerHTML = "🎨 Generating design...";

    try {
      const res = await fetch("https://replicate-ai-backend.vercel.app/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
