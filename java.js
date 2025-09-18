// ======= java.js =======
document.addEventListener("DOMContentLoaded", () => {
  const url = location.href;
  const title = document.title || "Chia sẻ bài viết";

  // tạo hộp chứa nút chia sẻ (floating, không đụng vào CSS cũ)
  const box = document.createElement("div");
  box.id = "share-box";
  box.style.cssText = `
    position: fixed; right: 16px; bottom: 16px; z-index: 2000;
    display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
  `;

  // hàm tiện ích tạo nút
  const makeBtn = (label, bg, onClick) => {
    const b = document.createElement("button");
    b.textContent = label;
    b.style.cssText = `
      padding: 10px 14px; border: 0; border-radius: 999px;
      font-family: system-ui, sans-serif; font-weight: 700;
      cursor: pointer; box-shadow: 0 6px 14px rgba(0,0,0,.15);
      background:${bg}; color:#fff; transition: transform .08s ease;
    `;
    b.onmouseenter = () => (b.style.transform = "translateY(-1px)");
    b.onmouseleave = () => (b.style.transform = "translateY(0)");
    b.onclick = onClick;
    return b;
  };

  // 1) nút dùng Web Share API (nếu có)
  if (navigator.share) {
    box.appendChild(
      makeBtn("Chia sẻ", "#111827", async () => {
        try {
          await navigator.share({ title, text: title, url });
        } catch (_) { /* người dùng hủy */ }
      })
    );
  }

  // 2) nút Facebook
  box.appendChild(
    makeBtn("Facebook", "#1877f2", () => {
      const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
      window.open(fb, "_blank", "noopener,noreferrer,width=600,height=500");
    })
  );

  // 3) nút Copy link
  box.appendChild(
    makeBtn("Copy link", "#6b7280", async function () {
      try {
        await navigator.clipboard.writeText(url);
        const old = this.textContent;
        this.textContent = "Đã copy ✔";
        setTimeout(() => (this.textContent = old), 1500);
      } catch {
        // fallback (trường hợp clipboard bị chặn)
        prompt("Sao chép thủ công liên kết:", url);
      }
    })
  );

  document.body.appendChild(box);
});
//:12 dong cach