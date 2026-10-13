from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import declarative_base

from mantto_api.db_base import Base

class KnowledgeEntry(Base):
    __tablename__ = "knowledge_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50), index=True) # Ex: "objeção_preço", "dúvida_tecido", "fechamento"
    trigger_message = Column(Text, nullable=False) # Ex: "Achei o frete muito caro"
    ideal_response = Column(Text, nullable=False) # Ex: "Amiga, levando mais uma peça o frete zera!"
    # Em produção (PostgreSQL), isso será do tipo VECTOR(1536) via pgvector
    embedding_json = Column(Text, nullable=True) 
