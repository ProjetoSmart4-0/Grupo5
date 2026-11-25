
import os
import sys
import json
import argparse
from datetime import datetime, timedelta, timezone
from pathlib import Path

try:
    import jwt
except ImportError:
    print("Instale a biblioteca: python -m pip install PyJWT")
    sys.exit(1)


# Define os quatro perfis autorizados pelo RBAC.
PERFIS = ("OPERATOR", "ENGINEER", "MANAGER", "ADMIN")

# Define as cinco origens previstas na Sprint 3.
ORIGENS = tuple(
    f"unidade1-grupo{i}" for i in range(1, 6)
)


# Carrega o segredo JWT sem armazená-lo no código.
def carregar_segredo():
    caminho_env = (
        Path(__file__).resolve().parent
        / "services"
        / "auth-gateway"
        / ".env"
    )

    segredo = os.environ.get("JWT_SECRET")

    if not segredo and caminho_env.exists():
        for linha in caminho_env.read_text(
            encoding="utf-8"
        ).splitlines():

            if linha.strip().startswith("JWT_SECRET="):
                segredo = linha.split(
                    "=", 1
                )[1].strip().strip('"').strip("'")
                break

    if not segredo or len(segredo) < 32:
        sys.exit("Configure um JWT_SECRET seguro.")

    return segredo


# Gera um JWT com identificação, perfil, origem e validade.
def gerar_token(perfil, origem, segredo, expirado=False):

    agora = datetime.now(timezone.utc)

    expiracao = (
        agora - timedelta(seconds=1)
        if expirado
        else agora + timedelta(hours=24)
    )

    payload = {
        "sub": origem,
        "role": perfil,
        "origem": origem,
        "iat": agora,
        "exp": expiracao
    }

    return jwt.encode(
        payload,
        segredo,
        algorithm="HS256"
    )


# Executa o gerador para um grupo e perfil autorizados.
def main():

    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--origem",
        choices=ORIGENS,
        required=True
    )

    parser.add_argument(
        "--perfil",
        choices=PERFIS,
        required=True
    )

    parser.add_argument(
        "--expirado",
        action="store_true"
    )

    args = parser.parse_args()

    segredo = carregar_segredo()

    token = gerar_token(
        args.perfil,
        args.origem,
        segredo,
        args.expirado
    )

    # Armazena o token em uma pasta ignorada pelo Git.
    pasta = Path(__file__).resolve().parent / "tokens-local"
    pasta.mkdir(exist_ok=True)

    sufixo = "-expirado" if args.expirado else ""

    arquivo = pasta / (
        f"{args.origem}-{args.perfil}{sufixo}.json"
    )

    arquivo.write_text(
        json.dumps({"token": token}, indent=2),
        encoding="utf-8"
    )

    # Exibe apenas informações não secretas.
    print("SMART 4.0 - Gerador JWT - Sprint 3")
    print(f"Origem: {args.origem}")
    print(f"Perfil: {args.perfil}")
    print("Algoritmo: HS256")
    print("Validade:", "Expirado" if args.expirado else "24 horas")
    print("Token gerado com sucesso.")
    print(f"Arquivo local: {arquivo.name}")


if __name__ == "__main__":
    main()
