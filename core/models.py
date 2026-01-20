from django.db import models

class Unidade(models.Model):
    nome = models.CharField(max_length=100)
    endereco = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return self.nome

class Categoria(models.Model):
    nome = models.CharField(max_length=100)

    def __str__(self):
        return self.nome

class Bem(models.Model):
    # Opções de Situação
    SITUACAO_CHOICES = [
        ('RECUPERAVEL', 'Recuperável'),
        ('ANTIECONOMICO', 'Antieconômico'),
        ('IRRECUPERAVEL', 'Irrecuperável'),
        ('OCIOSO', 'Ocioso'),
    ]

    # Opções de Estado de Conservação
    ESTADO_CHOICES = [
        ('EXCELENTE', 'Excelente - Nota 10'),
        ('BOM', 'Bom - Nota 8'),
        ('REGULAR', 'Regular - Nota 5'),
    ]

    # --- NOVA LÓGICA DE ORIGEM ---
    ORIGEM_CHOICES = [
        ('PROPRIO', 'Próprio'),
        ('DOACAO', 'Doação'),
        ('ALUGADO', 'Alugado'),
    ]

    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True, null=True)
    tombo = models.CharField(max_length=20, unique=True)
    valor = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Campos de Classificação
    situacao = models.CharField(max_length=20, choices=SITUACAO_CHOICES, default='RECUPERAVEL')
    estado_conservacao = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='EXCELENTE')
    
    # Campo Novo: Origem (Substitui o eh_doacao)
    origem = models.CharField(max_length=20, choices=ORIGEM_CHOICES, default='PROPRIO')

    # Baixa
    data_baixa = models.DateField(null=True, blank=True)
    obs_baixa = models.TextField(blank=True, null=True)

    # Relacionamentos
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT)
    unidade = models.ForeignKey(Unidade, on_delete=models.PROTECT)
    
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome} ({self.tombo})"


class Gestor(models.Model):
    nome = models.CharField(max_length=100)
    cpf = models.CharField(max_length=14, unique=True)
    telefone = models.CharField(max_length=20)
    endereco = models.CharField(max_length=200)
    unidade = models.ForeignKey(Unidade, on_delete=models.PROTECT)
    
    # --- NOVAS PERMISSÕES ---
    pode_cadastrar = models.BooleanField(default=False, verbose_name="Pode Cadastrar Bens?")
    pode_editar = models.BooleanField(default=False, verbose_name="Pode Editar Bens?")
    pode_dar_baixa = models.BooleanField(default=False, verbose_name="Pode dar Baixa?")
    
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome} - {self.unidade.nome}"  
