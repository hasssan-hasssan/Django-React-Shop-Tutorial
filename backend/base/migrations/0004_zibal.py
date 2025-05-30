# Generated by Django 5.0.6 on 2025-02-13 20:10

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0003_alter_product_image'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Zibal',
            fields=[
                ('_id', models.AutoField(editable=False, primary_key=True, serialize=False)),
                ('trackId', models.IntegerField(unique=True)),
                ('lastStatus', models.SmallIntegerField(blank=True, null=True)),
                ('refNumber', models.BigIntegerField(blank=True, null=True)),
                ('amountCreated', models.IntegerField(blank=True, null=True)),
                ('amountPaid', models.IntegerField(blank=True, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('cardNumber', models.CharField(blank=True, max_length=16, null=True)),
                ('createdAt_Z', models.DateTimeField(blank=True, null=True)),
                ('verifiedAt', models.DateTimeField(blank=True, null=True)),
                ('paidAt', models.DateTimeField(blank=True, null=True)),
                ('createdAt', models.DateTimeField(blank=True, null=True)),
                ('updatedAt', models.DateTimeField(blank=True, null=True)),
                ('order', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='base.order')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'Zibal Payments',
            },
        ),
    ]
