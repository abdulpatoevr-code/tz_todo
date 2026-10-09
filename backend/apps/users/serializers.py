from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='first_name', required=False)
    phone = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'first_name', 'phone']

    def get_phone(self, obj):
        if hasattr(obj, 'profile'):
            return obj.profile.phone
        return ""


class UserRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, min_length=6)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует")
        return value.lower()

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Пароли не совпадают"})
        return attrs

    def create(self, validated_data):
        email = validated_data['email']
        name = validated_data.get('name', '')
        password = validated_data['password']

        user = User.objects.create_user(
            username=email,
            email=email,
            first_name=name,
            password=password
        )
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='first_name', required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['name', 'first_name', 'email', 'phone']

    def update(self, instance, validated_data):
        phone = validated_data.pop('phone', None)
        if 'first_name' in validated_data:
            instance.first_name = validated_data['first_name']
        if 'email' in validated_data:
            email = validated_data['email']
            if User.objects.filter(email__iexact=email).exclude(id=instance.id).exists():
                raise serializers.ValidationError({"email": "Этот email уже занят"})
            instance.email = email
            instance.username = email
        instance.save()

        if phone is not None:
            profile, _ = UserProfile.objects.get_or_create(user=instance)
            profile.phone = phone
            profile.save()

        return instance


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email', '').lower()
        password = attrs.get('password')

        user = User.objects.filter(email__iexact=email).first()
        if not user:
            # try username lookup
            user = User.objects.filter(username__iexact=email).first()

        if not user or not user.check_password(password):
            raise serializers.ValidationError("Неверный email или пароль")

        if not user.is_active:
            raise serializers.ValidationError("Пользователь заблокирован")

        attrs['user'] = user
        return attrs
