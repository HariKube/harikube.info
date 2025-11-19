---
title: ""
layout: "simple"
description: ""
---

# 🚀 Shape Our Future: Join the Open Beta!

{{< columns >}}

**Scale your Kubernetes workloads with precision. Distribute your data like a pro.**

We’re excited to invite you to participate in the **Open Beta of HariKube** - a groundbreaking Kubernetes middleware that brings powerful database routing and dynamic data topologies into your cluster, and turns your Kubernetes into a real Platform-as-a-Service for microservices.

HariKube enables you to separate storage logic from application code, so you can scale, isolate, or route data across multiple databases - all while keeping full compatibility with Kubernetes-native APIs like CRDs, RBAC, and webhooks. Whether you're running a multi-tenant SaaS, orchestrating microservices with strict data boundaries, or optimizing database-heavy analytics workloads, HariKube helps you:

**Simplifies service development** by letting developer teams to focus purely on business logig.

**Decouple infrastructure from business logic** using declarative database policies per service, namespace, or resource.

**Offload ETCD pressure** by moving business data out of Kubernetes’ core state store into multiple databases.

**Introduce low-latency and high-throughput data store** using Cloud-native design patterns.

**Compose flat or hierarchical data topologies** tailored to your service mesh, tenancy model, or data access patterns.

The beta includes access to HariKube’s core components, dynamic database routing system and a customized Kubernetes version to achieve support of huge datasets (optional). By default, it integrates seamlessly with Kubernetes and turns it into a real PaaS. Setup is minimal - you can get started with just a YAML file and a running database.

Participation is **free during 6-month trial**, and governed by our EULA. You’ll be among the first to shape a new standard in Kubernetes-native database management - and your feedback will help optimize performance, usability, and production-readiness for GA.

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
  .hk-form input[type="tel"] {
    width: 100%;
    padding: 0.6rem 0.8rem;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  .hk-form input[type="checkbox"] {
    margin-right: 0.5rem;
  }
  .hk-form .consent {
    font-size: 0.9rem;
    margin-bottom: 0.8rem;
    color: #475569;
  }
  .hk-form a {
    color: #425AD6;
    text-decoration: underline;
  }
  .hk-form .btn-wrap {
    text-align: center;
    margin-top: 1.2rem;
  }
  .hk-form input[type="submit"] {
    background: #425AD6;
    color: #fff;
    border: none;
    padding: 0.8rem 1.8rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 9999px; /* pill shape */
    cursor: pointer;
    display: inline-block;
    transition: background 0.2s ease-in-out, transform 0.1s ease-in-out;
  }
  .hk-form input[type="submit"]:hover {
    background: #3341a3;
    transform: translateY(-2px);
  }
</style>

<form class="hk-form" action="https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8" method="POST" accept-charset="UTF-8">
  <!-- Org & redirect -->
  <input type="hidden" name="oid" value="00Dd10000091AMj">
  <input type="hidden" name="retURL" value="https://harikube.info/beta-invitation/#thanks">

  <!-- Standard fields -->
  <label for="first_name">First Name *</label>
  <input id="first_name" name="first_name" type="text" required>

  <label for="last_name">Last Name *</label>
  <input id="last_name" name="last_name" type="text" required>

  <label for="email">Email *</label>
  <input id="email" name="email" type="email" required>

  <label for="company">Company *</label>
  <input id="company" name="company" type="text" required>

  <label for="phone">Phone (optional)</label>
  <input id="phone" name="phone" type="tel">

  <!-- Required consents -->
  <div class="consent">
    <label>
      <input type="checkbox" name="00Nd1000006aept" value="true" required>
      I accept the <a href="/eula/" target="_blank" rel/="noopener">EULA</a>
    </label>
  </div>
  <div class="consent">
    <label>
      <input type="checkbox" name="00Nd1000006af7d" value="true" required>
      I accept the <a href="/sla/" target="_blank" rel="noopener">SLA</a>
    </label>
  </div>

  <!-- Beta tag -->
  <input type="hidden" name="00Nd1000006af1B" value="true">

  <!-- Submit -->
  <div class="btn-wrap">
    <input type="submit" value="Join the Beta">
  </div>
</form>
</div>

<div id="sign-up-thanks" style="display: none;">
    <pre>You have been added to the HariKube Open Beta.</pre>
    <h3>🙏 Thanks for joining us on this journey!</h3>
    <strong>We will notify you via email as soon as your access is ready. Thank you for your patience!</strong>
</div>

<style type="text/css">
#sign-up-thanks pre {
    background-color: green;
    text-align: center;
    font-size: 18px;
}
</style>

<script type="text/javascript">
if (window.location.hash == "#thanks") {
    document.getElementById("sign-up-form").style.display = "none";
    document.getElementById("sign-up-thanks").style.display = "";
}
</script>

{{< /columns >}}

# 🔍 Why Join the HariKube Beta?

**Modern Kubernetes environments often struggle** when:

- ETCD becomes a bottleneck under the weight of growing stateful resources.
- Multi-tenant applications need strict data isolation and dynamic routing logic.
- Developers are forced to deliver storage assumptions within application logic.
- Infrastructure evolution is blocked by monolithic CRDs or rigid topology design.

**HariKube solves these problems** by introducing:

✅ A Kubernetes-native Data Routing Layer
Route workloads to dedicated or shared databases based on declarative topology configs - with native support for per-namespace, per-resource, or tree-structured hierarchies.

✅ Pluggable Backends with zero downtime
Choose the best storage for each use case: SQLite for lightweight services or MySQL/PostgreSQL for production-grade performance.

✅ ETCD Offload with Full API Compatibility
Your existing Kubernetes tooling keeps working - but the data doesn’t live in ETCD anymore. Think: safer upgrades, less compaction pressure, and no schema hacks.

# 📝 Share your experiences!

We're so excited to have you as part of our open beta! Your feedback is crucial in helping us build the best possible product.

📈 To help us improve, we ask that you **enable telemetry** in your settings. This allows us to gather anonymous data on how the app is being used, which helps us identify and fix bugs faster.

🎫 As you use the app, we want to hear from you. If you encounter any bugs or technical issues, please email our support team at support@inspirnation.eu to open a ticket.

⭐ If you have a positive experience, we'd love to hear about it! Please share any success stories or general feedback with us at support@inspirnation.eu. Your insights will help us understand what's working well and what we should focus on as we prepare for our full launch.

# 📬 What Happens Next

Submit your request through the contact form up there, and our team will get back to you with relevant resources, technical insights, or options for scheduling a discovery call.