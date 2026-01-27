---
title: "Contact Us"
layout: "simple"
description: "Schedule a Technical Discovery Session."
---

{{< columns >}}

## 🔎 Schedule a Technical Discovery Session

Before making a purchase, we invite you to book a call with our CTO for a conversation **to determine the best solution for your needs**. This is not a sales pitch, it’s a chance to walk through your use case, challenges, and expectations, and to figure out together what you actually need. You’ll get direct insight into how HariKube fits into your architecture, what configuration makes sense, and what to plan for next, so you can move forward with confidence and clarity. **We’ll get back to you within 24 hours to schedule the call.**

|||

<div id="sign-up-form">
<style>
  .hk-form {
    max-width: 420px;
    margin: 2rem auto;
    padding: 2rem;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    font-family: system-ui, sans-serif;
  }
  .hk-form label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.4rem;
    color: #1e293b;
  }
  .hk-form input[type="text"],
  .hk-form input[type="email"],
  .hk-form textarea {
    width: 100%;
    padding: 0.6rem 0.8rem;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  .hk-form textarea { min-height: 120px; resize: vertical; }
  .hk-form input[type="checkbox"] { margin-right: 0.5rem; }
  .hk-form .consent { font-size: 0.9rem; color: #475569; margin-bottom: 0.8rem; }
  .hk-form a { color: #425AD6; text-decoration: underline; }
  .hk-form .btn-wrap { text-align: center; margin-top: 1.2rem; }
  .hk-form input[type="submit"] {
    background: #425AD6; color: #fff; border: none;
    padding: 0.8rem 1.8rem; font-size: 1rem; font-weight: 600;
    border-radius: 9999px; cursor: pointer; display: inline-block;
    transition: background 0.2s ease-in-out, transform 0.1s ease-in-out;
  }
  .hk-form input[type="submit"]:hover { background: #3341a3; transform: translateY(-2px); }
</style>

<form class="hk-form" action="https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8" method="POST" accept-charset="UTF-8">
  <!-- Org & redirect -->
  <input type="hidden" name="oid" value="00Dd10000091AMj">
  <input type="hidden" name="retURL" value="https://harikube.info/contact-us/#thanks">

  <!-- Required fields -->
  <label for="first_name">First Name *</label>
  <input id="first_name" name="first_name" type="text" required>

  <label for="last_name">Last Name *</label>
  <input id="last_name" name="last_name" type="text" required>

  <label for="email">Email *</label>
  <input id="email" name="email" type="email" required>

  <!-- Optional company -->
  <label for="company">Company</label>
  <input id="company" name="company" type="text">

  <!-- Optional free text -> maps to Lead Description -->
  <label for="description">Anything to share? Don’t be shy</label>
  <textarea id="description" name="description" placeholder="Write your message…"></textarea>

  <!-- Mandatory T&C consent -->
  <div class="consent">
    <label>
      <input type="checkbox" name="00Nd1000006am97" value="true" required>
      I accept the <a href="/terms-conditions/" target="_blank" rel="noopener">Terms &amp; Conditions</a>
    </label>
  </div>

  <!-- Single marketing preference -->
  <!--div class="consent">
    <label>
      <input type="checkbox" name="00Nd1000006amIn" value="true">
      Keep me in the loop about new features and updates.
    </label>
  </div-->

  <!-- Submit -->
  <div class="btn-wrap">
    <input type="submit" value="Contact Us">
  </div>
</form>
</div>

<a id="thanks"></a>
<div id="sign-up-thanks" style="display: none;">
<pre>✅ Discussion Request Received</pre>
<strong>✨ We have successfully received your personal details. Our team is currently reviewing your configuration to ensure a seamless setup.</strong>
</div>

<style type="text/css">
#sign-up-thanks pre {
    background-color: green;
    text-align: center;
    font-size: 24px;
}
</style>

<script type="text/javascript">
  if (window.location.hash == "#thanks") {
    document.getElementById("sign-up-form").style.display = "none";
    document.getElementById("sign-up-thanks").style.display = "";
  } else if (window.location.hash != "") {
    order = atob(window.location.hash.replace("#", ""));
    document.getElementById("description").innerHTML = "\n---\n" + order;
  }
</script>

{{< /columns >}}