// widget.js — Clean UI for generating standalone art/patterns
(() => {
  const root = document.getElementById("design-assistant-root");
  if (!root) return;

  root.innerHTML = `
    <h2>🎨 Custom AI Design Assistant</h2>
    <p>Describe your design idea — we’ll generate a high-quality motif or pattern.</p>

    <div class="controls">
      <input type="text" placeholder="e.g. Floral dragons in Irezumi tattoo style" id="design-prompt" />
      <button id="submit-design">Generate Pattern</button>
    </div>

    <div id="overlay-box" class="overlay-box">Your design will appear here.</div>
  `;

  const overlay = document.getElementById("overlay-box");

  document.getElementById("submit-design").onclick = async () => {
    const prompt = document.getElementById("design-prompt").value.trim();
    if (!prompt) {
      overlay.innerHTML = "⚠️ Please enter a design prompt.";
      return;
    }

    overlay.innerHTML = "⏳ Generating pattern...";

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
