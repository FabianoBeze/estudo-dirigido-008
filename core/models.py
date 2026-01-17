from django.db import models

# Create your models here.

class Unidade(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    endereco= models.CharField(max_length=200)

    class Meta:
        verbose_name = "Unidade"
        verbose_name_plural = "Unidades" # Corrigido para o plural correto

    def __str__(self):
        return self.nome


class Sala(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    unidade = models.ForeignKey(Unidade, on_delete=models.CASCADE, related_name="salas")

    class Meta:
        verbose_name = "Sala"
        verbose_name_plural = "Salas" # Corrigido para o plural correto

    def __str__(self):
        return self.nome


class Status(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)


    class Meta:
        verbose_name = "Status"
        verbose_name_plural = "Status" # Mantido como "Status" para evitar "Statuss"

    def __str__(self):
        return self.nome


class Categoria(models.Model):
    nome = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Categoria"
        verbose_name_plural = "Categorias" # Corrigido para o plural correto

    def __str__(self):
        return self.nome


class Bem(models.Model):
    nome = models.CharField(max_length=200)
    tombo = models.CharField(max_length=50, unique=True, null=True, blank=True) # Adicionado null=True, blank=True
    unidade = models.ForeignKey(Unidade, on_delete=models.PROTECT, related_name="bens")
    sala = models.ForeignKey(Sala, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.ForeignKey(Status, on_delete=models.SET_NULL, null=True, blank=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT, related_name="bens") # Adicionado o campo categoria

    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Bem"
        verbose_name_plural = "Bens"

    def __str__(self):
        return self.nome