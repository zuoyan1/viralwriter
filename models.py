from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Report(Base):
    """文案分析报告模型"""
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String(500), unique=True, nullable=False)
    score = Column(Float, nullable=False)