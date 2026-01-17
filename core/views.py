from urllib import request
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Unidade, Sala, Status, Bem, Categoria
from .serializers import UnidadeSerializer, SalaSerializer, StatusSerializer, BemSerializer, CategoriaSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from drf_spectacular.utils import extend_schema
from rest_framework import generics

    

@api_view(["POST"])
@permission_classes([AllowAny])
def api_login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(request, username=username, password=password)
    if user is None:
        return JsonResponse({"detail": "Credenciais inválidas"}, status=401)
    login(request, user)
    return JsonResponse({"detail": "Login realizado com sucesso"})


@ extend_schema(
        tags = ["Unidade"],
        summary = "Lista e cria Unidade",
        description = "Endpoint para listar todas as unidades ou criar uma nova unidade.",
)
class UnidadeViewSet(ModelViewSet):
    queryset = Unidade.objects.all()
    serializer_class = UnidadeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


@ extend_schema(
        tags = ["Sala"],
        summary = "Lista e cria Sala",
        description = "Endpoint para listar todas as salas ou criar uma nova sala.",
)
class SalaViewSet(ModelViewSet):
    queryset = Sala.objects.all()
    serializer_class = SalaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

@ extend_schema(
        tags = ["Status"],
        summary = "Lista e cria Status",
        description = "Endpoint para listar todos os status ou criar um novo status.",
)
class StatusViewSet(ModelViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class BemViewSet(ModelViewSet):
    queryset = Bem.objects.all()
    serializer_class = BemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


@ extend_schema(
        tags = ["Categoria"],
        summary = "Lista e cria Categoria",
        description = "Endpoint para listar todas as categorias ou criar uma nova categoria.",
)
class CategoriaViewSet(ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    

@ extend_schema(
        tags = ["Bens"],
        summary = "Lista e cria bens",
        description = "Endpoint para listar todos os bens ou criar um novo bem.",
)

class BemListCreateView(generics.ListCreateAPIView):
    queryset = Bem.objects.all()
    serializer_class = BemSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAuthenticated()]
    
class BemDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Bem.objects.all()
    serializer_class = BemSerializer
    permission_classes = [IsAuthenticated]