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
  "description": "HariKube is a tool that transforms Kubernetes into a full-fledged Platform-as-a-Service (PaaS), making it simple to build and manage microservices using Cloud-Native methods.",
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
    headline="Turning Kubernetes into a platform for growth"
    sub_headline="HariKube is a tool that transforms Kubernetes into a full-fledged Platform-as-a-Service (PaaS), making it simple to build and manage microservices using Cloud-Native methods."
    primary_button_text="Get Started"
    primary_button_url="/get-started/"
    secondary_button_text="Try Open Beta"
    secondary_button_url="/beta-invitation/"
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

<style type="text/css">
  section:first-of-type img {
    cursor: pointer;
  }

  .modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    justify-content: center;
    align-items: center;
    background-color: rgba(0,0,0,0.4);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
  }

  .modal-content {
    aspect-ratio: 16 / 9;
    background-color: rgba(0,0,0,0.4);
    margin: 5% auto;
    padding: 10px;
    max-width: 80vw;
    max-height: 70vh;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    position: relative;
    animation: fadeIn 0.3s ease-out;
  }

  #hero-video {
    width: 100%;
    height: 100%;
    max-width: 1920px;
    max-height: 1080px;
  }
</style>
<script type="text/javascript">
  modalVideo = document.querySelector('#modal-video');
  heroVideo = document.querySelector('#hero-video');

  document.querySelector('section:first-of-type img').addEventListener("click", (event) => {
    modalVideo.style.display = "block";
    heroVideo.play();
  });

  modalVideo.addEventListener("click", (event) => {
    heroVideo.pause();
    modalVideo.style.display = "none";
  });

  heroVideo.addEventListener('ended', () => {
    modalVideo.style.display = "none";
  });
</script>

<!---
{{< client-logos animate="true" >}}
--->

{{< features-section 
    title="HariKube redefines the way we think about Kubernetes"
    description="Kubernetes relies on ETCD for all data storage, which limits scalability, flexibility, and performance for complex or high-volume workloads—HariKube solves this by offloading data to multiple databases which are optimized for handling large-scale, high-throughput data workloads, transforming Kubernetes into a scalable, extensible, and developer-friendly PaaS."
>}}

{{< feature
    title="High-Performance Data Management"
    description="HariKube delivers exceptional performance through data distribution and optimized database routing. By offloading resource-intensive workloads from ETCD, it ensures consistent responsiveness and operational efficiency at scale."
    badge="Performance"
    badgeColor="#2563eb"
    image="/images/performance.png"
    buttonText="Learn More"
    buttonLink="/features/performance/"
    features="Low-latency data access,Optimized for high-throughput,Supports workload-aware data placement,Reduces ETCD contention and overhead"
    imagePosition="right"
>}}

{{< feature
    title="Flexible Kubernetes-Native Stack"
    description="Designed to integrate deeply with Kubernetes while staying loosely coupled, HariKube empowers you to build and extend infrastructure on your terms."
    badge="Infrastructure Flexibility"
    badgeColor="#7c3aed"
    image="/images/architecture.png"
    buttonText="Learn More"
    buttonLink="/features/flexible-stack/"
    features="Pluggable database backends,Dynamic data topologies,Transparent Kubernetes-native integration,Decoupled resource management"
    imagePosition="left"
>}}

{{< feature
    title="Fine-Grained Data Isolation for Security and Compliance"
    description="HariKube enables strict data separation across namespaces, resource types, or services—helping organizations meet security and compliance requirements without sacrificing scalability or performance."
    badge="Security & Compliance"
    badgeColor="#0f766e"
    image="/images/data-isolation.png"
    buttonText="Learn More"
    buttonLink="/features/data-isolation/"
    features="Per-namespace database isolation,Dedicated databases per resource type,Strong workload boundaries,Reduces Security Scope and Maintenance Overhead"
    imagePosition="right"
>}}

{{< feature
    title="Streamlined Cloud-Native Development"
    description="HariKube simplifies the developer workflow by abstracting infrastructure complexity. Focus purely on data structures and business logic while the platform handles data routing and storage."
    badge="Development"
    badgeColor="#f59e0b"
    image="/images/developer-experience.png"
    buttonText="Learn More"
    buttonLink="/features/developer-experience/"
    features="No local infrastructure setup required,Native support for built-in Kubernetes features,Consistent behavior from development to production,Fully documented APIs and integration guides"
    imagePosition="left"
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
