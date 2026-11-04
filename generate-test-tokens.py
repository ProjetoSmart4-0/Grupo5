
import os
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

try:
    import jwt
except ImportError:
    print("Erro: biblioteca PyJWT nao instalada.")
    print("Execute: python -m pip install PyJWT")
    sys.exit(1)


PERFIS = ("OPERATOR", "ENGINEER", "MANAGER", "ADMIN")


def carregar_segredo():
    caminho_env = (
        Path(__file__).resolve().parent
        / "services"
        / "auth-gateway"
        / ".env"
    )

    segredo = os.environ.get("JWT_SECRET")

    if not segredo and caminho_env.exists():
        for linha in caminho_env.read_text(encoding="utf-8").splitlines():
            linha = linha.strip()

            if linha.startswith("JWT_SECRET="):
                segredo = linha.split("=", 1)[1].strip().strip('"').strip("'")
                break

    if not segredo or segredo == "SUBSTITUA_POR_UM_SEGREDO_LOCAL":
        print("Erro: configure JWT_SECRET no arquivo .env do Gateway.")
        sys.exit(1)

    return segredo


def gerar_token(perfil, segredo, expirado=False):
    agora = datetime.now(timezone.utc)

    expiracao = (
        agora - timedelta(seconds=1)
        if expirado
        else agora + timedelta(minutes=15)
    )

    payload = {
        "role": perfil,
        "iat": agora,
        "exp": expiracao
    }

    return jwt.encode(payload, segredo, algorithm="HS256")


def main():
    segredo = carregar_segredo()

    print("\nSMART 4.0 - Gerador de Tokens JWT de Teste")
    print("=" * 50)

    for perfil in PERFIS:
        token = gerar_token(perfil, segredo)

        print(f"\nPERFIL: {perfil}")
        print(f"TOKEN: {token}")

    token_expirado = gerar_token("ADMIN", segredo, expirado=True)

    print("\nPERFIL: ADMIN (TOKEN EXPIRADO)")
    print(f"TOKEN: {token_expirado}")

    print("\nATENCAO: utilize estes tokens apenas em ambiente de teste.")
    print("Nao compartilhe os tokens nem publique a saida no GitHub.")


if __name__ == "__main__":
    main()
