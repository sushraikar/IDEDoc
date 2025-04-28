from diagrams import Diagram, Cluster, Edge
from diagrams.aws.compute import EKS, Lambda
from diagrams.aws.database import RDS, ElastiCache
from diagrams.aws.network import ELB, CloudFront, Route53
from diagrams.aws.storage import S3
from diagrams.aws.security import WAF
from diagrams.aws.integration import SQS
from diagrams.onprem.client import User, Users
from diagrams.onprem.compute import Server
from diagrams.programming.framework import React
from diagrams.programming.language import Python
from diagrams.saas.cdn import Cloudflare

# Create deployment diagram
with Diagram("Real Estate AI Platform - Deployment Architecture", show=False, filename="/home/ubuntu/real_estate_ai_docs/diagrams/deployment_architecture", outformat="png"):
    
    # External users and services
    with Cluster("Users"):
        users = Users("Real Estate Agents")
        admin = User("Admin Users")
    
    # DNS and CDN layer
    dns = Route53("DNS")
    cdn = CloudFront("CDN")
    waf = WAF("Web Application Firewall")
    
    # Frontend cluster
    with Cluster("Frontend"):
        lb = ELB("Load Balancer")
        with Cluster("React Application"):
            web = React("Web UI")
    
    # Backend services cluster
    with Cluster("Backend Services (EKS)"):
        eks = EKS("Kubernetes Cluster")
        
        with Cluster("Microservices"):
            api_service = Server("API Service")
            auth_service = Server("Auth Service")
            chat_service = Server("Chat Service")
            proposal_service = Server("Proposal Service")
            analytics_service = Server("Analytics Service")
        
        with Cluster("AI Components"):
            llm_service = Python("LangChain/LangGraph")
            embedding_service = Python("Embedding Service")
    
    # Serverless components
    with Cluster("Serverless Components"):
        pdf_generator = Lambda("PDF Generator")
        email_service = Lambda("Email Service")
        notification = Lambda("Notification Service")
    
    # Data storage
    with Cluster("Data Storage"):
        db = RDS("PostgreSQL + pgvector")
        cache = ElastiCache("Redis Cache")
        queue = SQS("Message Queue")
        storage = S3("Object Storage")
    
    # Connections
    users >> dns >> waf >> cdn >> lb >> web
    admin >> dns >> waf >> cdn >> lb >> web
    
    web >> api_service
    web >> auth_service
    web >> chat_service
    
    api_service >> db
    auth_service >> db
    chat_service >> llm_service
    chat_service >> db
    chat_service >> cache
    
    proposal_service >> llm_service
    proposal_service >> db
    proposal_service >> pdf_generator
    
    analytics_service >> db
    
    llm_service >> embedding_service
    embedding_service >> db
    
    pdf_generator >> storage
    pdf_generator >> email_service
    
    notification >> queue
    api_service >> queue
