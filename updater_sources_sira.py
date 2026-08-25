import codecs
import re

with codecs.open('src/data/siraEvents.js', 'r', encoding='utf-8') as f:
    text = f.read()

sources_map = {
    1: ["<strong>Coran :</strong> Sourate Al-Fîl (105).", "<strong>Histoire :</strong> Sîra d'Ibn Hicham (Vol. 1, p. 158) ; Le Nectar Cacheté.", "<strong>Hadith :</strong> Ṣaḥīḥ Muslim (Livre du Jeûne, n°1162) pour la bénédiction du Lundi."],
    2: ["<strong>Hadith :</strong> Ṣaḥīḥ Muslim (Livre de la Foi, n°162) détaillant l'ouverture de la poitrine.", "<strong>Histoire :</strong> Sîra d'Ibn Hicham (Vol. 1, p. 162)."],
    3: ["<strong>Histoire :</strong> Sîra d'Ibn Hicham (Vol. 1, p. 167) ; Le Nectar Cacheté."],
    4: ["<strong>Histoire :</strong> Sîra d'Ibn Hicham (Vol. 1, p. 184) détaillant la participation de Quraysh."],
    5: ["<strong>Histoire :</strong> Sîra d'Ibn Hicham (Vol. 1, p. 133).", "<strong>Hadith :</strong> Musnad Ahmad (confirmant qu'il préférait ce pacte aux plus grands biens)."],
    6: ["<strong>Hadith :</strong> Jami' at-Tirmidhi (n°3620).", "❗️ <strong>Avis critique :</strong> Relaté par Ibn Ishaq. Tirmidhi et Al-Albani l'ont jugé bon/authentique, mais plusieurs grands critiques (Adh-Dhahabi, etc.) l'ont classé <strong>Munkar (rejeté) ou Da'if</strong> pour anomalies dans la chaîne et le récit."],
    7: ["<strong>Histoire :</strong> Sîra d'Ibn Hicham (Vol. 1, p. 189) ; Le Nectar Cacheté."],
    8: ["<strong>Hadith :</strong> Musnad Ahmad.", "<strong>Histoire :</strong> Sîra d'Ibn Hicham (Vol. 1, p. 192)."],
    9: ["<strong>Hadith :</strong> Ṣaḥīḥ al-Bukhārī (Livre du début de la Révélation, n°3) - Rapport de 'Aisha sur Hira."],
    10: ["<strong>Hadith :</strong> Ṣaḥīḥ al-Bukhārī (Livre de la Révélation, n°4 et n°4922) rapporté par Jabir..."],
    11: ["<strong>Hadith :</strong> Ṣaḥīḥ al-Bukhārī (Livre des Compagnons, sur les mérites de Khadija et Abu Bakr).", "<strong>Histoire :</strong> Sîra d'Ibn Hicham."],
    12: ["<strong>Histoire :</strong> Sîra d'Ibn Hicham (Vol. 1, p. 254) ; Le Nectar Cacheté (Da'wa)."],
    13: ["<strong>Hadith :</strong> Ṣaḥīḥ al-Bukhārī (Tafsir, n°4770).", "<strong>Histoire :</strong> Sîra Ibn Hicham pour les détails des oppressions."],
    14: ["<strong>Histoire :</strong> Sîra d'Ibn Hicham ; Fada'il as-Sahaba (Ibn Hanbal).", "<strong>Notes :</strong> Certains détails (récit de Ta-Ha) ont des chaînes discutées, mais acceptées en historiographie."],
    15: ["<strong>Hadith :</strong> Musnad Ahmad (Récit d'Oum Salama, chaîne authentifiée).", "<strong>Histoire :</strong> Sîra d'Ibn Hicham."],
    16: ["<strong>Hadith :</strong> Allusion dans Ṣaḥīḥ al-Bukhārī (n°1590).", "<strong>Histoire :</strong> Sîra d'Ibn Hicham."],
    17: ["<strong>Hadith :</strong> Ṣaḥīḥ al-Bukhārī (n°1360) (Mort d'Abu Talib).", "<strong>Histoire :</strong> Sîra d'Ibn Hicham."],
    18: ["<strong>Hadith :</strong> Ṣaḥīḥ al-Bukhārī (Début de la Création, n°3231) ('Aisha l'interrogeant sur Ta'if)."],
    19: ["<strong>Hadith :</strong> Ṣaḥīḥ al-Bukhārī (n°3887) et Ṣaḥīḥ Muslim (n°162).", "<strong>Coran :</strong> 17:1 et 53:13-18."],
    20: ["<strong>Histoire :</strong> Sîra d'Ibn Hicham ; Le Nectar Cacheté."],
    21: ["<strong>Hadith :</strong> Ṣaḥīḥ al-Bukhārī (Livre de la Foi, n°18) (Récit de 'Ubada)."],
    22: ["<strong>Hadith :</strong> Musnad Ahmad (Récit de Ka'b ibn Malik).", "<strong>Histoire :</strong> Sîra d'Ibn Hicham."],
    23: ["<strong>Hadith :</strong> Ṣaḥīḥ al-Bukhārī (Mérites des Emigrés, n°3905) (Voyage de la grotte).", "<strong>Histoire :</strong> Sîra d'Ibn Hicham."]
}

# We split the file into lines. We look for `id: X,` and then scan downwards until `bgImage:`, insert before it.
lines = text.split('\n')
new_lines = []

current_id = None
i = 0
while i < len(lines):
    line = lines[i]
    id_match = re.search(r'id:\s*(\d+),', line)
    if id_match:
        current_id = int(id_match.group(1))
    
    if current_id in sources_map and 'bgImage:' in line:
        # We need to insert sources before this line
        sources = sources_map[current_id]
        new_lines.append("    sources: [")
        for s in sources:
            new_lines.append(f"      \"{s}\",")
        new_lines.append("    ],")
        new_lines.append(line)
        current_id = None # reset
    else:
        new_lines.append(line)
    
    i += 1

with codecs.open('src/data/siraEvents.js', 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))

print("Fixed sources injection")
