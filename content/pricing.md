---
title: "Pricing"
description: "Choose the perfect plan for your needs"
layout: "pricing"
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "HariKube",
  "url": "https://harikube.info/pricing",
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

{{< pricing-table-2 >}}
{
    "title": "Pricing and packaging for any use case",
    "description": "Because every company needs to innovate to win. And the Kubernetes platform is your base of innovation.",
    "plans": [
        {
            "name": "Open-Source Edition",
            "price": "0",
            "description": "Perfect for standalone projects and environments where one database is sufficient.",
            "features": [
                "Database number: 1",
                "Community support: No limits",
                "Support coverage: Self-service",
                "Support channels: Community Forum"
            ],
            "button": {
                "text": "Download",
                "url": "https://github.com/HariKube/kine/releases/tag/release-v0.14.6"
            }
        },
        {
            "name": "Community Edition",
            "price": "0",
            "description": "The perfect starting point for personal projects and prototypes.",
            "features": [
                "Manual database configuration",
                "Database number: 10",
                "Community support: No limits",
                "Support coverage: Self-service",
                "Support channels: Community Forum"
            ],
            "button": {
                "text": "Coming Soon / Join Beta",
                "url": "/beta-invitation/"
            }
        },
        {
            "name": "Business Edition",
            "price": "14900",
            "description": "Ideal for startups and small businesses looking to get up and running quickly.",
            "freetier": true,
            "featured": true,
            "features": [
                "Automatic database configuration",
                "Database number: 20",
                "Maintenance updates: 12 months",
                "Premium support: 12 months",
                "Support coverage: 8x5",
                "Support channels: Community Forum, Email"
            ],
            "addons": {
                "Database number: 20": [
                    { "text": "Database number: 20", "price": 0 },
                    { "text": "Database number: 30", "price": 5000 },
                    { "text": "Database number: 40", "price": 10000 },
                    { "text": "Database number: 50", "price": 15000 }
                ],
                "Support coverage: 8x5": [
                    { "text": "Support coverage: 8x5", "price": 0 },
                    { "text": "Support coverage: 24x7", "price": 12000 }
                ]
            },
            "button": {
                "text": "Coming Soon / Join Beta",
                "url": "/beta-invitation/"
            }
        }
    ]
}
{{< /pricing-table-2 >}}

{{< faq >}}
{
    "title": "Common Questions",
    "description": "Find answers to frequently asked questions about our pricing plans and features.",
    "questions": [
        {
            "disabled": true,
            "question": "Do you offer a free trial or a freemium plan?",
            "answer": "The Starter Edition offers a free trial so you can experience our key features before committing to a plan. The Community Edition is our freemium option, which is always free to use."
        },
        {
            "question": "Do you offer custom plans?",
            "answer": "Yes. For specific requirements beyond our standard plans, please contact us to discuss a custom solution."
        },
        {
            "question": "Are there any setup fees or hidden costs?",
            "answer": "No. All prices are transparent and there are no additional setup fees."
        },
        {
            "question": "How long are subscription terms?",
            "answer": "All subscriptions are for a one-year term."
        },
        {
            "disabled": true,
            "question": "What is premium support for HariKube?",
            "answer": "Premium support varies by plan and includes dedicated support channels, a dedicated engineer, and tiered response times based on severity."
        },
        {
            "disabled": true,
            "question": "What payment methods do you offer?",
            "answer": "We offer payment via bank transfer based on an issued invoice."
        },
        {
            "disabled": true,
            "question": "How can I upgrade/downgrade/cancel my plan?",
            "answer": "You can upgrade at any time by paying the difference in price. Downgrades and cancellations are not permitted during the subscription term."
        },
        {
            "disabled": true,
            "question": "Can I get a refund?",
            "answer": "We do not offer refunds. We encourage you to use the free trial with our Starter Edition or the perpetually free Community Edition to ensure the service meets your needs before purchasing a paid plan."
        },
        {
            "question": "Can I get a discount for a non-profit or educational organization?",
            "answer": "The Community Edition is free for all users, including non-profits and educational organizations. We can also consider offering the Starter Edition for a discount on a case-by-case basis. Please contact our sales team to apply."
        },
        {
            "disabled": true,
            "question": "What is the SLA for HariKube?",
            "answer": "Our SLA (Service Level Agreement) varies by plan. We offer a 99.95% SLA for Starter, Business, and Business+ editions and a 99.99% SLA for Enterprise and Enterprise+ editions."
        },
        {
            "question": "What means Maintenance updates?",
            "answer": "Receive free security patches and bug fixes for the current major version."
        },
        {
            "question": "What is the difference between Manual and Automatic Configuration?",
            "answer": "With Manual Configuration (Community Edition), you need to manually edit a configuration file and restart the middleware to apply any changes. Automatic Configuration (all paid editions) allows for dynamic changes to take effect immediately without needing to restart the middleware."
        },
        {
            "disabled": true,
            "question": "What is a Production Runbook?",
            "answer": "A Production Runbook is a comprehensive, step-by-step guide for common operational tasks and troubleshooting procedures. It's designed to help your team efficiently manage and maintain your system, ensuring consistency and reliability."
        },
        {
            "disabled": true,
            "question": "What is Advanced Monitoring and Alerting and Notifications?",
            "answer": "These features provide built-in system monitoring, log collection, and automated alerts. This allows you to proactively track performance, gather data, and receive instant notifications for any potential issues."
        },
        {
            "question": "Are Training and Workshops available for extre fees?",
            "answer": "Yes. Training and workshops are available as professional services for an additional fee."
        },
        {
            "question": "Are Professional Services available for extre fees?",
            "answer": "Yes. Professional Services are available as an add-on to our Enterprise Editions for an additional fee."
        },
        {
            "question": "Does HariKube have a Partner Services Program?",
            "answer": "Yes, we do. Please contact us to learn more about our partner program."
        },
        {
            "question": "Does HariKube have Engineering Services?",
            "answer": "Yes, we offer Engineering Services. Please contact us to discuss your specific needs."
        }
    ]
}
{{< /faq >}}
