---
title: "Advanced Tools Custom Resources"
layout: "simple"
---

### Admission webhook

Kubernetes API has a declarative validation and mutation webhook system.

 - If you only need a declarative policy to simply validate resources the `ValidatingAdmissionPolicy` is a more effective choice. For complete and detailed information, please refer to the following the link: [Validating Admission Policy](https://kubernetes.io/docs/reference/access-authn-authz/validating-admission-policy).
 - If you only need a declarative policy to ensure a label on each resources the `MutatingAdmissionPolicy` is a simpler and more effective choice. We've provided a simple example on the [Custom Resource -->](/docs/custom-resource/) page, but for complete and detailed information, please refer to the following the link: [Mutating Admission Policy](https://kubernetes.io/docs/reference/access-authn-authz/mutating-admission-policy).

### List in chunks

Kubernetes API has a built in solution to fetch items in chunks.

> You must use an uncached client!

{{< code bash >}}allShirts := &stablev1.ShirtList{}
for {
    shirts := &stablev1.ShirtList{}
    _ := kubeclient.List(ctx, shirts, metav1.ListOptions{
        Limit:    int64(10),
        Continue: allShirts.ListMeta.Continue,
    })

    allShirts.ListMeta.Continue = shirts.ListMeta.Continue
    allShirts.Items = append(allShirts.Items, shirts.Items...)

    if allShirts.ListMeta.Continue != "" {
        continue
    }

    break
}
{{< /code >}}

### Count elements

Kubernetes API doesn't have direct count endpoint, but list operation returns the item count.

> You must use an uncached client! Doesn't work with selectors

{{< code bash >}}// List with limit
shirts := &stablev1.ShirtList{}
_ := kubeclient.List(ctx, shirts, metav1.ListOptions{
    Limit: 1,  // Only fetch 1 pod
})

fmt.Println(shirts.RemainingItemCount) 
{{< /code >}}

### Bulk delete

### Full-text search

By default Kubernetes API doesn't supports full-text search. It is relative easy to implement your custom indexer.

For more info please follow the related [blogpost](/blog/create-microservice-with-operator-3/).

### Distinct / Group By (Aggregation)

### Field-Level TTL (Time-To-Live)

### Pagination by Offset (Random Access)

### Efficient Range Queries on Numbers

### Unique Constraints (Beyond Names)

### Server-Side Sorting

### Advanced query