from rest_framework import serializers
from .models import Unidade, Categoria, Bem
from .models import Unidade, Categoria, Bem, Gestor


class UnidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unidade
        fields = '__all__'

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class BemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bem
        # O SEGREDO ESTÁ AQUI: '__all__' garante que o campo 'origem' seja enviado
        fields = '__all__'

class GestorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gestor
        fields = '__all__'        