"""Lihtne AI vestlusrobot, mis kasutab teadmistebaasi faili."""

def load_knowledge(file_path):
    """Laeb teadmistebaasi failist ja tagastab sõnastikuna."""
    knowledge = {}
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                if ':' in line:
                    key, value = line.split(':', 1)
                    knowledge[key.strip().lower()] = value.strip()
    except FileNotFoundError:
        print(f"Viga: faili {file_path} ei leitud")
    return knowledge


def find_answer(question, knowledge):
    """Otsib küsimusele vastust teadmistebaasist."""
    question_lower = question.lower().strip()
    for key, answer in knowledge.items():
        if key in question_lower or question_lower in key:
            return answer
    return None


def main():
    knowledge = load_knowledge('teadmistebaas.txt')

    if not knowledge:
        print("Teadmistebaas on tühi või puudub. Programm lõpetab.")
        return

    print("Tere! Olen AI vestlusrobot. Esita mulle küsimus (või sisesta 'lõpeta'):")

    while True:
        question = input("\nSinu küsimus: ")

        if question.lower() == 'lõpeta':
            print("Head aega!")
            break

        answer = find_answer(question, knowledge)

        if answer:
            print(f"Robot: {answer}")
        else:
            print("Robot: Kahjuks ei oska sellele vastata.")


if __name__ == "__main__":
    main()
