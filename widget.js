(() => {
  const root = document.getElementById("design-assistant-root");
  if (!root) return;

  const productId = root.dataset.productId || "12345";

  root.innerHTML = `
    <h2>🧠 Custom AI Design Assistant</h2>
    <p><strong>Product ID:</strong> ${productId}</p>
    
    <div class="preview">
      <div id="overlay-box" class="overlay-box">
        <p class="placeholder-text">Your generated design will appear here.</p>
      </div>
    </div>

    <div class="controls">
      <label for="category-input"><strong>Item Type</strong></label>
      <input type="text" placeholder="e.g. hoodie, sneaker, cap" id="category-input" />

      <label for="design-prompt"><strong>Design Details</strong></label>
      <input type="text" placeholder="e.g. floral pattern, sakura blossoms, bold colors" id="design-prompt" />
    </div>

    <div class="footer">
      <button id="submit-design">Submit Design</button>
    </div>
  `;

  const overlay = document.getElementById("overlay-box");

  document.getElementById("submit-design").onclick = async () => {
    const item = document.getElementById("category-input").value.trim() || "product";
    const design = document.getElementById("design-prompt").value.trim();

    if (!design) {
      overlay.innerHTML = "⚠️ Please enter a design description.";
      return;
    }

    const fullPrompt = `A full, centered view of a ${item} on a plain white background, designed with: ${design}`;

    overlay.innerHTML = "🎨 Generating design... please wait.";

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
