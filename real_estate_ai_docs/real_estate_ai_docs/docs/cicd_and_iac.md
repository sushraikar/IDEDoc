# CI/CD and Infrastructure as Code Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [CI/CD Pipeline Overview](#cicd-pipeline-overview)
3. [GitHub Actions Workflows](#github-actions-workflows)
4. [Argo CD Configuration](#argo-cd-configuration)
5. [Infrastructure as Code with Terraform](#infrastructure-as-code-with-terraform)
6. [Kubernetes Configuration](#kubernetes-configuration)
7. [Secrets Management](#secrets-management)
8. [Environment Configuration](#environment-configuration)
9. [Monitoring and Observability](#monitoring-and-observability)
10. [Disaster Recovery](#disaster-recovery)

## Introduction

This document describes the CI/CD pipeline and Infrastructure as Code (IaC) setup for the Real Estate AI Platform. It provides detailed information about how code changes are built, tested, and deployed, as well as how the infrastructure is provisioned and managed.

### Purpose

The purpose of this documentation is to:
- Provide a comprehensive overview of the CI/CD pipeline
- Document the Infrastructure as Code approach
- Serve as a reference for DevOps engineers and developers
- Ensure consistent and reliable deployment processes

### Target Audience

This documentation is intended for:
- DevOps Engineers
- Platform Engineers
- Developers contributing to the codebase
- System Administrators

## CI/CD Pipeline Overview

The Real Estate AI Platform uses a GitOps-based CI/CD pipeline that combines GitHub Actions for Continuous Integration and Argo CD for Continuous Deployment.

### Pipeline Architecture

![CI/CD Pipeline Architecture](../diagrams/cicd_pipeline.png)

### Pipeline Flow

1. **Code Changes**:
   - Developers commit code to feature branches
   - Pull requests are created for code review

2. **Continuous Integration**:
   - GitHub Actions workflows are triggered on pull requests and merges
   - Code is built, linted, and tested
   - Docker images are built and pushed to container registry

3. **Continuous Deployment**:
   - GitHub Actions updates Kubernetes manifests in the GitOps repository
   - Argo CD detects changes in the GitOps repository
   - Argo CD synchronizes the cluster state with the desired state

4. **Monitoring and Feedback**:
   - Deployment status is monitored
   - Metrics and logs are collected
   - Alerts are triggered for any issues

### Environments

The CI/CD pipeline supports the following environments:

| Environment | Branch | Deployment Strategy | Approval |
|-------------|--------|---------------------|----------|
| Development | develop | Automatic | None |
| Staging | staging | Automatic | None |
| Production | main | Canary | Required |

## GitHub Actions Workflows

GitHub Actions is used for Continuous Integration and to trigger the Continuous Deployment process.

### Workflow Files

The following workflow files are defined in the `.github/workflows` directory:

- `ci.yml`: Runs on pull requests to validate code changes
- `build.yml`: Builds and pushes Docker images on merges to main branches
- `deploy.yml`: Updates Kubernetes manifests in the GitOps repository
- `security-scan.yml`: Performs security scanning of code and dependencies

### CI Workflow

The CI workflow runs on pull requests and includes the following steps:

```yaml
name: CI

on:
  pull_request:
    branches: [ develop, staging, main ]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Run linting
        run: npm run lint
      - name: Run type checking
        run: npm run type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      - name: Build Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: false
          tags: real-estate-ai/api:pr-${{ github.event.pull_request.number }}
```

### Build and Push Workflow

The build workflow runs on merges to main branches and builds and pushes Docker images:

```yaml
name: Build and Push

on:
  push:
    branches: [ develop, staging, main ]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ secrets.REGISTRY_URL }}
          username: ${{ secrets.REGISTRY_USERNAME }}
          password: ${{ secrets.REGISTRY_PASSWORD }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ secrets.REGISTRY_URL }}/real-estate-ai/api
          tags: |
            type=ref,event=branch
            type=sha,format=short
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

### Deploy Workflow

The deploy workflow updates Kubernetes manifests in the GitOps repository:

```yaml
name: Deploy

on:
  workflow_run:
    workflows: ["Build and Push"]
    types:
      - completed

jobs:
  update-manifests:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout GitOps repository
        uses: actions/checkout@v3
        with:
          repository: your-org/real-estate-ai-gitops
          token: ${{ secrets.GITOPS_PAT }}
          
      - name: Get image tag
        id: image-tag
        run: |
          echo "IMAGE_TAG=$(curl -s ${{ github.event.workflow_run.artifacts_url }} | jq -r '.artifacts[0].archive_download_url')" >> $GITHUB_ENV
      
      - name: Update Kubernetes manifests
        run: |
          cd k8s/${{ github.event.workflow_run.head_branch }}
          kustomize edit set image ${{ secrets.REGISTRY_URL }}/real-estate-ai/api=${{ secrets.REGISTRY_URL }}/real-estate-ai/api:${{ env.IMAGE_TAG }}
      
      - name: Commit and push changes
        run: |
          git config --global user.name 'GitHub Actions'
          git config --global user.email 'actions@github.com'
          git add .
          git commit -m "Update image to ${{ env.IMAGE_TAG }}"
          git push
```

## Argo CD Configuration

Argo CD is used for Continuous Deployment following the GitOps approach.

### Installation

Argo CD is installed in the `argocd` namespace using Helm:

```bash
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update
helm install argocd argo/argo-cd \
  --namespace argocd \
  --create-namespace \
  --values argocd-values.yaml
```

### Application Configuration

Applications are defined in the GitOps repository using the Application CRD:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: real-estate-ai-api
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/your-org/real-estate-ai-gitops.git
    targetRevision: HEAD
    path: k8s/develop
  destination:
    server: https://kubernetes.default.svc
    namespace: real-estate-ai
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

### Sync Policies

Different sync policies are used for different environments:

- **Development**: Automated sync with self-healing
- **Staging**: Automated sync with self-healing
- **Production**: Manual sync with approval

### Promotion Process

The promotion process between environments follows these steps:

1. **Development to Staging**:
   - Merge develop branch to staging branch
   - CI/CD pipeline automatically updates staging environment

2. **Staging to Production**:
   - Create a pull request from staging to main
   - Perform QA testing in staging
   - Approve the pull request
   - Merge to main
   - Approve the production deployment in Argo CD

## Infrastructure as Code with Terraform

The infrastructure for the Real Estate AI Platform is managed using Terraform.

### Repository Structure

The Terraform code is organized as follows:

```
terraform/
├── modules/
│   ├── eks/
│   ├── rds/
│   ├── vpc/
│   ├── s3/
│   └── elasticache/
├── environments/
│   ├── dev/
│   ├── staging/
│   └── prod/
└── scripts/
```

### Core Modules

#### VPC Module

The VPC module creates the network infrastructure:

```hcl
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "real-estate-ai-vpc-${var.environment}"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = var.environment != "prod"

  tags = {
    Environment = var.environment
    Project     = "real-estate-ai"
  }
}
```

#### EKS Module

The EKS module creates the Kubernetes cluster:

```hcl
module "eks" {
  source = "terraform-aws-modules/eks/aws"
  version = "19.15.1"

  cluster_name    = "real-estate-ai-${var.environment}"
  cluster_version = "1.27"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    standard = {
      min_size     = var.node_group_min_size
      max_size     = var.node_group_max_size
      desired_size = var.node_group_desired_size

      instance_types = ["m5.large"]
      capacity_type  = "ON_DEMAND"
    }
  }

  tags = {
    Environment = var.environment
    Project     = "real-estate-ai"
  }
}
```

#### RDS Module

The RDS module creates the PostgreSQL database:

```hcl
module "rds" {
  source = "terraform-aws-modules/rds/aws"
  version = "6.1.0"

  identifier = "real-estate-ai-${var.environment}"

  engine            = "postgres"
  engine_version    = "15.3"
  instance_class    = var.db_instance_class
  allocated_storage = var.db_allocated_storage

  db_name  = "realestate"
  username = "postgres"
  password = var.db_password
  port     = "5432"

  vpc_security_group_ids = [aws_security_group.rds.id]
  subnet_ids             = module.vpc.private_subnets

  family = "postgres15"
  major_engine_version = "15"

  deletion_protection = var.environment == "prod"

  parameters = [
    {
      name  = "shared_preload_libraries"
      value = "pg_stat_statements,pgvector"
    }
  ]

  tags = {
    Environment = var.environment
    Project     = "real-estate-ai"
  }
}
```

### Environment Configuration

Each environment has its own configuration:

```hcl
# environments/prod/main.tf
provider "aws" {
  region = "us-east-1"
}

module "real_estate_ai" {
  source = "../../modules/real_estate_ai"

  environment = "prod"
  
  # VPC
  vpc_cidr = "10.0.0.0/16"
  
  # EKS
  node_group_min_size     = 3
  node_group_max_size     = 10
  node_group_desired_size = 5
  
  # RDS
  db_instance_class    = "db.m5.xlarge"
  db_allocated_storage = 100
  db_password          = var.db_password
  
  # ElastiCache
  cache_node_type = "cache.m5.large"
  
  # S3
  enable_s3_replication = true
}
```

### Terraform Workflow

The Terraform workflow follows these steps:

1. **Initialize**:
   ```bash
   terraform init
   ```

2. **Plan**:
   ```bash
   terraform plan -var-file=environments/dev/terraform.tfvars
   ```

3. **Apply**:
   ```bash
   terraform apply -var-file=environments/dev/terraform.tfvars
   ```

4. **Destroy** (when needed):
   ```bash
   terraform destroy -var-file=environments/dev/terraform.tfvars
   ```

### State Management

Terraform state is stored in an S3 bucket with DynamoDB for locking:

```hcl
terraform {
  backend "s3" {
    bucket         = "real-estate-ai-terraform-state"
    key            = "environments/dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "real-estate-ai-terraform-locks"
    encrypt        = true
  }
}
```

## Kubernetes Configuration

The Kubernetes configuration is managed using Kustomize and stored in the GitOps repository.

### Repository Structure

```
k8s/
├── base/
│   ├── api-service/
│   ├── auth-service/
│   ├── chat-service/
│   ├── proposal-service/
│   └── analytics-service/
├── overlays/
│   ├── dev/
│   ├── staging/
│   └── prod/
└── common/
    ├── namespaces/
    ├── rbac/
    └── network-policies/
```

### Base Configuration

The base configuration defines the core resources:

```yaml
# k8s/base/api-service/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api-service
  template:
    metadata:
      labels:
        app: api-service
    spec:
      containers:
      - name: api-service
        image: registry.example.com/real-estate-ai/api:latest
        ports:
        - containerPort: 8000
        resources:
          requests:
            cpu: 100m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
        env:
        - name: NODE_ENV
          value: production
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: url
```

### Environment Overlays

Environment-specific configurations are defined as overlays:

```yaml
# k8s/overlays/prod/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

bases:
- ../../base

namespace: real-estate-ai

resources:
- namespace.yaml
- ingress.yaml
- hpa.yaml

patchesStrategicMerge:
- api-service-patch.yaml
- auth-service-patch.yaml
- chat-service-patch.yaml
- proposal-service-patch.yaml
- analytics-service-patch.yaml

configMapGenerator:
- name: app-config
  literals:
  - ENVIRONMENT=production
  - API_URL=https://api.realestate-ai.example.com

secretGenerator:
- name: app-secrets
  files:
  - secrets/api-keys.env
```

### Resource Scaling

Production environment uses Horizontal Pod Autoscalers:

```yaml
# k8s/overlays/prod/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-service
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-service
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Network Policies

Network policies are defined to restrict traffic:

```yaml
# k8s/common/network-policies/default-deny.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

```yaml
# k8s/common/network-policies/allow-api-traffic.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-traffic
spec:
  podSelector:
    matchLabels:
      app: api-service
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 8000
```

## Secrets Management

Secrets are managed using AWS Secrets Manager and Kubernetes secrets.

### AWS Secrets Manager

Sensitive information is stored in AWS Secrets Manager:

```hcl
resource "aws_secretsmanager_secret" "db_credentials" {
  name = "real-estate-ai/${var.environment}/db-credentials"
  
  tags = {
    Environment = var.environment
    Project     = "real-estate-ai"
  }
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id     = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = "postgres",
    password = var.db_password,
    host     = module.rds.db_instance_address,
    port     = 5432,
    database = "realestate"
  })
}
```

### External Secrets Operator

The External Secrets Operator is used to sync AWS Secrets Manager secrets to Kubernetes:

```yaml
# k8s/base/external-secrets/db-credentials.yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: db-credentials
spec:
  refreshInterval: "15m"
  secretStoreRef:
    name: aws-secretsmanager
    kind: ClusterSecretStore
  target:
    name: db-credentials
    creationPolicy: Owner
  data:
  - secretKey: url
    remoteRef:
      key: real-estate-ai/${ENVIRONMENT}/db-credentials
      property: url
  - secretKey: username
    remoteRef:
      key: real-estate-ai/${ENVIRONMENT}/db-credentials
      property: username
  - secretKey: password
    remoteRef:
      key: real-estate-ai/${ENVIRONMENT}/db-credentials
      property: password
```

### Sealed Secrets

For secrets that need to be stored in Git, Sealed Secrets is used:

```yaml
# k8s/overlays/prod/sealed-secrets/api-keys.yaml
apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
metadata:
  name: api-keys
  namespace: real-estate-ai
spec:
  encryptedData:
    OPENAI_API_KEY: AgBy8hgJ9SDJ...
    AWS_ACCESS_KEY_ID: AgCDh7hJKL...
    AWS_SECRET_ACCESS_KEY: AgCGhJKL...
```

## Environment Configuration

Environment-specific configuration is managed using ConfigMaps and environment variables.

### ConfigMaps

ConfigMaps store non-sensitive configuration:

```yaml
# k8s/overlays/prod/configmaps/app-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  NODE_ENV: "production"
  API_URL: "https://api.realestate-ai.example.com"
  REDIS_HOST: "redis.real-estate-ai.svc.cluster.local"
  ENABLE_CACHE: "true"
  LOG_LEVEL: "info"
```

### Environment Variables

Environment variables are injected into containers:

```yaml
# k8s/base/api-service/deployment.yaml (partial)
env:
- name: NODE_ENV
  valueFrom:
    configMapKeyRef:
      name: app-config
      key: NODE_ENV
- name: API_URL
  valueFrom:
    configMapKeyRef:
      name: app-config
      key: API_URL
- name: DATABASE_URL
  valueFrom:
    secretKeyRef:
      name: db-credentials
      key: url
- name: OPENAI_API_KEY
  valueFrom:
    secretKeyRef:
      name: api-keys
      key: OPENAI_API_KEY
```

### Feature Flags

Feature flags are managed using ConfigMaps:

```yaml
# k8s/overlays/staging/configmaps/feature-flags.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: feature-flags
data:
  ENABLE_NEW_SEARCH_ALGORITHM: "true"
  ENABLE_MULTILINGUAL_CHAT: "true"
  ENABLE_PROPOSAL_GENERATION_V2: "false"
```

## Monitoring and Observability

The CI/CD pipeline and infrastructure are monitored using various tools.

### Prometheus and Grafana

Prometheus is used for metrics collection and Grafana for visualization:

```yaml
# k8s/monitoring/prometheus/prometheus.yaml
apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  name: prometheus
  namespace: monitoring
spec:
  serviceAccountName: prometheus
  serviceMonitorSelector:
    matchLabels:
      team: devops
  resources:
    requests:
      memory: 400Mi
  enableAdminAPI: false
```

### Loki for Logs

Loki is used for log aggregation:

```yaml
# k8s/monitoring/loki/loki-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: loki-config
  namespace: monitoring
data:
  loki.yaml: |
    auth_enabled: false
    
    server:
      http_listen_port: 3100
    
    ingester:
      lifecycler:
        ring:
          kvstore:
            store: inmemory
          replication_factor: 1
      chunk_idle_period: 15m
      chunk_retain_period: 30s
```

### Langfuse for LLM Monitoring

Langfuse is used for monitoring LLM operations:

```yaml
# k8s/monitoring/langfuse/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: langfuse
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: langfuse
  template:
    metadata:
      labels:
        app: langfuse
    spec:
      containers:
      - name: langfuse
        image: langfuse/langfuse:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: langfuse-db-credentials
              key: url
        - name: NEXTAUTH_SECRET
          valueFrom:
            secretKeyRef:
              name: langfuse-secrets
              key: nextauth-secret
```

### Alerting

Alerting is configured using Prometheus Alertmanager:

```yaml
# k8s/monitoring/alertmanager/alertmanager-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: alertmanager-config
  namespace: monitoring
data:
  alertmanager.yaml: |
    global:
      resolve_timeout: 5m
      slack_api_url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX'
    
    route:
      group_by: ['alertname', 'job']
      group_wait: 30s
      group_interval: 5m
      repeat_interval: 12h
      receiver: 'slack-notifications'
      routes:
      - match:
          severity: critical
        receiver: 'slack-notifications'
        continue: true
    
    receivers:
    - name: 'slack-notifications'
      slack_configs:
      - channel: '#alerts'
        send_resolved: true
        title: '{{ template "slack.default.title" . }}'
        text: '{{ template "slack.default.text" . }}'
```

## Disaster Recovery

Disaster recovery procedures are implemented to ensure business continuity.

### Backup Strategy

1. **Database Backups**:
   - Automated daily snapshots using AWS RDS
   - Point-in-time recovery enabled
   - Snapshot retention period: 14 days

2. **S3 Backups**:
   - Versioning enabled on all buckets
   - Cross-region replication for critical data
   - Lifecycle policies for archiving older versions

3. **Configuration Backups**:
   - All configuration stored in Git repositories
   - Regular backups of Git repositories

### Recovery Procedures

1. **Database Recovery**:
   ```bash
   # Restore RDS instance from snapshot
   aws rds restore-db-instance-from-db-snapshot \
     --db-instance-identifier real-estate-ai-db-restored \
     --db-snapshot-identifier snapshot-identifier
   
   # Update Kubernetes secret with new database endpoint
   kubectl create secret generic db-credentials \
     --from-literal=host=new-db-host \
     --from-literal=user=$DB_USER \
     --from-literal=password=$DB_PASSWORD \
     --from-literal=database=$DB_NAME \
     -n real-estate-ai \
     --dry-run=client -o yaml | kubectl apply -f -
   ```

2. **S3 Data Recovery**:
   ```bash
   # Restore from replicated bucket
   aws s3 sync s3://real-estate-ai-assets-dr/ s3://new-primary-bucket/ --source-region us-west-2 --region us-east-1
   ```

3. **Infrastructure Recovery**:
   ```bash
   # Apply Terraform configuration to recreate infrastructure
   cd terraform/environments/prod
   terraform init
   terraform apply -var-file=terraform.tfvars
   ```

4. **Application Recovery**:
   ```bash
   # Sync applications in Argo CD
   argocd app sync real-estate-ai-api
   argocd app sync real-estate-ai-frontend
   argocd app sync real-estate-ai-services
   ```

### Disaster Recovery Testing

Regular disaster recovery testing is performed:

1. **Quarterly Database Recovery Test**:
   - Restore database from snapshot to test environment
   - Verify data integrity
   - Test application functionality with restored database

2. **Bi-annual Full Recovery Test**:
   - Simulate complete infrastructure failure
   - Execute full recovery procedure
   - Measure recovery time and success rate

3. **Monthly Backup Validation**:
   - Verify backup integrity
   - Test restoration of random files from S3
   - Validate database snapshot integrity
