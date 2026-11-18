import argparse
import csv
import statistics
from pathlib import Path
from typing import Iterable


def load_csv(file_path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with file_path.open("r", encoding="utf-8", newline="") as csv_file:
        reader = csv.DictReader(csv_file)
        if reader.fieldnames is None:
            return [], []
        return reader.fieldnames, list(reader)


def get_numeric_columns(
    fieldnames: Iterable[str],
    rows: list[dict[str, str]],
) -> dict[str, list[float]]:
    numeric_columns: dict[str, list[float]] = {}

    for fieldname in fieldnames:
        values: list[float] = []
        for row in rows:
            raw_value = (row.get(fieldname) or "").strip()
            if not raw_value:
                continue
            try:
                values.append(float(raw_value))
            except ValueError:
                break
        else:
            if values:
                numeric_columns[fieldname] = values

    return numeric_columns


def print_first_rows(fieldnames: list[str], rows: list[dict[str, str]], limit: int = 5) -> None:
    print(f"\nPrimeiras {min(limit, len(rows))} linhas:")
    print("\t".join(fieldnames))
    for row in rows[:limit]:
        print("\t".join(row.get(fieldname, "") for fieldname in fieldnames))


def print_numeric_statistics(numeric_columns: dict[str, list[float]]) -> None:
    print("\nEstatisticas resumidas das colunas numericas:")

    if not numeric_columns:
        print("Nenhuma coluna numerica encontrada.")
        return

    for column_name, values in numeric_columns.items():
        minimum = min(values)
        maximum = max(values)
        print(f"\n{column_name}:")
        print(f"  Quantidade: {len(values)}")
        print(f"  Media: {statistics.fmean(values):.2f}")
        print(f"  Mediana: {statistics.median(values):.2f}")
        print(f"  Minimo: {minimum:.2f}")
        print(f"  Maximo: {maximum:.2f}")
        print(f"  Desvio padrao: {statistics.pstdev(values):.2f}")


def parse_args() -> argparse.Namespace:
    default_csv = Path(__file__).with_name("data.csv")
    parser = argparse.ArgumentParser(
        description="Carrega e explora um arquivo CSV.",
    )
    parser.add_argument(
        "csv_file",
        nargs="?",
        type=Path,
        default=default_csv,
        help="Caminho do arquivo CSV (padrao: data.csv nesta tarefa)",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    csv_path = args.csv_file.resolve()

    if not csv_path.is_file():
        raise FileNotFoundError(f"Arquivo CSV nao encontrado: {csv_path}")

    fieldnames, rows = load_csv(csv_path)
    if not fieldnames:
        print("O arquivo CSV esta vazio ou nao possui cabecalhos.")
        return

    print(f"Arquivo: {csv_path}")
    print(f"Linhas: {len(rows)}")
    print(f"Colunas: {len(fieldnames)}")

    print_first_rows(fieldnames, rows)
    numeric_columns = get_numeric_columns(fieldnames, rows)
    print_numeric_statistics(numeric_columns)


if __name__ == "__main__":
    main()
