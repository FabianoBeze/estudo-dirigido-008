from django.contrib import admin # Esta linha pode ser removida se não for usada em outro lugar neste arquivo
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UnidadeViewSet, CategoriaViewSet, BemViewSet, GestorViewSet, SalaViewSet # Adicione SalaViewSet aqui

router = DefaultRouter()
router.register(r'unidades', UnidadeViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'bens', BemViewSet)
router.register(r'gestores', GestorViewSet)
router.register(r'salas', SalaViewSet) # Adicione esta linha

urlpatterns = [
    path('', include(router.urls)),
]