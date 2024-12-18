from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UserManager(BaseUserManager):
    def _create_user(self, username, email, name, last_name, dni, password, is_staff, is_superuser, **extra_fields):
        user = self.model(
            username=username,
            email=email,
            name=name,
            last_name=last_name,
            dni=dni,
            is_staff=is_staff,
            is_superuser=is_superuser,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self.db)
        return user
    
    def create_user(self, username, email, name, last_name, dni, password=None, **extra_fields):
        return self._create_user(username, email, name, last_name, dni, password, False, False, **extra_fields)
    
    def create_superuser(self, username, email, name, last_name, dni, password=None, **extra_fields):
        return self._create_user(username, email, name, last_name, dni, password, True, True, **extra_fields)

class Login(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField('Correo Electrónico', max_length=255, unique=True)
    name = models.CharField('Nombres', max_length=255, blank=True, null=True)
    last_name = models.CharField('Apellidos', max_length=255, blank=True, null=True)
    dni = models.CharField('Cedula', max_length=20, unique=True, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    # Añade related_name para evitar conflictos
    groups = models.ManyToManyField(
        'auth.Group', 
        related_name='login_user_groups',
        blank=True,
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission', 
        related_name='login_user_permissions',
        blank=True,
        verbose_name='user permissions'
    )
    
    objects = UserManager()
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'name', 'last_name', 'dni']
    
    def __str__(self):
        return f'{self.name} {self.last_name}'