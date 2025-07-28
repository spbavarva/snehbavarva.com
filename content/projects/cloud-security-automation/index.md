---
title: "Secure CI/CD DevSecOps pipeline"
description: "Automated security scanning and compliance checking for code"
date: 2025-04-08
draft: false
tags: ["Security", "Cloud", "Automation", "AWS"]
categories: ["Security"]
showToc: true
cover:
  image: "/images/projects/CICD.png"
  alt: "CICD Pipeline"
  caption: "Cloud Security CICD"
  relative: false
---




## Overview

This project demonstrates a fully integrated and secure CI/CD pipeline built with DevSecOps principles and GitOps deployment. From automated testing and vulnerability scanning to Kubernetes deployment via Argo CD, this pipeline ensures that every commit is verified, tested, secured, and deployed in a streamlined and reproducible way.

{{< figure align=center src="/images/projects/CICD.png" >}}


## Architecture

**CI Pipeline**: Builds, tests, and scans the application, producing a secure Docker image.

**CD Pipeline**: Updates a Kubernetes manifest repo, which Argo CD syncs to the cluster.

{{<newline>}} 

{{<seperator>}}

### CI Pipeline (Jenkins)

The CI pipeline is triggered on every push to the source code repository. It includes:

| Stage             | Description                                                   | Tools Used                     |
| ----------------- | ------------------------------------------------------------- | ------------------------------ |
| Checkout          | Pulls code from GitLab                                        | GitLab                         |
| Build & Unit Test | Compiles code and runs unit tests                             | Maven                          |
| Code Coverage     | Analyzes test coverage                                        | JaCoCo                         |
| SCA               | Detects vulnerable third-party dependencies                   | OWASP Dependency Check         |
| SAST              | Static security scan on proprietary code                      | SonarQube                      |
| Quality Gate      | Blocks pipeline if coverage/vulnerabilities exceed thresholds | SonarQube Quality Gates        |
| Build Image       | Creates a Docker image                                        | Docker                         |
| Scan Image        | Scans the image for vulnerabilities in all layers             | Trivy                          |
| Smoke Test        | Validates basic container health (port, response)             | Custom shell script            |
| Trigger CD Job    | Passes Docker tag to CD pipeline                              | Jenkins downstream job trigger |
{{<newline>}}
> * Full pipeline
{{< figure align=center src="/images/projects/pipeline.png" >}}

> * SonarQube dashboard showing passed quality gate
{{< figure align=center src="/images/projects/sonarqube.png" >}}


### CD Pipeline (GitOps with Argo CD)

Once the image passes all checks, the CD pipeline updates the Kubernetes manifest repo with the new Docker image tag. This triggers a GitOps deployment using Argo CD.

| Component     | Description                                                 |
| ------------- | ----------------------------------------------------------- |
| Manifest Repo | Stores YAML files (Deployment, Service, etc.)               |
| Update Script | Jenkins modifies the image tag in `deployment.yaml`         |
| Argo CD       | Monitors the manifest repo and syncs changes to the cluster |
| Deployment    | New image is pulled and deployed to Kubernetes via Argo CD  |



## DevSecOps Highlights

**Automated Security**: SCA, SAST, and container scanning are enforced at build time.
**Gatekeeping**: Code can't progress unless quality and security gates are passed.
**Zero Cluster Access**: Jenkins never directly talks to Kubernetes.
**Reproducibility**: Every deployment is traceable through Git commit history.
**Rollback Ready**: Easily revert deployments by updating YAML to a previous tag.

{{<seperator>}}

### Repository Structure

```
├── Jenkinsfile
├── Dockerfile
├── sonar-project.properties
├── manifests/
│   └── deployment.yaml
├── scripts/
│   ├── smoke-test.sh
│   └── update-yaml.sh
```
{{<seperator>}}


## Learnings

* Implementing DevSecOps as code improves release security without slowing down development.
* GitOps reduces risk by decoupling build and deploy workflows.
* Tooling like Trivy and SonarQube can be integrated early to shift security left.


{{<seperator>}}