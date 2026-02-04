---
title: Home
client_logos:
  - name: "Customer 1"
    logo: "/images/logos/customer-1.png"
  - name: "Customer 2"
    logo: "/images/logos/customer-2.png"
  - name: "Customer 3"
    logo: "/images/logos/customer-3.png"
  - name: "Customer 4"
    logo: "/images/logos/customer-4.png"
  - name: "Customer 5"
    logo: "/images/logos/customer-5.png"
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
  "description": "With HariKube, it becomes your platform-as-a-service - scalable, fast, and vendor-agnostic - so you can build, deploy, and grow without worrying about database limits or infrastructure complexity.",
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
    headline="When Kubernetes taps out, business slows down!"
    sub_headline="HariKube keeps it moving. HariKube elevates Kubernetes into a Cloud-Native Platform-as-a-Service with dynamic multi-database routing - by removing ETCD bottlenecks - enabling 10-50× more operations per second even under peak load, and allows your services to become first-class citizens in Kubernetes instead of running their own infrastructure on top of it."
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
    <video
        id="hero-video"
        controls
        disablePictureInPicture
        preload="metadata"
        poster="/images/harikube_introduction.png"
        data-setup='{}'>
        <source src="/videos/harikube_introduction.mp4" type="video/mp4" />
    </video>
  </div>
</div>

<link rel="stylesheet" href="/css/video.css" />
<script type="text/javascript" src="/js/video.js"></script>

<!---
{{< client-logos animate="true" >}}
--->

{{< details buttonColor="#425ad6" textColor="text-white" arrowColor="text-white" >}}
{
    "details": [
        {
            "title": "🐌 Is Infrastructure Code Slowing and Fragmenting Your Development?",
            "file": "details/devexp"
        },
        {
            "title": "📉 Is ETCD Limiting Your Kubernetes Scaling?",
            "file": "details/scalingexp"
        }
    ]
}
{{< /details >}}

{{< features-section 
    title="🪄 Achieve Both: Performance and Rapid Development"
    description="HariKube is not a choice between a faster developer experience and technical performance - it delivers comprehensive benefits by addressing both core limitations of standard Kubernetes."
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
