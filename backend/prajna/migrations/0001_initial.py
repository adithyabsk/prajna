# Generated by Django 3.2.10 on 2021-12-14 03:36

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Puzzle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
                ('description', models.CharField(max_length=2000)),
                ('solution', models.IntegerField()),
                ('sol', models.FileField(max_length=30, upload_to='')),
                ('zkey', models.FileField(max_length=30, upload_to='')),
                ('wasm', models.FileField(max_length=30, upload_to='')),
            ],
        ),
    ]
