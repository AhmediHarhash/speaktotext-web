(function () {
  var config = {
    checkout: {
      monthly: "",
      yearly: ""
    },
    billingPortal: "",
    contactEmail: "billing@speaktotext.hekax.com"
  };

  function isUsableUrl(value) {
    return typeof value === "string" && /^https?:\/\//i.test(value);
  }

  function fallbackMessage(type, key) {
    if (type === "checkout") {
      return (
        "Stripe checkout link for " +
        key +
        " is not configured yet. Update assets/js/speaktotext-site.js with the real Stripe URL."
      );
    }

    return "Stripe billing portal URL is not configured yet. Update assets/js/speaktotext-site.js with the real portal link.";
  }

  function bindAction(selector, resolveUrl) {
    var nodes = document.querySelectorAll(selector);
    nodes.forEach(function (node) {
      node.addEventListener("click", function (event) {
        var result = resolveUrl(node);
        if (isUsableUrl(result.url)) {
          node.setAttribute("href", result.url);
          node.setAttribute("target", "_blank");
          node.setAttribute("rel", "noopener");
          return;
        }

        event.preventDefault();
        window.alert(result.message);
      });
    });
  }

  bindAction("[data-checkout-plan]", function (node) {
    var key = String(node.getAttribute("data-checkout-plan") || "").trim().toLowerCase();
    return {
      url: config.checkout[key] || "",
      message: fallbackMessage("checkout", key || "plan")
    };
  });

  bindAction("[data-billing-portal]", function () {
    return {
      url: config.billingPortal || "",
      message: fallbackMessage("portal")
    };
  });

  var emailNodes = document.querySelectorAll("[data-billing-email]");
  emailNodes.forEach(function (node) {
    node.setAttribute("href", "mailto:" + config.contactEmail);
    node.textContent = config.contactEmail;
  });
})();
