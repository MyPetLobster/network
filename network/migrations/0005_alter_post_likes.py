# Generated by Django 5.0.1 on 2024-04-13 17:25

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0004_alter_post_timestamp'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='likes',
            field=models.ManyToManyField(blank=True, null=True, related_name='liked_posts', to=settings.AUTH_USER_MODEL),
        ),
    ]