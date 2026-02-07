---
title: "Ensure skip-controller-manager-metadata-caching Label on resources without owners"
layout: "simple"
---

> This version adds label to resources without `OwnerReferences`. In this way you should have the best of both worlds, not caching standalone resources, but managing resources have owner references.

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
    - name: owner-references-empty
      expression: >
          !has(object.metadata.ownerReferences) ||
          size(object.metadata.ownerReferences) == 0
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