import os
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text, Table, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import pandas as pd
from datetime import datetime

# Create a SQLite in-memory database
engine = create_engine('sqlite:///:memory:')
Base = declarative_base()

# Define the models based on the requirements
class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    role = Column(String(20), nullable=False)  # admin, agent, manager, analyst
    agency = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    leads = relationship("Lead", back_populates="assigned_agent")
    proposals = relationship("Proposal", back_populates="created_by")

class Lead(Base):
    __tablename__ = 'leads'
    
    id = Column(Integer, primary_key=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50))
    nationality = Column(String(100))
    status = Column(String(20), nullable=False)  # new, contacted, qualified, proposal, negotiation, closed, lost
    source = Column(String(20))  # website, bayut, property_finder, referral, direct, other
    assigned_to = Column(Integer, ForeignKey('users.id'))
    budget_min = Column(Float)
    budget_max = Column(Float)
    requirements = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_contacted_at = Column(DateTime)
    
    # Relationships
    assigned_agent = relationship("User", back_populates="leads")
    proposals = relationship("Proposal", back_populates="lead")
    notes = relationship("LeadNote", back_populates="lead")
    
class LeadNote(Base):
    __tablename__ = 'lead_notes'
    
    id = Column(Integer, primary_key=True)
    lead_id = Column(Integer, ForeignKey('leads.id'), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Relationships
    lead = relationship("Lead", back_populates="notes")

class Property(Base):
    __tablename__ = 'properties'
    
    id = Column(Integer, primary_key=True)
    reference = Column(String(50), unique=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    type = Column(String(20), nullable=False)  # apartment, villa, townhouse, penthouse, office, retail, land
    status = Column(String(20), nullable=False)  # available, sold, rented, off-plan
    category = Column(String(20), nullable=False)  # sale, rent, off-plan
    price = Column(Float, nullable=False)
    area = Column(Float, nullable=False)
    bedrooms = Column(Integer)
    bathrooms = Column(Integer)
    address = Column(String(255))
    community = Column(String(100))
    city = Column(String(100))
    latitude = Column(Float)
    longitude = Column(Float)
    developer = Column(String(100))
    completion_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    features = relationship("PropertyFeature", back_populates="property")
    images = relationship("PropertyImage", back_populates="property")
    proposals = relationship("Proposal", back_populates="property")
    embedding = relationship("Embedding", uselist=False, back_populates="property")

class PropertyFeature(Base):
    __tablename__ = 'property_features'
    
    id = Column(Integer, primary_key=True)
    property_id = Column(Integer, ForeignKey('properties.id'), nullable=False)
    feature = Column(String(100), nullable=False)
    
    # Relationships
    property = relationship("Property", back_populates="features")

class PropertyImage(Base):
    __tablename__ = 'property_images'
    
    id = Column(Integer, primary_key=True)
    property_id = Column(Integer, ForeignKey('properties.id'), nullable=False)
    url = Column(String(255), nullable=False)
    is_floor_plan = Column(Boolean, default=False)
    
    # Relationships
    property = relationship("Property", back_populates="images")

class Embedding(Base):
    __tablename__ = 'embeddings'
    
    id = Column(Integer, primary_key=True)
    property_id = Column(Integer, ForeignKey('properties.id'), nullable=False, unique=True)
    vector = Column(String(8192), nullable=False)  # Storing as serialized vector (1536 dimensions)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    property = relationship("Property", back_populates="embedding")

class Proposal(Base):
    __tablename__ = 'proposals'
    
    id = Column(Integer, primary_key=True)
    property_id = Column(Integer, ForeignKey('properties.id'), nullable=False)
    lead_id = Column(Integer, ForeignKey('leads.id'), nullable=False)
    title = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    language = Column(String(2), nullable=False, default='en')  # en, ar, fr
    status = Column(String(20), nullable=False, default='draft')  # draft, sent, viewed, accepted, rejected
    pdf_url = Column(String(255))
    web_url = Column(String(255))
    
    # Relationships
    property = relationship("Property", back_populates="proposals")
    lead = relationship("Lead", back_populates="proposals")
    created_by = relationship("User", back_populates="proposals")
    sections = relationship("ProposalSection", back_populates="proposal")

class ProposalSection(Base):
    __tablename__ = 'proposal_sections'
    
    id = Column(Integer, primary_key=True)
    proposal_id = Column(Integer, ForeignKey('proposals.id'), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    type = Column(String(50), nullable=False)  # property_details, financial_analysis, location_insights, payment_plan, visa_information
    order = Column(Integer, nullable=False)
    
    # Relationships
    proposal = relationship("Proposal", back_populates="sections")

class ChatSession(Base):
    __tablename__ = 'chat_sessions'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    messages = relationship("ChatMessage", back_populates="session")

class ChatMessage(Base):
    __tablename__ = 'chat_logs'
    
    id = Column(Integer, primary_key=True)
    session_id = Column(Integer, ForeignKey('chat_sessions.id'), nullable=False)
    role = Column(String(10), nullable=False)  # user, assistant
    content = Column(Text, nullable=False)
    language = Column(String(2), nullable=False)  # en, ar, fr
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    session = relationship("ChatSession", back_populates="messages")

# Create all tables in the engine
Base.metadata.create_all(engine)

# Generate ERD using graphviz
try:
    import os
    os.system('pip install pygraphviz')
    from eralchemy2 import render_er
    
    # Generate the ERD
    render_er(engine, '/home/ubuntu/real_estate_ai_docs/db/ERD.png')
    print("ERD generated successfully at /home/ubuntu/real_estate_ai_docs/db/ERD.png")
except Exception as e:
    print(f"Error generating ERD: {e}")
    print("Continuing with data dictionary generation...")

# Create data dictionary
tables = Base.metadata.tables
data_dict = []

for table_name, table in tables.items():
    for column in table.columns:
        data_dict.append({
            'Table': table_name,
            'Column': column.name,
            'Type': str(column.type),
            'Primary Key': 'Yes' if column.primary_key else 'No',
            'Foreign Key': 'Yes' if column.foreign_keys else 'No',
            'Nullable': 'Yes' if column.nullable else 'No',
            'Default': str(column.default) if column.default is not None else '',
            'Description': ''
        })

# Add descriptions
for item in data_dict:
    table = item['Table']
    column = item['Column']
    
    # Users table descriptions
    if table == 'users':
        if column == 'id': item['Description'] = 'Unique identifier for the user'
        elif column == 'email': item['Description'] = 'Email address of the user (used for login)'
        elif column == 'password_hash': item['Description'] = 'Hashed password for user authentication'
        elif column == 'first_name': item['Description'] = 'First name of the user'
        elif column == 'last_name': item['Description'] = 'Last name of the user'
        elif column == 'role': item['Description'] = 'Role of the user (admin, agent, manager, analyst)'
        elif column == 'agency': item['Description'] = 'Real estate agency the user belongs to'
        elif column == 'created_at': item['Description'] = 'Timestamp when the user was created'
        elif column == 'updated_at': item['Description'] = 'Timestamp when the user was last updated'
    
    # Leads table descriptions
    elif table == 'leads':
        if column == 'id': item['Description'] = 'Unique identifier for the lead'
        elif column == 'first_name': item['Description'] = 'First name of the lead'
        elif column == 'last_name': item['Description'] = 'Last name of the lead'
        elif column == 'email': item['Description'] = 'Email address of the lead'
        elif column == 'phone': item['Description'] = 'Phone number of the lead'
        elif column == 'nationality': item['Description'] = 'Nationality of the lead (relevant for visa eligibility)'
        elif column == 'status': item['Description'] = 'Current status in the sales pipeline'
        elif column == 'source': item['Description'] = 'Source of the lead (website, Bayut, Property Finder, etc.)'
        elif column == 'assigned_to': item['Description'] = 'ID of the user (agent) assigned to this lead'
        elif column == 'budget_min': item['Description'] = 'Minimum budget of the lead'
        elif column == 'budget_max': item['Description'] = 'Maximum budget of the lead'
        elif column == 'requirements': item['Description'] = 'Property requirements and preferences of the lead'
        elif column == 'created_at': item['Description'] = 'Timestamp when the lead was created'
        elif column == 'updated_at': item['Description'] = 'Timestamp when the lead was last updated'
        elif column == 'last_contacted_at': item['Description'] = 'Timestamp when the lead was last contacted'
    
    # Lead notes table descriptions
    elif table == 'lead_notes':
        if column == 'id': item['Description'] = 'Unique identifier for the note'
        elif column == 'lead_id': item['Description'] = 'ID of the lead this note belongs to'
        elif column == 'content': item['Description'] = 'Content of the note'
        elif column == 'created_at': item['Description'] = 'Timestamp when the note was created'
        elif column == 'created_by': item['Description'] = 'ID of the user who created the note'
    
    # Properties table descriptions
    elif table == 'properties':
        if column == 'id': item['Description'] = 'Unique identifier for the property'
        elif column == 'reference': item['Description'] = 'External reference number for the property'
        elif column == 'title': item['Description'] = 'Title of the property listing'
        elif column == 'description': item['Description'] = 'Detailed description of the property'
        elif column == 'type': item['Description'] = 'Type of property (apartment, villa, etc.)'
        elif column == 'status': item['Description'] = 'Current status of the property (available, sold, etc.)'
        elif column == 'category': item['Description'] = 'Category of listing (sale, rent, off-plan)'
        elif column == 'price': item['Description'] = 'Price of the property in AED'
        elif column == 'area': item['Description'] = 'Area of the property in square feet'
        elif column == 'bedrooms': item['Description'] = 'Number of bedrooms'
        elif column == 'bathrooms': item['Description'] = 'Number of bathrooms'
        elif column == 'address': item['Description'] = 'Street address of the property'
        elif column == 'community': item['Description'] = 'Community or neighborhood of the property'
        elif column == 'city': item['Description'] = 'City where the property is located'
        elif column == 'latitude': item['Description'] = 'Latitude coordinate for mapping'
        elif column == 'longitude': item['Description'] = 'Longitude coordinate for mapping'
        elif column == 'developer': item['Description'] = 'Developer of the property (for off-plan properties)'
        elif column == 'completion_date': item['Description'] = 'Expected completion date (for off-plan properties)'
        elif column == 'created_at': item['Description'] = 'Timestamp when the property was created'
        elif column == 'updated_at': item['Description'] = 'Timestamp when the property was last updated'
    
    # Property features table descriptions
    elif table == 'property_features':
        if column == 'id': item['Description'] = 'Unique identifier for the feature'
        elif column == 'property_id': item['Description'] = 'ID of the property this feature belongs to'
        elif column == 'feature': item['Description'] = 'Name of the feature or amenity'
    
    # Property images table descriptions
    elif table == 'property_images':
        if column == 'id': item['Description'] = 'Unique identifier for the image'
        elif column == 'property_id': item['Description'] = 'ID of the property this image belongs to'
        elif column == 'url': item['Description'] = 'URL of the image'
        elif column == 'is_floor_plan': item['Description'] = 'Flag indicating if the image is a floor plan'
    
    # Embeddings table descriptions
    elif table == 'embeddings':
        if column == 'id': item['Description'] = 'Unique identifier for the embedding'
        elif column == 'property_id': item['Description'] = 'ID of the property this embedding represents'
        elif column == 'vector': item['Description'] = 'Vector embedding (1536 dimensions) for semantic search'
        elif column == 'created_at': item['Description'] = 'Timestamp when the embedding was created'
        elif column == 'updated_at': item['Description'] = 'Timestamp when the embedding was last updated'
    
    # Proposals table descriptions
    elif table == 'proposals':
        if column == 'id': item['Description'] = 'Unique identifier for the proposal'
        elif column == 'property_id': item['Description'] = 'ID of the property included in the proposal'
        elif column == 'lead_id': item['Description'] = 'ID of the lead the proposal is for'
        elif column == 'title': item['Description'] = 'Title of the proposal'
        elif column == 'created_at': item['Description'] = 'Timestamp when the proposal was created'
        elif column == 'created_by_id': item['Description'] = 'ID of the user who created the proposal'
        elif column == 'language': item['Description'] = 'Language of
(Content truncated due to size limit. Use line ranges to read in chunks)