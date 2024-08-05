from django.db import models
from uuid import uuid4
from django.utils.translation import gettext_lazy as _
from user.models import User

class Post(models.Model):
    class Meta:
        db_table = 'posts'
        verbose_name = _('Post')
        verbose_name_plural = _('Posts')

    pid = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    content = models.TextField(max_length=255)
    poster = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.content
