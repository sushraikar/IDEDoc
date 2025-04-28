from diagrams import Diagram, Cluster, Edge
from diagrams.programming.flowchart import Document, Database, Preparation, PredefinedProcess
from diagrams.programming.language import Python
from diagrams.onprem.client import User
from diagrams.onprem.compute import Server

# Create sequence diagram for property search flow
with Diagram("Real Estate AI Platform - Property Search Sequence", show=False, filename="/home/ubuntu/real_estate_ai_docs/diagrams/property_search_sequence", outformat="png"):
    
    # Define actors and components
    user = User("Real Estate Agent")
    web_ui = Server("Web UI")
    api = PredefinedProcess("API Service")
    embedding = Python("Embedding Service")
    vector_db = Database("pgvector Database")
    llm = Python("LangChain/LangGraph")
    
    # Define the sequence flow with numbered edges
    user >> Edge(label="1. Enter natural language query") >> web_ui
    web_ui >> Edge(label="2. Send search request") >> api
    api >> Edge(label="3. Generate embedding") >> embedding
    embedding >> Edge(label="4. Return embedding vector") >> api
    api >> Edge(label="5. Vector similarity search") >> vector_db
    vector_db >> Edge(label="6. Return matching properties") >> api
    api >> Edge(label="7. Request enhanced results") >> llm
    llm >> Edge(label="8. Generate enhanced response") >> api
    api >> Edge(label="9. Return search results") >> web_ui
    web_ui >> Edge(label="10. Display results") >> user
