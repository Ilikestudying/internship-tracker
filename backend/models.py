from sqlalchemy import Column, Integer, String, Date
from database import Base


class InternshipDB(Base):
    __tablename__ = "internships"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, nullable=False)
    role = Column(String, nullable=False)
    status = Column(String, nullable=False)
    date_applied = Column(Date, nullable=True)