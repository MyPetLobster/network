from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField("self", symmetrical=False, blank=True, related_name="followers")

    class Meta:
        ordering = ['username']


class Post(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    likes = models.ManyToManyField("User", related_name="liked_posts", null=True, blank=True)
    timestamp = models.DateTimeField()
    reply_to = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True, related_name="replies")

    class Meta:
        ordering = ['-timestamp']
        
    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.username,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "likes": self.likes.count()
        }
    
    def __str__(self):  
        return f"{self.user}: {self.content[:50]}..."
    

