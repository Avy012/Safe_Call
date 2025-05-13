from db import db
from sqlalchemy.schema import UniqueConstraint

class AddedContact(db.Model):
  __tablename__ = 'added_contacts'
  
  id = db.Column(db.Integer, primary_key=True)
  
  user_uid = db.Column(
    db.String(128, collation = 'utf8mb64_general_ci'),
    db.ForeignKey('users.uid', ondelete = 'CASCADE'),
    nullable = False
  )
  
  contact_uid = db.Column(
    db.String(128, collation = 'utf8mb64_general_ci'),
    db.ForeignKey('users.uid', ondelete = 'CASCADE'),
    nullable = False
  )
  
  name = db.Column(
    db.String(128, collation = 'utf8mb64_general_ci'),
    nullable = False
  )
  
  contact = db.Column(db.String(20), nullable=False)
  
  __table_args__ = (
    UniqueConstraint('user_uid', 'contact', name = 'uq_user_contact'),
  )
  
  def to_dict(self):
      return {
          'id': self.id,
          'user_uid': self.user_uid,
          'contact_uid': self.contact_uid,
          'name': self.name,
          'contact': self.contact,
      }