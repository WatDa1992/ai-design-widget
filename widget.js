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
      <input type="text" placeholder="Describe your design (themes, patterns, colors, etc.)" id="design-prompt" />
      <select id="view-picker">
        <option value="">Choose View</option>
        <option value="front">Front</option>
        <option value="back">Back</option>
        <option value="side">Side</option>
      </select>
    </div>
    <div class="footer">
      <button id="submit-design">Submit Design</button>
    </div>
  `;

  const overlay = document.getElementById("overlay-box");

  document.getElementById("submit-design").onclick = async () => {
    const prompt = document.getElementById("design-prompt").value;
    const view = document.getElementById("view-picker").value;
    const fullPrompt = `A studio photo of a plain white ${category} in ${view} view. Apply this design onto the ${category}: ${prompt}. The design should be clearly printed directly onto the ${category}. Plain white background. No text, no extra objects.`;

    overlay.innerHTML = `<div class="loader"></div><p>Generating design...</p>`;

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
