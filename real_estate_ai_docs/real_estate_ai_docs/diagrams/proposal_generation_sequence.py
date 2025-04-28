from diagrams import Diagram, Cluster, Edge
from diagrams.programming.flowchart import Document, Database, Preparation, PredefinedProcess
from diagrams.programming.language import Python
from diagrams.onprem.client import User
from diagrams.onprem.compute import Server
from diagrams.aws.storage import S3

# Create sequence diagram for proposal generation flow
with Diagram("Real Estate AI Platform - Proposal Generation Sequence", show=False, filename="/home/ubuntu/real_estate_ai_docs/diagrams/proposal_generation_sequence", outformat="png"):
    
    # Define actors and components
    agent = User("Real Estate Agent")
    web_ui = Server("Web UI")
    api = PredefinedProcess("API Service")
    proposal_service = PredefinedProcess("Proposal Service")
    llm = Python("LangChain/LangGraph")
    db = Database("PostgreSQL Database")
    pdf_generator = Preparation("PDF Generator")
    storage = S3("Object Storage")
    
    # Define the sequence flow with numbered edges
    agent >> Edge(label="1. Select property & lead") >> web_ui
    web_ui >> Edge(label="2. Request proposal generation") >> api
    api >> Edge(label="3. Create proposal record") >> db
    db >> Edge(label="4. Return proposal ID") >> api
    api >> Edge(label="5. Request content generation") >> proposal_service
    proposal_service >> Edge(label="6. Fetch property & lead data") >> db
    db >> Edge(label="7. Return data") >> proposal_service
    proposal_service >> Edge(label="8. Generate content") >> llm
    llm >> Edge(label="9. Return generated sections") >> proposal_service
    proposal_service >> Edge(label="10. Save proposal sections") >> db
    proposal_service >> Edge(label="11. Request PDF generation") >> pdf_generator
    pdf_generator >> Edge(label="12. Generate PDF document") >> storage
    storage >> Edge(label="13. Return PDF URL") >> pdf_generator
    pdf_generator >> Edge(label="14. Return PDF URL") >> proposal_service
    proposal_service >> Edge(label="15. Update proposal record") >> db
    proposal_service >> Edge(label="16. Return proposal details") >> api
    api >> Edge(label="17. Return proposal details") >> web_ui
    web_ui >> Edge(label="18. Display proposal") >> agent
