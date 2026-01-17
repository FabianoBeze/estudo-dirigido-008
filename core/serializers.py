from rest_framework import serializers
from .models import Unidade, Sala, Status, Bem, Categoria


class UnidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unidade
        fields = "__all__"


class SalaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sala
        fields = "__all__"


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = "__all__"


class BemSerializer(serializers.ModelSerializer):
    unidade_nome = serializers.StringRelatedField(source='unidade')
    sala_nome = serializers.StringRelatedField(source='sala')
    status_nome = serializers.StringRelatedField(source='status')
    categoria_nome = serializers.StringRelatedField(source='categoria')

    class Meta:
        model = Bem
        fields = (
            "id",
            "nome",
            "tombo",
            "unidade",
            "unidade_nome",  # Adicionado para retornar o nome da unidade
            "sala",
            "sala_nome",     # Adicionado para retornar o nome da sala
            "status",
            "status_nome",   # Adicionado para retornar o nome do status
            "categoria",
            "categoria_nome",# Adicionado para retornar o nome da categoria
            "criado_em",
            "atualizado_em"
        )


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = "__all__"