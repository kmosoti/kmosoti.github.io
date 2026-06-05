const copyButtons = document.querySelectorAll("[data-copy-email]");

copyButtons.forEach((button) => {
  const originalText = button.textContent;

  button.addEventListener("click", async () => {
    const email = button.getAttribute("data-copy-email");

    try {
      await navigator.clipboard.writeText(email);
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = originalText;
      }, 1600);
    } catch {
      button.textContent = email;
    }
  });
});
