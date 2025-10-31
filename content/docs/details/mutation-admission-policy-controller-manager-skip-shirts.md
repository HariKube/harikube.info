---
title: "Ensure skip-controller-manager-metadata-caching Label on Shirts"
layout: "simple"
---

{{< code yaml "skip-controller-manager-metadata-caching.yaml" >}}apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingAdmissionPolicy
metadata:
  name: "skip-controller-manager-metadata-caching"
spec:
  matchConstraints:
    resourceRules:
    - apiGroups:   ["stable.example.com"]
      apiVersions: ["v1"]
      operations:  ["CREATE"]
      resources:   ["shirts"]
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
                value: "true"
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
                value: "true"
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
    - apiGroups:   ["stable.example.com"]
      apiVersions: ["v1"]
      operations:  ["CREATE"]
      resources:   ["shirts"]
{{< /code >}}