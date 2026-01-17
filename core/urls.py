from rest_framework.routers import DefaultRouter
from django.urls import include, path
from .views import UnidadeViewSet, SalaViewSet, api_login, StatusViewSet, BemViewSet, CategoriaViewSet

router = DefaultRouter()
router.register(r"unidades", UnidadeViewSet)
router.register(r"salas", SalaViewSet)
router.register(r"status", StatusViewSet)
router.register(r"bens", BemViewSet)
router.register(r"categorias", CategoriaViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("login/", api_login),
]