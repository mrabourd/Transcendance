# Generated by Django 5.0.2 on 2024-02-29 11:52

import django.contrib.auth.models
import django.contrib.auth.validators
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=30, unique=True)),
                ('description', models.TextField()),
                ('image', models.CharField(default='/var/www/static/default_game.webp', max_length=128)),
                ('genre', models.CharField(max_length=30)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('point_to_win', models.IntegerField(default=10)),
            ],
        ),
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('is_admin', models.BooleanField(default=False)),
                ('sexe', models.CharField(default='Unknow', max_length=64)),
                ('birthdate', models.DateField(default=django.utils.timezone.now)),
                ('token', models.CharField(max_length=128)),
                ('avatar', models.ImageField(upload_to='avatars/')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('last_connexion', models.DateTimeField(default=django.utils.timezone.now)),
                ('status', models.CharField(default='Online', max_length=30)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('list_friends', models.ManyToManyField(related_name='friends', to=settings.AUTH_USER_MODEL)),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='friend_request',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(default='Waiting', max_length=30)),
                ('id_receiver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='receiver', to=settings.AUTH_USER_MODEL)),
                ('id_sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sender', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='customuser',
            name='list_request',
            field=models.ManyToManyField(related_name='request', to='transcendence.friend_request'),
        ),
        migrations.AddField(
            model_name='customuser',
            name='list_request_sent',
            field=models.ManyToManyField(related_name='request_sent', to='transcendence.friend_request'),
        ),
        migrations.CreateModel(
            name='Lobby',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('type', models.CharField(default='Public', max_length=30)),
                ('id_game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='transcendence.game')),
            ],
        ),
        migrations.AddField(
            model_name='game',
            name='lobby_game',
            field=models.ManyToManyField(related_name='lobby', to='transcendence.lobby'),
        ),
        migrations.CreateModel(
            name='Party',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(default='Party', max_length=30)),
                ('started_at', models.DateTimeField(auto_now_add=True)),
                ('ended_at', models.DateTimeField(auto_now=True)),
                ('time_played', models.IntegerField(default=0)),
                ('status', models.CharField(default='Waiting', max_length=30)),
                ('score1', models.IntegerField(default=0)),
                ('score2', models.IntegerField(default=0)),
                ('type', models.CharField(default='Public', max_length=30)),
                ('round_nb', models.IntegerField(default=0)),
                ('id_game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='transcendence.game')),
                ('loser_party', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='loser_party', to=settings.AUTH_USER_MODEL)),
                ('player1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='player1', to=settings.AUTH_USER_MODEL)),
                ('player2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='player2', to=settings.AUTH_USER_MODEL)),
                ('winner_party', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='winner_party', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Stat_Game',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nb_played', models.IntegerField(default=0)),
                ('time_played', models.IntegerField(default=0)),
                ('nb_party', models.IntegerField(default=0)),
                ('avg_game_time', models.IntegerField(default=0)),
                ('id_party', models.ManyToManyField(related_name='id_party', to='transcendence.party')),
            ],
        ),
        migrations.AddField(
            model_name='game',
            name='stat',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='transcendence.stat_game'),
        ),
        migrations.CreateModel(
            name='Stat_User_by_Game',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nb_played', models.IntegerField(default=0)),
                ('time_played', models.IntegerField(default=0)),
                ('nb_win', models.IntegerField(default=0)),
                ('nb_lose', models.IntegerField(default=0)),
                ('ratio', models.IntegerField(default=0)),
                ('id_game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='transcendence.game')),
                ('id_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='customuser',
            name='stat',
            field=models.ManyToManyField(related_name='stat', to='transcendence.stat_user_by_game'),
        ),
        migrations.CreateModel(
            name='Tournament',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(default='Tournament', max_length=30)),
                ('started_at', models.DateTimeField(auto_now_add=True)),
                ('ended_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=False)),
                ('status', models.CharField(default='Waiting', max_length=30)),
                ('nb_player_to_start', models.IntegerField(default=4)),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='creator', to=settings.AUTH_USER_MODEL)),
                ('id_game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='game', to='transcendence.game')),
                ('invited_user', models.ManyToManyField(related_name='invited', to=settings.AUTH_USER_MODEL)),
                ('lobby_tournament', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='transcendence.lobby')),
                ('parties', models.ManyToManyField(related_name='party', to='transcendence.party')),
                ('user_tournament', models.ManyToManyField(related_name='user', to=settings.AUTH_USER_MODEL)),
                ('winner_Tournament', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='winner_Tournament', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PartyInTournament',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('round_nb', models.IntegerField(default=0)),
                ('match', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='transcendence.party')),
                ('id_tournament', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='transcendence.tournament')),
            ],
        ),
        migrations.AddField(
            model_name='party',
            name='id_tournament',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='transcendence.tournament'),
        ),
        migrations.AddField(
            model_name='game',
            name='tournament',
            field=models.ManyToManyField(related_name='tournament', to='transcendence.tournament'),
        ),
        migrations.CreateModel(
            name='UserInLobby',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('entry_at', models.DateTimeField(auto_now_add=True)),
                ('id_lobby', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='transcendence.lobby')),
                ('id_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='lobby',
            name='user',
            field=models.ManyToManyField(related_name='user', to='transcendence.userinlobby'),
        ),
    ]