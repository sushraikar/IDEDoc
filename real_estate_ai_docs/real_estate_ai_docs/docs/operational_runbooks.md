# Operational Runbooks for Real Estate AI Platform

## Table of Contents

1. [Introduction](#introduction)
2. [System Overview](#system-overview)
3. [Deployment Runbook](#deployment-runbook)
4. [Monitoring Runbook](#monitoring-runbook)
5. [Backup and Recovery Runbook](#backup-and-recovery-runbook)
6. [Incident Response Runbook](#incident-response-runbook)
7. [Maintenance Runbook](#maintenance-runbook)
8. [LLM Operations Runbook](#llm-operations-runbook)
9. [Database Operations Runbook](#database-operations-runbook)
10. [Security Operations Runbook](#security-operations-runbook)

## Introduction

This document contains operational runbooks for the Real Estate AI Platform. These runbooks provide step-by-step procedures for common operational tasks, troubleshooting guides, and best practices for maintaining the system in production.

### Purpose

The purpose of these runbooks is to:
- Provide clear instructions for routine operational tasks
- Establish standard procedures for incident response
- Document best practices for system maintenance
- Ensure consistent handling of operational issues

### Audience

These runbooks are intended for:
- DevOps Engineers
- Site Reliability Engineers (SREs)
- System Administrators
- Database Administrators
- AI/ML Operations Engineers

### Prerequisites

Operators should have:
- Access to AWS Management Console with appropriate permissions
- kubectl configured for EKS cluster access
- Access to monitoring and logging systems
- Understanding of Kubernetes concepts
- Familiarity with PostgreSQL and pgvector
- Basic understanding of LLM operations

## System Overview

The Real Estate AI Platform is deployed on AWS using a containerized architecture with Amazon EKS. The system consists of the following key components:

- **Frontend**: React-based web application served through CloudFront
- **Backend Services**: Microservices running on EKS
- **AI Components**: LangChain/LangGraph services for chatbot and content generation
- **Database**: PostgreSQL with pgvector extension for vector similarity search
- **Cache**: Redis for session management and caching
- **Storage**: S3 for object storage (documents, images)
- **Serverless Components**: Lambda functions for PDF generation and notifications

### Architecture Diagram

For a detailed view of the system architecture, refer to the deployment diagram in `/diagrams/deployment_architecture.png`.

## Deployment Runbook

### Prerequisites

- Access to GitHub repository
- kubectl configured for EKS cluster access
- AWS CLI configured with appropriate permissions
- Argo CD access

### Deployment Process

#### Standard Deployment

1. **Prepare for Deployment**
   ```bash
   # Ensure you're on the correct branch
   git checkout main
   git pull
   
   # Review changes
   git log -p -5
   ```

2. **Trigger Deployment Pipeline**
   ```bash
   # Deployment is automatically triggered by changes to the main branch
   # You can monitor the deployment in GitHub Actions
   ```

3. **Monitor Deployment in Argo CD**
   - Navigate to Argo CD UI: https://argocd.realestate-ai.example.com
   - Login with your credentials
   - Select the appropriate application
   - Verify sync status is "Synced" and health status is "Healthy"

4. **Verify Deployment**
   ```bash
   # Check pod status
   kubectl get pods -n real-estate-ai
   
   # Check services
   kubectl get services -n real-estate-ai
   
   # Check deployments
   kubectl get deployments -n real-estate-ai
   ```

5. **Run Smoke Tests**
   ```bash
   # Run automated smoke tests
   cd /path/to/smoke-tests
   ./run-smoke-tests.sh
   ```

#### Rollback Procedure

1. **Identify the Previous Stable Version**
   ```bash
   # List git tags to find the previous stable version
   git tag -l "v*"
   ```

2. **Trigger Rollback in Argo CD**
   - Navigate to Argo CD UI
   - Select the application
   - Click on "History" tab
   - Find the previous successful deployment
   - Click "Rollback" button

3. **Verify Rollback**
   ```bash
   # Check pod status after rollback
   kubectl get pods -n real-estate-ai
   
   # Run smoke tests
   cd /path/to/smoke-tests
   ./run-smoke-tests.sh
   ```

4. **Notify Stakeholders**
   - Send notification about the rollback
   - Include reason for rollback and current system status

### Canary Deployment

For high-risk changes, use canary deployment to gradually roll out changes:

1. **Deploy Canary Version**
   ```bash
   # Update canary deployment with new version
   kubectl apply -f k8s/canary/deployment.yaml
   
   # Verify canary deployment
   kubectl get pods -n real-estate-ai -l version=canary
   ```

2. **Monitor Canary Performance**
   - Check error rates in Prometheus/Grafana
   - Monitor response times
   - Check Langfuse for LLM-specific metrics

3. **Gradually Increase Traffic**
   ```bash
   # Update traffic split (example: 10% to canary)
   kubectl apply -f k8s/canary/traffic-split-10.yaml
   
   # Wait and monitor, then increase to 25%
   kubectl apply -f k8s/canary/traffic-split-25.yaml
   
   # Continue until 100% or rollback if issues are detected
   ```

4. **Promote or Rollback**
   - If successful, promote canary to production
   - If issues detected, rollback to previous version

## Monitoring Runbook

### Monitoring Overview

The Real Estate AI Platform uses the following monitoring tools:

- **Prometheus**: Metrics collection
- **Grafana**: Metrics visualization
- **Langfuse**: LLM observability
- **CloudWatch**: AWS service monitoring
- **ELK Stack**: Log aggregation and analysis
- **Uptime Robot**: External availability monitoring

### Key Metrics to Monitor

#### System Metrics
- CPU and memory usage
- Network I/O
- Disk usage
- Pod restarts
- Request latency
- Error rates

#### Business Metrics
- Active users
- Chatbot conversations
- Property searches
- Proposals generated
- Conversion rates

#### LLM Metrics
- Token usage
- Response times
- Completion rates
- Hallucination rates
- User feedback scores

### Accessing Monitoring Systems

#### Prometheus and Grafana

1. **Access Grafana Dashboard**
   - URL: https://grafana.realestate-ai.example.com
   - Login with your credentials

2. **View Key Dashboards**
   - System Overview
   - Kubernetes Cluster
   - API Services
   - Database Performance
   - LLM Performance

3. **Set Up Alerts**
   ```bash
   # View existing alert rules
   kubectl get prometheusrules -n monitoring
   
   # Apply new alert rule
   kubectl apply -f monitoring/alerts/new-alert.yaml
   ```

#### Langfuse for LLM Monitoring

1. **Access Langfuse Dashboard**
   - URL: https://langfuse.realestate-ai.example.com
   - Login with your credentials

2. **View Key Metrics**
   - Navigate to "Traces" to see conversation flows
   - Check "Metrics" for token usage and costs
   - Review "Datasets" for evaluation data

3. **Analyze Problematic Conversations**
   - Filter traces by score or error status
   - Examine trace details to identify issues
   - Use dataset creation to collect examples for fine-tuning

### Alert Response Procedures

#### High Error Rate Alert

1. **Assess the Situation**
   - Check Grafana dashboard for error spike
   - Identify affected services
   - Check recent deployments or changes

2. **Investigate Logs**
   ```bash
   # Check logs for affected service
   kubectl logs -n real-estate-ai deployment/affected-service --tail=100
   
   # Search for error patterns
   kubectl logs -n real-estate-ai deployment/affected-service | grep ERROR
   ```

3. **Check System Resources**
   ```bash
   # Check node resource usage
   kubectl top nodes
   
   # Check pod resource usage
   kubectl top pods -n real-estate-ai
   ```

4. **Take Action**
   - If related to recent deployment, consider rollback
   - If resource constraint, consider scaling
   - If external dependency issue, check status and implement fallback

5. **Document and Follow Up**
   - Document incident in incident management system
   - Schedule post-mortem if necessary
   - Implement preventive measures

## Backup and Recovery Runbook

### Database Backup

#### Automated Backups

PostgreSQL databases are automatically backed up using AWS RDS automated backups:

- **Backup Window**: Daily at 02:00-03:00 UTC
- **Retention Period**: 14 days
- **Backup Type**: Full snapshot + Transaction logs

#### Manual Backup Procedure

1. **Create Manual RDS Snapshot**
   ```bash
   # Create manual snapshot
   aws rds create-db-snapshot \
     --db-instance-identifier real-estate-ai-db \
     --db-snapshot-identifier manual-backup-$(date +%Y%m%d)
   
   # Verify snapshot creation
   aws rds describe-db-snapshots \
     --db-snapshot-identifier manual-backup-$(date +%Y%m%d)
   ```

2. **Export Data for Long-term Storage (Optional)**
   ```bash
   # Export schema and data
   pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -F c -f backup-$(date +%Y%m%d).dump
   
   # Upload to S3
   aws s3 cp backup-$(date +%Y%m%d).dump s3://real-estate-ai-backups/
   ```

### Database Recovery

#### Restore from RDS Snapshot

1. **Identify the Snapshot to Restore**
   ```bash
   # List available snapshots
   aws rds describe-db-snapshots \
     --db-instance-identifier real-estate-ai-db
   ```

2. **Restore Database from Snapshot**
   ```bash
   # Restore to new instance
   aws rds restore-db-instance-from-db-snapshot \
     --db-instance-identifier real-estate-ai-db-restored \
     --db-snapshot-identifier snapshot-identifier
   
   # Monitor restoration progress
   aws rds describe-db-instances \
     --db-instance-identifier real-estate-ai-db-restored
   ```

3. **Update Application Configuration**
   ```bash
   # Update database connection secret
   kubectl create secret generic db-credentials \
     --from-literal=host=new-db-host \
     --from-literal=user=$DB_USER \
     --from-literal=password=$DB_PASSWORD \
     --from-literal=database=$DB_NAME \
     -n real-estate-ai \
     --dry-run=client -o yaml | kubectl apply -f -
   
   # Restart affected deployments
   kubectl rollout restart deployment/api-service -n real-estate-ai
   kubectl rollout restart deployment/auth-service -n real-estate-ai
   # Restart other services as needed
   ```

4. **Verify Recovery**
   - Check application logs for database connection issues
   - Run database connectivity tests
   - Verify data integrity through application functionality

### S3 Backup and Recovery

#### S3 Backup Strategy

S3 data is protected using:
- S3 Versioning
- Cross-region replication
- Lifecycle policies for archiving

#### Restore S3 Objects

1. **Restore Deleted Object**
   ```bash
   # List deleted versions of an object
   aws s3api list-object-versions \
     --bucket real-estate-ai-assets \
     --prefix path/to/object
   
   # Restore specific version
   aws s3api copy-object \
     --bucket real-estate-ai-assets \
     --copy-source real-estate-ai-assets/path/to/object?versionId=version-id \
     --key path/to/object
   ```

2. **Restore from Replication Region (Disaster Recovery)**
   ```bash
   # In case of primary region failure, use the replicated bucket
   aws s3 sync s3://real-estate-ai-assets-dr/ s3://new-primary-bucket/ --source-region us-west-2 --region us-east-1
   ```

## Incident Response Runbook

### Incident Severity Levels

| Severity | Description | Response Time | Update Frequency |
|----------|-------------|---------------|------------------|
| SEV1     | Complete service outage | Immediate | Every 30 minutes |
| SEV2     | Major functionality impacted | < 30 minutes | Every 2 hours |
| SEV3     | Minor functionality impacted | < 2 hours | Daily |
| SEV4     | Cosmetic issues | < 24 hours | As needed |

### Incident Response Process

1. **Detection and Reporting**
   - Incident detected via monitoring alerts or user reports
   - Create incident ticket in incident management system
   - Assign initial severity level

2. **Triage and Assignment**
   - Assess impact and scope
   - Assign incident commander
   - Form response team based on affected components

3. **Investigation**
   - Gather logs and metrics
   - Identify potential causes
   - Document findings in incident ticket

4. **Mitigation**
   - Implement temporary fixes to restore service
   - Consider rollbacks, scaling, or failovers
   - Update stakeholders on progress

5. **Resolution**
   - Implement permanent fix
   - Verify service restoration
   - Update documentation

6. **Post-Incident Review**
   - Conduct post-mortem within 48 hours
   - Document root cause and contributing factors
   - Identify preventive measures
   - Update runbooks based on lessons learned

### Common Incidents and Resolution Steps

#### Database Connection Issues

1. **Symptoms**
   - Error logs showing database connection failures
   - API responses with 500 status codes
   - Increased latency in database-dependent operations

2. **Investigation Steps**
   ```bash
   # Check database instance status
   aws rds describe-db-instances --db-instance-identifier real-estate-ai-db
   
   # Check connectivity from a pod
   kubectl exec -it deploy/api-service -n real-estate-ai -- pg_isready -h $DB_HOST
   
   # Check database logs
   aws rds download-db-log-file-portion --db-instance-identifier real-estate-ai-db --log-file-name error/postgresql.log
   ```

3. **Resolution Steps**
   - If connection limit reached: Increase max_connections parameter
   - If network issue: Check security groups and subnet configuration
   - If database overloaded: Scale up instance or optimize queries
   - If credentials issue: Verify and update secrets

#### LLM Service Degradation

1. **Symptoms**
   - Increased latency in chatbot responses
   - Higher error rates in proposal generation
   - Timeout errors in LLM-dependent services

2. **Investigation Steps**
   ```bash
   # Check LLM service logs
   kubectl logs -n real-estate-ai deployment/llm-service --tail=100
   
   # Check Langfuse metrics
   # Review dashboards for token usage, latency, and error rates
   
   # Check external LLM API status if using external providers
   ```

3. **Resolution Steps**
   - If rate limited: Implement request throttling
   - If latency issues: Check for long prompts or inefficient patterns
   - If external API issues: Switch to fallback provider
   - If resource constraints: Scale up deployment

## Maintenance Runbook

### Scheduled Maintenance Windows

- **Database Maintenance**: Sundays, 01:00-03:00 UTC
- **Kubernetes Updates**: Last Saturday of each month, 01:00-05:00 UTC
- **Application Updates**: Tuesdays and Thursdays, 22:00-23:00 UTC

### Kubernetes Cluster Maintenance

#### Node Updates

1. **Prepare for Node Updates**
   ```bash
   # Check current node status
   kubectl get nodes
   
   # Drain a node (moves pods to other nodes)
   kubectl drain node-name --ignore-daemonsets --delete-emptydir-data
   ```

2. **Update Node**
   ```bash
   # For managed EKS, update node group
   aws eks update-nodegroup-version \
     --cluster-name real-estate-ai-cluster \
     --nodegroup-name standard-nodes
   
   # Monitor update progress
   aws eks describe-nodegroup \
     --cluster-name real-estate-ai-cluster \
     --nodegroup-name standard-nodes
   ```

3. **Verify Update**
   ```bash
   # Check node status after update
   kubectl get nodes
   
   # Uncordon node if manually drained
   kubectl uncordon node-name
   ```

#### Kubernetes Version Upgrade

1. **Upgrade EKS Control Plane**
   ```bash
   # Check available versions
   aws eks describe-addon-versions --kubernetes-version 1.27
   
   # Update cluster version
   aws eks update-cluster-version \
     --name real-estate-ai-cluster \
     --kubernetes-version 1.27
   
   # Monitor upgrade progress
   aws eks describe-update \
     --name real-estate-ai-cluster \
     --update-id update-id
   ```

2. **Upgrade Node Groups**
   ```bash
   # Update node groups to match control plane version
   aws eks update-nodegroup-version \
     --cluster-name real-estate-ai-cluster \
     --nodegroup-name standard-nodes \
     --kubernetes-version 1.27
   ```

3. **Verify Cluster Health**
   ```bash
   # Check component status
   kubectl get componentstatuses
   
   # Check pod status across all namespaces
   kubectl get pods --all-namespaces
   ```

### Database Maintenance

#### Index Maintenance

1. **Analyze Database Tables**
   ```sql
   -- Connect to database
   psql -h $DB_HOST -U $DB_USER -d $DB_NAME
   
   -- Analyze tables
   ANALYZE VERBOSE;
   
   -- Check for unused indexes
   SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;
   ```

2. **Rebuild Indexes**
   ```sql
   -- Rebuild specific index
   REINDEX INDEX index_name;
   
   -- Rebuild all indexes on a table
   REINDEX TABLE table_name;
   ```

3. **Optimize Vector Indexes**
   ```sql
   -- Check vector index usage
   SELECT * FROM pg_stat_user_indexes WHERE indexrelname LIKE '%vector%';
   
   -- Rebuild vector index
   REINDEX INDEX embeddings_vector_idx;
   ```

#### Database Vacuuming

1. **Run Manual Vacuum**
   ```sql
   -- Run vacuum analyze on all tables
   VACUUM ANALYZE;
   
   -- Run full vacuum on specific table
   VACUUM FULL table_name;
   ```

2. **Monitor Vacuum Progress**
   ```sql
   -- For PostgreSQL 13+
   SELECT * FROM pg_stat_progress_vacuum;
   ```

3. **Adjust Autovacuum Settings**
   ```sql
   -- Check current settings
   SHOW autovacuum_vacuum_threshold;
   SHOW autovacuum_vacuum_scale_factor;
   
   -- Adjust settings if needed
   ALTER SYSTEM SET autovacuum_vacuum_threshold = 50;
   ALTER SYSTEM SET autovacuum_vacuum_scale_factor = 0.1;
   
   -- Reload configuration
   SELECT pg_reload_conf();
   ```

## LLM Operations Runbook

### LLM Performance Monitoring

1. **Monitor Key Metrics in Langfuse**
   - Token usage by model and endpoint
   - Response times
   - Error rates
   - Cost tracking
   - User feedback scores

2. **Set Up Custom Metrics**
   ```python
   # Example code for custom metric tracking
   from langfuse import Langfuse

   langfuse = Langfuse()
   
   trace = langfuse.trace(name="property_search")
   generation = trace.generation(
       name="search_results",
       model="gpt-4",
       prompt="Find properties matching: modern apartment with sea view",
       completion="Found 5 properties matching your criteria..."
   )
   
   # Add custom metrics
   generation.score("relevance", 0.92)
   generation.score("response_quality", 0.85)
   ```

3. **Review Performance Regularly**
   - Daily check of error rates and latency
   - Weekly review of token usage and costs
   - Monthly analysis of user feedback and quality metrics

### Prompt Management

1. **Prompt Version Control**
   - Store prompts in version-controlled repository
   - Use templating system for dynamic content
   - Document prompt changes and rationale

2. **Prompt Testing Procedure**
   ```bash
   # Run prompt evaluation script
   cd /path/to/prompt-testing
   python evaluate_prompts.py --prompt-version v2.3 --test-cases standard
   
   # Compare with previous version
   python compare_results.py --old-version v2.2 --new-version v2.3
   ```

3. **Deploying Updated Prompts**
   ```bash
   # Update prompt config map
   kubectl create configmap prompt-templates \
     --from-file=prompts/ \
     -n real-estate-ai \
     --dry-run=client -o yaml | kubectl apply -f -
   
   # Restart affected services
   kubectl rollout restart deployment/chat-service -n real-estate-ai
   kubectl rollout restart deployment/proposal-service -n real-estate-ai
   ```

### LLM Cost Management

1. **Monitor Token Usage**
   - Track usage by endpoint, user, and feature
   - Set up alerts for unusual spikes
   - Implement rate limiting for high-volume endpoints

2. **Optimize Prompts for Efficiency**
   - Review and refine verbose prompts
   - Use cheaper models for simpler tasks
   - Implement caching for common queries

3. **Implement Tiered Access**
   - Limit premium model access based on user role
   - Set token quotas for different user tiers
   - Use fallback to smaller models when appropriate

## Database Operations Runbook

### PostgreSQL with pgvector Operations

#### Vector Index Management

1. **Create Vector Indexes**
   ```sql
   -- Create index with IVFFlat
   CREATE INDEX ON embeddings USING ivfflat (vector vector_l2_ops) WITH (lists = 100);
   
   -- Create index with HNSW
   CREATE INDEX ON embeddings USING hnsw (vector vector_cosine_ops) WITH (m = 16, ef_construction = 64);
   ```

2. **Monitor Index Performance**
   ```sql
   -- Check index size
   SELECT pg_size_pretty(pg_relation_size('embeddings_vector_idx'));
   
   -- Check index usage
   SELECT * FROM pg_stat_user_indexes WHERE indexrelname = 'embeddings_vector_idx';
   
   -- Check query performance
   EXPLAIN ANALYZE SELECT * FROM embeddings ORDER BY vector <-> '[0.1,0.2,...]' LIMIT 10;
   ```

3. **Optimize Vector Queries**
   ```sql
   -- Adjust work_mem for vector operations
   SET work_mem = '256MB';
   
   -- Use approximate nearest neighbor search
   SELECT * FROM embeddings ORDER BY vector <-> '[0.1,0.2,...]' LIMIT 10;
   
   -- Use exact nearest neighbor search when needed
   SET ivfflat.probes = 100;  -- Increase accuracy at cost of performance
   SELECT * FROM embeddings ORDER BY vector <-> '[0.1,0.2,...]' LIMIT 10;
   ```

#### Database Scaling

1. **Vertical Scaling (Instance Size)**
   ```bash
   # Modify RDS instance
   aws rds modify-db-instance \
     --db-instance-identifier real-estate-ai-db \
     --db-instance-class db.m5.2xlarge \
     --apply-immediately
   
   # Monitor scaling operation
   aws rds describe-db-instances \
     --db-instance-identifier real-estate-ai-db
   ```

2. **Read Scaling (Read Replicas)**
   ```bash
   # Create read replica
   aws rds create-db-instance-read-replica \
     --db-instance-identifier real-estate-ai-db-replica \
     --source-db-instance-identifier real-estate-ai-db
   
   # Update application to use replica for reads
   kubectl create configmap db-config \
     --from-literal=read_host=replica-host \
     --from-literal=write_host=primary-host \
     -n real-estate-ai \
     --dry-run=client -o yaml | kubectl apply -f -
   ```

3. **Sharding Considerations**
   - Document sharding strategy if implemented
   - Include shard key selection rationale
   - Provide procedures for adding new shards

## Security Operations Runbook

### Access Management

1. **User Access Review**
   ```bash
   # List IAM users and their access
   aws iam list-users
   aws iam list-user-policies --user-name username
   
   # List Kubernetes RBAC bindings
   kubectl get rolebindings,clusterrolebindings --all-namespaces
   ```

2. **Rotate Credentials**
   ```bash
   # Rotate IAM access keys
   aws iam create-access-key --user-name username
   aws iam update-access-key --access-key-id old-key-id --status Inactive --user-name username
   aws iam delete-access-key --access-key-id old-key-id --user-name username
   
   # Rotate database credentials
   # 1. Update password in RDS
   aws rds modify-db-instance \
     --db-instance-identifier real-estate-ai-db \
     --master-user-password new-password
   
   # 2. Update Kubernetes secret
   kubectl create secret generic db-credentials \
     --from-literal=password=new-password \
     -n real-estate-ai \
     --dry-run=client -o yaml | kubectl apply -f -
   
   # 3. Restart affected services
   kubectl rollout restart deployment/api-service -n real-estate-ai
   ```

3. **Revoke Access**
   ```bash
   # Remove IAM permissions
   aws iam detach-user-policy --user-name username --policy-arn policy-arn
   
   # Remove Kubernetes access
   kubectl delete rolebinding user-binding -n real-estate-ai
   ```

### Security Scanning

1. **Run Vulnerability Scans**
   ```bash
   # Scan container images
   trivy image real-estate-ai/api-service:latest
   
   # Scan Kubernetes resources
   trivy k8s --namespace real-estate-ai
   
   # Scan infrastructure as code
   trivy config --severity HIGH,CRITICAL ./terraform
   ```

2. **Review Scan Results**
   ```bash
   # Generate report
   trivy image --format json --output vuln-report.json real-estate-ai/api-service:latest
   
   # Prioritize findings
   jq '.Results[] | select(.Vulnerabilities[] | .Severity=="CRITICAL")' vuln-report.json
   ```

3. **Remediate Vulnerabilities**
   - Update base images
   - Apply security patches
   - Update dependencies
   - Implement recommended mitigations

### Security Incident Response

1. **Contain the Incident**
   ```bash
   # Isolate affected pod
   kubectl label pod affected-pod quarantine=true
   
   # Apply network policy to restrict traffic
   kubectl apply -f security/quarantine-network-policy.yaml
   
   # Revoke compromised credentials
   aws iam update-access-key --access-key-id compromised-key --status Inactive --user-name username
   ```

2. **Investigate the Incident**
   ```bash
   # Collect pod logs
   kubectl logs affected-pod -n real-estate-ai --previous > pod-logs.txt
   
   # Capture pod details
   kubectl describe pod affected-pod -n real-estate-ai > pod-details.txt
   
   # Check audit logs
   aws cloudtrail lookup-events --lookup-attributes AttributeKey=Username,AttributeValue=username
   ```

3. **Recover from the Incident**
   - Deploy clean instances
   - Restore from known good backups
   - Apply additional security controls
   - Update documentation and runbooks

### Compliance Monitoring

1. **Run Compliance Checks**
   ```bash
   # Check for compliance with security standards
   kube-bench --check-type=master,node
   
   # Verify encryption settings
   aws rds describe-db-instances --db-instance-identifier real-estate-ai-db --query 'DBInstances[*].StorageEncrypted'
   
   # Check S3 bucket policies
   aws s3api get-bucket-policy --bucket real-estate-ai-assets
   ```

2. **Generate Compliance Reports**
   - Run automated compliance scans monthly
   - Document findings and remediation plans
   - Maintain evidence of compliance for audits

3. **Remediate Compliance Issues**
   - Prioritize based on risk and regulatory requirements
   - Implement required controls
   - Validate effectiveness of controls
   - Update compliance documentation
