---
title: Home
client_logos:
  - name: "Suse Rancher"
    logo: "/images/logos/suse.png"
  - name: "RedHat"
    logo: "/images/logos/redhat.png"
testimonials:
  - name: "John Smith"
    title: "CTO at TechStartup"
    avatar: "/images/testimonial-1.svg"
    quote: "We built our SaaS website in record time. The performance is incredible, and our users love the modern, clean design."
  - name: "Sarah Johnson"
    title: "Founder at WebFlow"
    avatar: "/images/testimonial-1.svg"
    quote: "The combination of Hugo and TailwindCSS delivers lightning-fast performance. Our website loads instantly, which has significantly improved our conversion rates."
  - name: "Michael Chen"
    title: "Lead Developer at CloudTech"
    avatar: "/images/testimonial-1.svg"
    quote: "This theme made it easy to create a professional SaaS website. The build times are incredibly fast, and the code is clean and maintainable."
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "HariKube",
  "url": "https://harikube.info",
  "description": "HariKube brings together Kubernetes-native management and Kafka event streaming in a petabyte-scale, versioned state machine. Merge the power of monoliths with the scalability of microservices.",
  "publisher": {
    "@type": "Organization",
    "name": "HariKube",
    "url": "https://harikube.info",
    "logo": {
      "@type": "ImageObject",
      "url": "https://harikube.info/images/harikube-logo.png"
    }
  }
}
</script>

{{< hero 
    headline="Your state is all that matters."
    sub_headline="HariKube brings together Kubernetes-native management and Kafka event streaming in a petabyte-scale, versioned state machine. Merge the power of monoliths with the scalability of microservices.<br>Upgrade your applications and AI workloads to a <b>monolithic state plus Cloud-Native services</b> model <a href=\"/editions/\" style=\"color: #425ad6\">today</a>!<br><br>📈 10-50x more throughput<br>📉 30% less boilerplate<br>♾️ Full Cloud-Native experience"
    primary_button_text="Get Yours"
    primary_button_url="/editions/"
    secondary_button_text="Learn More"
    secondary_button_url="/whitepapers/transforming_kubernetes_from_infrastructure_to_application_platform_v1/"
    hero_image="/images/harikube_introduction.png"
    gradient-from="#dbeafe"
    gradient-to="#f3e8ff"
    gradient-angle="180"
>}}

<div id="modal-video" class="modal">
  <div class="modal-content">
    <iframe id="video-player"
      width="100%" height="100%"
      src="https://www.youtube.com/embed/1ujkJpyypn4?rel=0&enablejsapi=1"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen>
    </iframe>
  </div>
</div>

<link rel="stylesheet" href="/css/video.css" />
<script type="text/javascript" src="/js/video.js"></script>

{{< features-section 
    title="🧭 What Is HariKube"
    description="HariKube is an open-core petabyte-scale, versioned state machine for any kind of data - using Kubernetes as its API and Kafka as its real-time event stream."
>}}

{{< feature
    title="Imagine a Webshop on HariKube"
    description="It acts as a single, central source of truth that tracks every single state change over time (versioning) across your entire system."
    badge="What It Does"
    badgeColor="#fab005"
    image="/images/docs/legacy-model.png"
    buttonText="Learn More"
    buttonLink="/features/developer-experience/"
    features="An order isn't scattered across five isolated databases.,It exists as a single versioned state object.,When a customer purchases an item updates the state.,Your CNCF-compliant service processes the transition (Created > Paid > Shipped), HariKube tracks the entire history and streams the updates in real time."
    imagePosition="right"
>}}

{{< feature
    title="The Big Picture"
    description="Standard Kubernetes breaks when forced to handle massive business state because consensus and memory have hard ceilings. HariKube replaces etcd with heavy-duty database engines, turning Kubernetes into a massive, resilient and scalable state platform."
    badge="Why It Matters"
    badgeColor="#7d51ff"
    image="/images/docs/harikube-model.png"
    buttonText="Learn More"
    buttonLink="/features/performance/"
    features="You manage drastically fewer clusters because HariKube handles your scale in well-known databases.,It solves the trade-off between monoliths and microservices; Monolith simplicity or Microservice power.,By unifying your system into a single state engine; HariKube letting you ship new features in days instead of months."
    imagePosition="left"
>}}

{{< /features-section >}}

<div style="text-align: center">
{{< client-logos animate="false" title="✅ Fully Kubernetes conformance compatible, and certified at our partners" >}}
</div>

{{< details buttonColor="#425ad6" textColor="text-white" arrowColor="text-white" >}}
{
    "details": [
        {
            "title": "🏁 You are welcome to beat our numbers!",
            "file": "details/kubernetes-performance-challenge"
        }
    ]
}
{{< /details >}}

{{< benchmark 
    title="We Put Everything on a Single Machine"
    description="Vanilla Kubernetes VS. HariKube 6xPostgreSQL"
>}}

{{< details buttonColor="#425ad6" textColor="text-white" arrowColor="text-white" >}}
{
    "details": [
        {
            "title": "👩‍🔬 I'm interested in the architecture",
            "file": "details/arhitecture"
        },
        {
            "title": "👨‍💼 I'm interested in the business benefits",
            "file": "details/business_values"
        }
    ]
}
{{< /details >}}

{{< features-section 
    title="🪄 Achieve Both: Performance and Rapid Development"
    description="HariKube is not a choice between a faster developer experience and technical performance - it delivers comprehensive benefits by addressing core limitations of standard Kubernetes."
>}}
{{< /features-section >}}

<!---
{{< testimonials 
    title="Trusted by Modern Web Teams"
    description="See how teams are building better websites with our theme."
    animate="true"
    background-color="#f1f5f9"
>}}
--->

{{< cta >}}
