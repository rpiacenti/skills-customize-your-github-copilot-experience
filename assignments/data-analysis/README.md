# 📘 Tarefa: Análise de Dados

## 🎯 Objective

Os alunos aprenderão os fundamentos da análise de dados usando Python. Eles irão carregar, explorar e analisar um conjunto de dados para extrair insights relevantes.

## 📝 Tasks

### 🛠️ Carregamento e Exploração de Dados

#### Descrição
Carregue um dataset CSV fornecido e realize uma exploração básica para entender sua estrutura e conteúdo.

#### Requisitos
O programa completo deve:

- Carregar um arquivo CSV usando Python (por exemplo, com pandas)
- Exibir as primeiras 5 linhas do dataset
- Mostrar estatísticas resumidas (média, mediana, etc.) para colunas numéricas

#### Executar a análise no terminal

Na raiz do repositório, execute:

```bash
python3 assignments/data-analysis/starter-code.py
```

Para analisar outro arquivo, informe o caminho do CSV como argumento:

```bash
python3 assignments/data-analysis/starter-code.py caminho/do/arquivo.csv
```


### 🛠️ Visualização de Dados e Insights

#### Descrição
Crie visualizações para ajudar a entender os dados e resuma as principais descobertas.

#### Requisitos
O programa completo deve:

- Gerar pelo menos dois tipos diferentes de gráficos (por exemplo, histograma, gráfico de dispersão)
- Identificar e descrever pelo menos dois insights ou tendências dos dados
- Salvar os gráficos como arquivos de imagem

#### Abrir o painel HTML

O painel `dashboard.html` carrega `data.csv` no navegador e cria gráficos de barras
para as estatísticas das colunas numéricas. Inicie um servidor local na raiz do
repositório:

```bash
python3 -m http.server 8000 --directory assignments/data-analysis
```

Depois, abra [http://localhost:8000/dashboard.html](http://localhost:8000/dashboard.html).
