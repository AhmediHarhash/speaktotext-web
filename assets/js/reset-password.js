(function () {
  const API_BASE = "https://speaktotextapi.hekax.com";
  const form = document.getElementById("reset-password-form");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const submitButton = document.getElementById("reset-submit-button");
  const statusNode = document.getElementById("reset-status");

  if (!form || !passwordInput || !confirmPasswordInput || !submitButton || !statusNode) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const token = String(params.get("token") || "").trim();
  let completed = false;

  function setStatus(kind, text) {
    statusNode.className = `reset-status ${kind}`;
    statusNode.textContent = text;
  }

  function setFormEnabled(enabled) {
    passwordInput.disabled = !enabled;
    confirmPasswordInput.disabled = !enabled;
    submitButton.disabled = !enabled || completed;
  }

  if (!token) {
    setStatus("error", "This reset link is missing its token.");
    setFormEnabled(false);
    return;
  }

  setStatus("info", "Enter a new password to finish the reset.");
  setFormEnabled(true);

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (completed) {
      return;
    }

    const password = String(passwordInput.value || "");
    const confirmPassword = String(confirmPasswordInput.value || "");

    if (password.length < 6) {
      setStatus("error", "Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error", "Passwords do not match.");
      return;
    }

    setFormEnabled(false);
    setStatus("info", "Updating your password...");
    submitButton.textContent = "Updating...";

    try {
      const response = await fetch(`${API_BASE}/auth/password-reset/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const payload = await response.json().catch(function () {
        return null;
      });

      if (!response.ok) {
        throw new Error(String(payload && payload.message ? payload.message : "Could not reset the password."));
      }

      completed = true;
      setStatus("success", String(payload && payload.message ? payload.message : "Password updated successfully."));
      passwordInput.value = "";
      confirmPasswordInput.value = "";
      submitButton.textContent = "Password updated";
      setFormEnabled(false);
    } catch (error) {
      setStatus("error", error instanceof Error ? error.message : "Could not reset the password.");
      submitButton.textContent = "Update password";
      setFormEnabled(true);
    }
  });
})();
