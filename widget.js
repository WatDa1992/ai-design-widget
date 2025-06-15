(() => {
  const root = document.getElementById("design-assistant-root");
  if (!root) return;

  const productId = root.dataset.productId;
  const category = root.dataset.category;
  const imageUrl = root.dataset.productImage;

  // Define smart prompt templates per product category
  const promptTemplateMap = {
    "converse-shoes": "A custom illustration printed on a pair of Converse-style canvas sneakers. Design: {prompt}. Use color: {color}. Add a {pattern} pattern.",
    "baseball-cap": "A personalized baseball cap design. Embroider or print the following: {prompt}, using color: {color}, with a {pattern} pattern.",
    "tshirt": "A custom t-shirt featuring: {prompt}. Main color: {color}. Pattern overlay: {pattern}.",
    "surfboard": "A surfboard with custom painted artwork: {prompt}. Accent color: {color}, and pattern: {pattern}.",
    "default": "A product customized with: {prompt}. Use color: {color}, with {pattern} style."
  };

  // Inject UI into DOM
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

  // Color input listener
  document.getElementById("color-picker").oninput = (e) => {
    overlay.style.backgroundColor = e.target.value;
  };

  // Pattern selector listener
  document.getElementById("pattern-picker").onchange = (e) => {
    const val = e.target.value;
    const patterns = {
      stripes: "repeating-linear-gradient(45deg, rgba(255,255,255,0.4), rgba(255,255,255,0.4) 10px, transparent 10px, transparent 20px)",
      dots: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
      grid: "repeating-linear-gradient(#ffffff80 0 1px, transparent 1px 20px), repeating-linear-gradient(90deg, #ffffff80 0 1px, transparent 1px 20px)"
    };
    overlay.style.backgroundImage = patterns[val] || "";
  };

  // Submit button logic
  document.getElementById("submit-design").onclick = async () => {
    const prompt = document.getElementById("design-prompt").value.trim();
    const color = document.getElementById("color-picker").value;
    const pattern = document.getElementById("pattern-picker").value || "no pattern";

    if (!prompt) {
      overlay.innerHTML = "⚠️ Please enter a design description.";
      return;
    }

    // Use template based on category
    const template = promptTemplateMap[category] || promptTemplateMap["default"];
    const fullPrompt = template
      .replace("{prompt}", prompt)
      .replace("{color}", color)
      .replace("{pattern}", pattern);

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
