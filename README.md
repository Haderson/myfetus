# myfetus
Projeto da disciplina de Engenharia da Computação da UPE 2025-1


# Passo a Passo para Rodar o Código


### Passo 1 - Criar o  ambiente virtual.
Por padrão o ambiente virtual está com o nome `myenv`, mas caso queria usar outro nome certifique de que o nome da pasta esteja presente no arquivo `.gitignore`)
```
 python -m venv myenv
```
### Passo 2- Ativar o ambiente virtual
Toda vez que for iniciado o terminal é necessário realizar esse comando de ativar o *myenv* para que seja inicializado as bibliotecas necessárias para o projeto ser executado. 
No Windows:
```
.\myenv\Scripts\Activate

```
No Linux/Mac:
```
source myenv/bin/activate

```
### Passo 3 - Intaslar dependências do projeto
🟥 ATENÇÃO!🟥

Esse passo deve ser realizado com o `myenv` ativado, para que as dependências fiquem no ambiente virtual e não na sua máquina. Assim padronizando todas as versões das bibliotecas que estão sendo usadas no projeto.

**Esse passo só deve ser realizado uma única vez ou ao for adicionado uma biblioteca nova no arquivo** `requirements.txt` (arquivo que contém todas as dependências do projeto)
```
pip install -r requirements.txt
```

### Passo 5 - Rodar a API

Para rodar a aplicação, execute o seguinte comando:
```
uvicorn backend.back:app --reload

```
Acesse a API no navegador:

http://127.0.0.1:8000/docs
