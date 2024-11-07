const cursor = document.createElement("div");
cursor.className = "cursor-overlay";
cursor.style.position = "fixed";
cursor.style.borderRadius = "50%";
document.body.appendChild(cursor);

window.addEventListener("mousemove", (e) => {
  cursor.style.top = e.clientY - 15 + "px";
  cursor.style.left = e.clientX - 15 + "px";
});
