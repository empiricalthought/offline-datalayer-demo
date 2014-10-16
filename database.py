from sqlalchemy import (Table, Column, Integer, String, Date,
                        MetaData, ForeignKey, create_engine)

engine = create_engine('sqlite:///sample.db', echo=True)
metadata = MetaData()
terms = Table(
    'terms',
    metadata,
    Column('term_id', Integer, primary_key=True),
    Column('term_name', String, nullable=False, unique=True),
)

courses = Table(
    'courses',
    metadata,
    Column('course_id', Integer, primary_key=True),
    Column('course_name', String, nullable=False, unique=True),
)

sections = Table(
    'sections',
    metadata,
    Column('section_id', Integer, primary_key=True),
    Column('term_id', None, ForeignKey('terms.term_id'), nullable=False),
    Column('course_id', None, ForeignKey('courses.course_id'), nullable=False),
    Column('start_date', Date),
    Column('end_date', Date),
)


def init_db():
    metadata.create_all(engine)
