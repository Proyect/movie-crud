# Generated by Django 5.2 on 2025-04-11 21:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('consult', '0002_movie_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
