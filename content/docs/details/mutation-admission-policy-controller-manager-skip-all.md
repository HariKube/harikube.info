---
title: "Ensure skip-controller-manager-metadata-caching Label on Everything - vCluster"
layout: "simple"
---

> ‼️ This `MutatingAdmissionPolicy` disables all Controller Manager features to the resources. Be sure storage-side garbage collection is supported by all the selected databases, and the feature is enabled on the middleware.

{{< code yaml "skip-controller-manager-metadata-caching.yaml" >}}apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingAdmissionPolicy
metadata:
  name: "skip-controller-manager-metadata-caching"
spec:
  matchConstraints:
    resourceRules:
    - apiGroups:   ["*"]
      apiVersions: ["*"]
      operations:  ["CREATE"]
      resources:   ["*"]
  matchConditions:
    - name: label-does-not-exist
      expression: >
          !has(object.metadata.labels) ||
          !('skip-controller-manager-metadata-caching' in object.metadata.labels)
  failurePolicy: Fail
  reinvocationPolicy: IfNeeded
  mutations:
    - patchType: JSONPatch
      jsonPatch:
        expression: >
          has(object.metadata.labels)
          ? [
              JSONPatch{
                op: "add",
                path: "/metadata/labels/skip-controller-manager-metadata-caching",
                value: ""
              }
            ]
          : [
              JSONPatch{
                op: "add",
                path: "/metadata/labels",
                value: {}
              },
              JSONPatch{
                op: "add",
                path: "/metadata/labels/skip-controller-manager-metadata-caching",
                value: ""
              }
            ]
---
apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingAdmissionPolicyBinding
metadata:
  name: "skip-controller-manager-metadata-caching"
spec:
  policyName: "skip-controller-manager-metadata-caching"
  matchResources:
    resourceRules:
    - apiGroups:   ["*"]
      apiVersions: ["*"]
      operations:  ["CREATE"]
      resources:   ["*"]
{{< /code >}}