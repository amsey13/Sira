<template>
  <div class="game-ui-container" tabindex="0" @keyup="handleKeydown" ref="gameContainer">
    <transition-group name="bg-fade" tag="div" class="background-layer">
      <div
        v-for="(evt, index) in evenements"
        :key="evt.id"
        v-show="activeIndex === index"
        class="bg-image"
        :style="{ backgroundImage: `url(${evt.bgImage})` }"
      ></div>
    </transition-group>

    <div class="vignette-overlay"></div>

    <div class="ui-layer">
      <div class="top-hud">
        <div class="mode-title">
          <span class="mode-icon"><i class="pi pi-book"></i></span>
          <h2>MODE HISTOIRE : PÉRIODE MÉCQUOISE</h2>
        </div>

        <div class="hud-right">
          <div class="progress-counter">
            CHAPITRE {{ activeIndex + 1 }} / {{ evenements.length }}
          </div>
          <button class="codex-btn" @click="showCodex = true">
            <i class="pi pi-compass"></i> CODEX TRIBAL
          </button>
        </div>
      </div>

      <div class="info-panel">
        <transition name="slide-up" mode="out-in">
          <div :key="activeEvent.id" class="chapter-content">
            <div class="chapter-meta">
              <span class="age-tag"><i class="pi pi-user"></i> Âge : {{ activeEvent.age }}</span>
              <span class="date-tag"><i class="pi pi-calendar"></i> {{ activeEvent.date }}</span>
              <span class="hijri-tag"><i class="pi pi-moon"></i> {{ activeEvent.dateH }}</span>
            </div>

            <h1 class="chapter-title">{{ activeEvent.titre }}</h1>

            <div class="chapter-tabs">
              <button :class="{ active: activeTab === 'recit' }" @click="activeTab = 'recit'">
                RÉCIT HISTORIQUE
              </button>
              <button :class="{ active: activeTab === 'persos' }" @click="activeTab = 'persos'">
                PERSONNAGES
              </button>
              <button :class="{ active: activeTab === 'lecons' }" @click="activeTab = 'lecons'">
                LEÇONS & SAGESSES
              </button>
              <button
                v-if="activeEvent.versets"
                :class="{ active: activeTab === 'versets' }"
                @click="activeTab = 'versets'"
              >
                VERSETS
              </button>
            </div>

            <div class="tab-content-area">
              <transition name="fade" mode="out-in">
                <div v-if="activeTab === 'recit'" class="tab-pane recit-pane" key="recit">
                  <p v-html="activeEvent.recit"></p>
                </div>

                <div v-else-if="activeTab === 'persos'" class="tab-pane persos-pane" key="persos">
                  <ul>
                    <li v-for="(perso, i) in activeEvent.personnages" :key="i">
                      <strong>{{ perso.nom }} :</strong> {{ perso.role }}
                    </li>
                  </ul>
                </div>

                <div v-else-if="activeTab === 'lecons'" class="tab-pane lecons-pane" key="lecons">
                  <ul>
                    <li v-for="(lecon, i) in activeEvent.lecons" :key="i">
                      <i
                        class="pi pi-star-fill"
                        style="color: #d97706; margin-right: 10px; font-size: 0.8rem"
                      ></i>
                      {{ lecon }}
                    </li>
                  </ul>
                </div>

                <div
                  v-else-if="activeTab === 'versets'"
                  class="tab-pane versets-pane"
                  key="versets"
                >
                  <div class="verset-box">
                    <i
                      class="pi pi-book"
                      style="font-size: 2rem; color: #d97706; margin-bottom: 15px"
                    ></i>
                    <p>{{ activeEvent.versets }}</p>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </transition>
      </div>

      <div class="chapter-selector-area">
        <div class="nav-controls">
          <button class="nav-btn prev-btn" @click="prevChapter" :disabled="activeIndex === 0">
            <i class="pi pi-angle-left"></i> Précédent
          </button>
          <div class="nav-hint">Flèches ◄ / ► pour naviguer</div>
          <button
            class="nav-btn next-btn"
            @click="nextChapter"
            :disabled="activeIndex === evenements.length - 1"
          >
            Suivant <i class="pi pi-angle-right"></i>
          </button>
        </div>
        <div class="track-container">
          <div class="track-line-bg"></div>
          <div class="track-line-fill" :style="{ width: progressPercentage }"></div>
          <div class="nodes-container">
            <div
              v-for="(evt, index) in evenements"
              :key="evt.id"
              class="node-wrapper"
              @click="setChapter(index)"
            >
              <div
                class="node-point"
                :class="{ active: activeIndex === index, completed: index < activeIndex }"
              >
                <div class="node-core"></div>
              </div>
              <div class="node-label" :class="{ 'active-label': activeIndex === index }">
                {{ evt.titreCourt }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="slide-left">
      <div v-if="showCodex" class="codex-overlay">
        <button class="close-codex" @click="showCodex = false">
          <i class="pi pi-times"></i> FERMER
        </button>
        <h2><i class="pi pi-compass"></i> CODEX : CONTEXTE PRÉ-ISLAMIQUE</h2>
        <div class="codex-content">
          <div class="codex-section">
            <h3>Les Empires Rivaux</h3>
            <p>
              La péninsule est coincée entre l'<strong>Empire Byzantin</strong> (Chrétien, au
              Nord-Ouest) et l'<strong>Empire Sassanide</strong> (Perse Zoroastrien, au Nord-Est).
              Au sud, le Yémen subit l'influence de l'Empire d'Abyssinie.
            </p>
          </div>
          <div class="codex-section">
            <h3>La Dégénérescence Religieuse</h3>
            <p>
              Le monothéisme pur d'Ibrahim et Ismaël a été corrompu par
              <strong>'Âmir b. Luhayy</strong> qui ramena l'idole <strong>Hubal</strong> de Syrie.
              Parmi les grandes déesses vénérées : Al-Lât (à Ta'if), Al-'Uzza et Manât.
            </p>
          </div>
          <div class="codex-section">
            <h3>Le Système Tribal Mecquois (Quraysh)</h3>
            <p>
              La Mecque n'a pas de roi. Elle est gérée par la tribu de Quraysh à travers
              <strong>19 fonctions honorifiques</strong> réparties entre les clans. Exemples : la
              <em>Siqâya</em> (gestion de l'eau) et la <em>Hijaba</em> (garde des clés de la Ka'ba).
            </p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const showCodex = ref(false)
const activeTab = ref('recit') // 'recit', 'persos', 'lecons', 'versets'

// Base de données : J'ai enrichi les 3 premiers pour te montrer le concept (Étape 1).
const evenements = ref([
  {
    id: 1,
    age: '50 jours avant la naissance',
    date: '570 apr. J.-C.',
    dateH: "53 av. l'Hégire",
    titreCourt: "L'Éléphant",
    titre: "L'Année de l'Éléphant",
    recit:
      "Abraha, gouverneur du Yémen, marche sur La Mecque avec une armée d'éléphants pour détruire la Ka'ba. Aux abords de la ville, il confisque les troupeaux des Mecquois. 'Abd al-Muttalib, le grand-père du Prophète et chef de La Mecque, vient à sa rencontre.<br><br>Abraha s'attend à ce qu'il le supplie d'épargner la Ka'ba, mais 'Abd al-Muttalib réclame seulement ses 200 chameaux confisqués. Étonné, Abraha le méprise, ce à quoi 'Abd al-Muttalib répond par cette phrase historique : <em>« Je suis le Maître de mes chameaux. Quant à cette Maison, elle a un Maître qui la protègera. »</em><br><br>Dieu envoie des oiseaux (Ababil) jetant des pierres , anéantissant l'armée.",
    personnages: [
      {
        nom: 'Abraha Al-Ashram',
        role: 'Gouverneur tyran voulant forcer les Arabes à pèleriner dans sa cathédrale à Sanaa.',
      },
      {
        nom: "'Abd al-Muttalib",
        role: 'Grand-père du Prophète. Son attitude montre une confiance aveugle en la protection divine du sanctuaire.',
      },
    ],
    lecons: [
      "La protection de la Ka'ba est garantie par Allah, préparant le terrain religieux pour la naissance imminente du Prophète de l'Islam.",
    ],
    versets:
      "Sourate Al-Fîl (L'Éléphant - 105) : « N'as-tu pas vu comment ton Seigneur a agi envers les gens de l'Éléphant ? »",
    bgImage:
      'https://images.unsplash.com/photo-1542308168-b7e1273919e1?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 2,
    age: '0 an',
    date: '571 apr. J.-C.',
    dateH: "53 av. l'Hégire",
    titreCourt: 'Naissance',
    titre: "La Naissance de l'Élu",
    recit:
      "Le Prophète Muhammad (PBSL) naît à La Mecque un lundi, le 9 ou le 12 du mois de Rabi' Al-Awwal. Son père, Abdullah, est décédé lors d'un voyage commercial à Yathrib (Médine) alors que sa mère Amina était encore enceinte de deux mois.<br><br>Selon la coutume, il est confié à une nourrice bédouine du désert pour le fortifier physiquement et lui faire acquérir la pureté de la langue arabe.",
    personnages: [
      { nom: 'Amina bint Wahb', role: 'Mère du Prophète, du clan Banu Zuhrah.' },
      {
        nom: "Halîma as-Sa'diyya",
        role: "Sa nourrice bédouine de la tribu des Bani Sa'd. Dès qu'elle l'allaite, une immense bénédiction (Baraka) touche son foyer affamé.",
      },
    ],
    lecons: [
      "Le statut d'orphelin dès la naissance prépare le Prophète à ne dépendre que d'Allah.",
      "L'immersion dans le désert forge sa robustesse et son éloquence légendaire.",
    ],
    versets:
      "Sourate Ad-Duha (Le Jour Montant - 93:6) : « Ne t'a-t-Il pas trouvé orphelin ? Alors Il t'a accueilli ! »",
    bgImage:
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 3,
    age: '4 ans',
    date: 'Vers 575 apr. J.-C.',
    dateH: "49 av. l'Hégire",
    titreCourt: 'Purification',
    titre: "L'Ouverture de la Poitrine",
    recit:
      "Alors qu'il a environ 4 ans et joue avec ses frères de lait dans le désert, l'ange Jibril descend, l'allonge et lui ouvre la poitrine. L'ange extrait son cœur, en retire un caillot noir en disant : <em>« Ceci est la part de Satan en toi »</em>.<br><br>Il lave ensuite son cœur avec de l'eau de Zamzam dans une coupe en or avant de le remettre à sa place.",
    personnages: [
      {
        nom: 'Jibril (Gabriel)',
        role: "L'Archange chargé de cette purification spirituelle et physique.",
      },
      {
        nom: "Halîma as-Sa'diyya",
        role: 'Effrayée par cet événement raconté par les autres enfants, elle décide de rendre Muhammad à sa mère pour le protéger.',
      },
    ],
    lecons: [
      "Préparation à l'infaillibilité prophétique (Al-'Isma) face aux futures tentations polythéistes.",
    ],
    versets:
      "Sourate Ash-Sharh (L'Ouverture - 94:1) : « N'avons-Nous pas ouvert pour toi ta poitrine ? »",
    bgImage:
      'https://images.unsplash.com/photo-1506744626753-143d67b84db4?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 4,
    age: '6 ans',
    date: '577 apr. J.-C.',
    dateH: "47 av. l'Hégire",
    titreCourt: 'Orphelin',
    titre: "Le Décès d'Amina",
    recit:
      "Sa mère l'emmène à Yathrib (Médine) pour se recueillir sur la tombe de son mari Abdullah. Sur le chemin du retour, Amina tombe gravement malade et meurt à Al-Abwa, sous les yeux de l'enfant.<br><br>La servante Oum Ayman ramène le jeune Muhammad à La Mecque. Il devient doublement orphelin et est recueilli par son grand-père bien-aimé.",
    personnages: [
      {
        nom: 'Oum Ayman (Barakah)',
        role: "Servante abyssinienne fidèle. Le Prophète dira : 'Elle est ma mère après ma mère'.",
      },
      {
        nom: "'Abd al-Muttalib",
        role: "Le grand-père qui entoure l'orphelin d'une immense affection, le plaçant à ses côtés sur son tapis sacré.",
      },
    ],
    lecons: [
      'La perte successive de ses parents développe en lui une empathie et une miséricorde uniques envers les faibles et les orphelins.',
    ],
    versets: null,
    bgImage:
      'https://images.unsplash.com/photo-1518281361980-b26bfd556770?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 5,
    age: '8 ans',
    date: '579 apr. J.-C.',
    dateH: "45 av. l'Hégire",
    titreCourt: 'Abu Talib',
    titre: "La Tutelle d'Abu Talib",
    recit:
      "Le patriarche 'Abd al-Muttalib décède. Avant de mourir, il confie la garde de l'enfant à Abu Talib, oncle paternel du Prophète. Bien que pauvre et père de nombreux enfants, Abu Talib le traitera mieux que sa propre chair.",
    personnages: [
      {
        nom: 'Abu Talib',
        role: "Nouveau chef des Banu Hashim. Il protégera Muhammad contre l'oligarchie mecquoise pendant 40 ans.",
      },
    ],
    lecons: [
      "Dieu choisit un homme influent et intègre pour assurer la sécurité tribale de son futur Prophète, malgré la pauvreté matérielle d'Abu Talib.",
    ],
    versets: null,
    bgImage:
      'https://images.unsplash.com/photo-1469502157075-fdfcb397b958?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 6,
    age: '12 ans',
    date: '583 apr. J.-C.',
    dateH: "41 av. l'Hégire",
    titreCourt: 'Bahira',
    titre: 'Le Moine de Syrie',
    recit:
      "Lors d'un voyage marchand vers la Syrie, la caravane s'arrête à Busra. Le moine chrétien Bahira, reclus dans son monastère, remarque qu'un nuage protège un jeune garçon et que les arbres s'inclinent sur son passage.<br><br>Il invite la tribu, examine le dos du jeune Muhammad et y trouve le Sceau de la Prophétie. Il avertit solennellement Abu Talib : <em>« Retourne avec ton neveu dans son pays et protège-le des Romains et des Juifs, car un destin immense l'attend. »</em>",
    personnages: [
      {
        nom: 'Bahira',
        role: "Moine savant ayant accès aux manuscrits anciens annonçant l'arrivée du Paraclet/Prophète.",
      },
    ],
    lecons: [
      'La venue du Prophète était prophétisée et attendue par les pieux savants parmi les Gens du Livre.',
    ],
    versets:
      "Sourate Al-A'raf (7:157) : « ...le Prophète illettré qu'ils trouvent écrit chez eux dans la Thora et l'Évangile. »",
    bgImage:
      'https://images.unsplash.com/photo-1527684651001-731c474aaf5a?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 7,
    age: '15 ans',
    date: '586 apr. J.-C.',
    dateH: "38 av. l'Hégire",
    titreCourt: 'Fidjar',
    titre: 'La Guerre de Sacrilège',
    recit:
      "Une guerre éclate entre Quraysh et la tribu de Qays 'Aylan durant les mois sacrés (d'où le nom de guerre de Fidjar / Sacrilège). Le jeune Muhammad y participe mais Dieu préserve ses mains du sang : il ne tue personne, se contentant de ramasser les flèches pour ses oncles.",
    personnages: [
      {
        nom: 'Les tribus belligérantes',
        role: "Mettent en pause les règles sacrées de l'Arabie par fierté tribale.",
      },
    ],
    lecons: [
      "Dieu l'expose aux dures réalités politiques et militaires de son époque, tout en préservant son innocence spirituelle et physique.",
    ],
    versets: null,
    bgImage:
      'https://images.unsplash.com/photo-1589311099277-2f349edb5a19?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 8,
    age: '20 ans',
    date: '591 apr. J.-C.',
    dateH: "33 av. l'Hégire",
    titreCourt: 'Al-Fudul',
    titre: 'Le Pacte des Vertueux',
    recit:
      "Un marchand étranger (yéménite) est escroqué à La Mecque. Face à cette injustice, plusieurs chefs de clans se réunissent chez 'Abdullah ibn Jud'an. Ils jurent de s'allier pour défendre tout opprimé, citoyen ou étranger, contre n'importe quel oppresseur.<br><br>Le Prophète participe à ce pacte d'équité (Al-Fudul) qu'il considèrera, même devenu Prophète, comme supérieur aux chameaux rouges (la plus grande richesse).",
    personnages: [
      {
        nom: "Al-'As ibn Wa'il",
        role: 'Le notable malhonnête qui avait confisqué la marchandise, déclenchant cette prise de conscience.',
      },
    ],
    lecons: [
      "L'Islam soutient et s'associe à toute initiative juste de la société civile, même si elle émane de non-musulmans.",
    ],
    versets: null,
    bgImage:
      'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 9,
    age: '25 ans',
    date: '596 apr. J.-C.',
    dateH: "28 av. l'Hégire",
    titreCourt: 'Khadija',
    titre: 'Mariage avec Khadija',
    recit:
      "Surnommé Al-Amîn (Le digne de confiance), il est mandaté par Khadija, riche veuve d'affaires, pour diriger sa caravane vers la Syrie. Impressionnée par les immenses profits et par le récit de son serviteur Maysara sur sa noblesse de caractère, elle lui fait proposer le mariage.<br><br>Elle a 40 ans, il en a 25. La dot est de 20 chamelles. Ce mariage profond et monogame durera un quart de siècle.",
    personnages: [
      {
        nom: 'Khadija bint Khuwaylid',
        role: "Épouse d'exception, elle lui donnera 6 enfants (dont Fatima et Zaynab) et sera son plus grand pilier moral.",
      },
      {
        nom: 'Maysara',
        role: 'Le serviteur qui a témoigné des miracles et de la droiture de Muhammad sur la route.',
      },
    ],
    lecons: [
      "L'honnêteté dans le travail (Al-Amana) est la clé de la réussite et du respect social avant même la révélation.",
    ],
    versets: null,
    bgImage:
      'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=2076&auto=format&fit=crop',
  },
  {
    id: 10,
    age: '35 ans',
    date: '606 apr. J.-C.',
    dateH: "18 av. l'Hégire",
    titreCourt: "La Ka'ba",
    titre: "L'Arbitrage de la Pierre Noire",
    recit:
      "Des inondations forcent la reconstruction de la Ka'ba. Lorsqu'il faut replacer la Pierre Noire sacrée, les clans de Quraysh sont prêts à s'entretuer pour s'accaparer l'honneur. Un vieillard propose : <em>'Le premier qui franchit cette porte sera notre arbitre'</em>.<br><br>C'est Muhammad. Tous s'écrient : <em>'C'est Al-Amîn, nous sommes satisfaits !'</em>. Avec une diplomatie brillante, il place la pierre au centre de son manteau et demande à chaque chef de clan d'en tenir un bord pour la soulever ensemble.",
    personnages: [
      {
        nom: 'Al-Walid ibn al-Mughira',
        role: "Le doyen des Quraysh qui eut la sagesse de proposer le tirage au sort de l'arbitre.",
      },
    ],
    lecons: [
      "Le leadership par la sagesse et le compromis pacifique, évitant l'effusion de sang arabe.",
    ],
    versets: null,
    bgImage:
      'https://images.unsplash.com/photo-1565552643922-b25b6826dc6a?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 11,
    age: '40 ans',
    date: '610 apr. J.-C.',
    dateH: "13 av. l'Hégire",
    titreCourt: 'Révélation',
    titre: 'Iqra : La Grotte de Hira',
    recit:
      "Fuyant l'idolâtrie et la décadence, il s'isole régulièrement dans la grotte de Hira. Pendant le Ramadan de l'an 610, l'Archange Jibril surgit et lui ordonne : <em>« Iqra (Lis !) »</em>. Le Prophète, illettré, est terrifié.<br><br>Il rentre chez lui tremblant, demandant à Khadija de l'envelopper. Elle le rassure : <em>« Jamais Dieu ne te perdra, car tu maintiens les liens de parenté et tu soutiens les faibles. »</em> Elle l'emmène voir son cousin Waraqa qui confirme la Prophétie.",
    personnages: [
      {
        nom: 'Waraqa ibn Nawfel',
        role: "Cousin chrétien aveugle. Il lui annonce : 'C'est le Nâmus (Ange) de Moïse. Ton peuple te chassera.'",
      },
    ],
    lecons: [
      "La Révélation est une charge lourde et effrayante. L'importance cruciale de l'épouse dans le soutien psychologique.",
    ],
    versets: 'Sourate Al-Alaq (96:1-5) : « Lis, au nom de ton Seigneur qui a créé... »',
    bgImage:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop',
  },
  {
    id: 12,
    age: '40 à 43 ans',
    date: '610 - 613 apr. J.',
    dateH: "13 à 10 av. l'Hégire",
    titreCourt: 'Appel Secret',
    titre: 'La Maison de Dar Al Arqam',
    recit:
      "Pendant trois ans, l'appel à l'Islam se fait secrètement (Da'wa privée). L'objectif est de bâtir un noyau dur et éduqué. Les premiers musulmans (environ 60 personnes) se réunissent clandestinement dans la maison d'Al Arqam, située près du mont Safa, pour prier et apprendre le Coran.",
    personnages: [
      {
        nom: 'Abu Bakr as-Siddiq',
        role: "Le premier homme adulte à embrasser l'Islam, il convertira la crème des futurs compagnons.",
      },
      {
        nom: 'Ali ibn Abi Talib & Zayd ibn Haritha',
        role: 'Le premier enfant (10 ans) et le premier affranchi à se convertir.',
      },
    ],
    lecons: [
      "La construction d'une Foi solide dans le secret est prioritaire avant la confrontation publique avec une société hostile.",
    ],
    versets:
      "Sourate Al-Muddathir (74:1-2) : « Ô toi, le revêtu d'un manteau ! Lève-toi et avertis ! »",
    bgImage:
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 13,
    age: '43 ans',
    date: '613 apr. J.-C.',
    dateH: "10 av. l'Hégire",
    titreCourt: 'Appel Public',
    titre: 'Le Mont Safa et les Tortures',
    recit:
      "L'ordre divin de prêcher publiquement tombe. Le Prophète alerte les clans de Quraysh depuis le Mont Safa. Son oncle, Abu Lahab, l'insulte publiquement. C'est la rupture.<br><br>La guerre psychologique commence, suivie très vite par des tortures atroces ciblées sur les esclaves et les plus faibles, afin d'étouffer le message de l'Unicité (Tawhid) qui menace l'économie des idoles.",
    personnages: [
      {
        nom: 'Bilal & Khabbab',
        role: "Torturés sur le sable brûlant. Bilal ne cesse de répéter : 'Ahad ! Ahad !' (Il est Unique !).",
      },
      {
        nom: 'La Famille de Yassir',
        role: "Torturée par Abu Jahl. Sumayya, la mère, est empalée et devient la première martyre de l'Islam.",
      },
    ],
    lecons: [
      "La patience (Sabr) absolue est ordonnée. Le Prophète promet : 'Patience ô famille de Yassir, votre rendez-vous est le Paradis'.",
    ],
    versets: "Sourate Al-Masad (111) : « Que périssent les deux mains d'Abu Lahab... »",
    bgImage:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 14,
    age: '45 ans',
    date: '615 apr. J.-C.',
    dateH: "7 av. l'Hégire",
    titreCourt: 'Abyssinie',
    titre: "L'Exil vers le Négus",
    recit:
      "Pour sauver les croyants des tortures, le Prophète leur ordonne d'émigrer en Abyssinie (Éthiopie), <em>'où règne un roi auprès duquel personne n'est opprimé'</em>. Deux vagues d'émigration s'y rendent (83 hommes, 18 femmes).<br><br>Les Quraysh exigent leur extradition. Ja'far ibn Abi Talib prend la parole devant le Négus chrétien, décrit l'ignorance préislamique et lit le début de la sourate Maryam. Le Négus pleure et jure de ne jamais les livrer.",
    personnages: [
      { nom: "Ja'far ibn Abi Talib", role: 'Le porte-parole magistral des musulmans en exil.' },
      {
        nom: 'Le Négus (Ashama)',
        role: "Roi juste qui reconnaîtra la vérité de l'Islam à travers l'hommage rendu à Marie et Jésus dans le Coran.",
      },
      {
        nom: 'Hamza & Omar',
        role: 'À La Mecque, ces deux colosses se convertissent, changeant le rapport de force.',
      },
    ],
    lecons: [
      "La recherche d'alliances justes au-delà des frontières. La puissance d'un dialogue interreligieux basé sur le respect.",
    ],
    versets: 'Sourate Maryam (19), récitée majestueusement devant le clergé chrétien.',
    bgImage:
      'https://images.unsplash.com/photo-1505322022379-7c3353ee6291?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 15,
    age: '47 à 50 ans',
    date: '617 - 620 apr. J.',
    dateH: "6 à 3 av. l'Hégire",
    titreCourt: 'Le Blocus',
    titre: "L'Embargo du Ravin",
    recit:
      "Paniqués par l'expansion de l'Islam, les Mecquois rédigent un pacte d'excommunication totale contre les Banu Hashim : interdiction de mariage, de commerce et d'aide alimentaire. Le pacte est suspendu dans la Ka'ba.<br><br>Pendant 3 ans, le clan du Prophète est confiné dans le ravin d'Abu Talib. La famine est telle qu'on entend les cris des enfants affamés. Les musulmans survivent en mangeant des feuilles et des peaux bouillies.",
    personnages: [
      {
        nom: "Mut'im ibn 'Adi et Hisham ibn 'Amr",
        role: "Polytéistes dotés de morale qui brisent l'embargo par humanité.",
      },
    ],
    lecons: [
      "Le triomphe spirituel sur le blocus matériel. Le pacte injuste est dévoré par les termites, à l'exception de l'en-tête 'Bismika Allahumma' (En Ton nom, Ô Allah).",
    ],
    versets: null,
    bgImage:
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2076&auto=format&fit=crop',
  },
  {
    id: 16,
    age: '47 ans',
    date: 'Vers 617 apr. J.-C.',
    dateH: "5 av. l'Hégire",
    titreCourt: "Bu'ath",
    titre: "La Guerre de Bu'ath à Yathrib",
    recit:
      "Pendant que les musulmans subissent le blocus à La Mecque, la ville de Yathrib (Médine), située à 400 km de là, s'autodétruit. Une guerre civile d'une violence inouïe (la Bataille de Bu'ath) ravage les tribus Aws et Khazraj.<br><br>Leurs chefs militaires sont décimés, plongeant la ville dans le sang et le désespoir le plus total.",
    personnages: [
      {
        nom: 'Aws et Khazraj',
        role: 'Les deux grandes tribus arabes de Médine, épuisées par des décennies de conflits fratricides manipulés par les tribus juives environnantes.',
      },
    ],
    lecons: [
      "Aïcha dira plus tard : 'Le jour de Bu'ath est un jour qu'Allah a préparé pour Son Messager'. Cette tragédie a préparé psychologiquement les Médinois à accepter un pacificateur extérieur.",
    ],
    versets: null,
    bgImage:
      'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 17,
    age: '50 ans',
    date: '620 apr. J.-C.',
    dateH: "3 av. l'Hégire",
    titreCourt: 'Tristesse',
    titre: "L'Année de la Tristesse",
    recit:
      "Le blocus est levé, mais deux catastrophes frappent le Prophète. Son oncle Abu Talib, son protecteur politique intouchable, décède.<br><br>Quelques semaines plus tard, c'est son épouse Khadija qui meurt. Elle était son havre de paix et la financière de l'Islam. Sans la protection tribale d'Abu Talib, le Prophète devient la cible d'agressions physiques dans les rues de La Mecque.",
    personnages: [
      {
        nom: 'Abu Lahab',
        role: 'Prend la tête du clan Hashim et retire la protection de Muhammad, autorisant son sang à couler.',
      },
    ],
    lecons: [
      "En le privant de tout soutien terrestre, Dieu purifie le cœur de Son Messager pour qu'il ne dépende exclusivement que de Lui.",
    ],
    versets: null,
    bgImage:
      'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 18,
    age: '50 ans',
    date: '620 apr. J.-C.',
    dateH: "3 av. l'Hégire",
    titreCourt: "Ta'if",
    titre: "L'Épreuve de Ta'if et le Réconfort",
    recit:
      "Le Prophète marche jusqu'à Ta'if (tribu Thaqif) pour y chercher protection. Les chefs le rejettent avec mépris et le font lapider. Ses chaussures se remplissent de sang. Il trouve refuge dans un verger et prononce son invocation déchirante : <em>'Ô Allah, c'est à Toi que je me plains de ma faiblesse...'</em>." +
      "<br> Sur le chemin du retour, dans la vallée de Nakhla, un groupe de Djinns s'arrête, écoute le Coran récité en prière et se convertit.",
    personnages: [
      {
        nom: "'Addas",
        role: "Esclave chrétien originaire de Ninive dont la conversion réchauffe le cœur de l'Élu.",
      },
      {
        nom: 'Zayd ibn Haritha',
        role: 'Tentait de protéger le Prophète des pierres avec son propre corps.',
      },
    ],
    lecons: [
      "Le Prophète refuse la proposition de l'Ange des montagnes d'écraser la Mecque. C'est l'apogée de sa miséricorde.",
    ],
    versets: 'Sourate Al-Ahqaf (46:29) : Révélation sur la conversion des Djinns à Nakhla.',
    bgImage:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop',
  },
  {
    id: 19,
    age: '51 ans',
    date: '621 apr. J.-C.',
    dateH: "2 av. l'Hégire",
    titreCourt: 'Al-Isra',
    titre: "Le Voyage Nocturne (Isra & Mi'raj)",
    recit:
      "L'honneur céleste absolu survient après l'humiliation totale de Ta'if. L'Archange Jibril vient avec la monture ailée Al-Buraq. Le Prophète voyage de nuit (Al-Isra) de La Mecque jusqu'à Jérusalem, où il dirige une prière devant tous les Prophètes.<br><br>Il entame ensuite son Ascension (Al-Mi'raj) à travers les 7 cieux, jusqu'au 'Jujubier de la Limite', là où même les anges ne peuvent accéder.",
    personnages: [
      {
        nom: 'Abu Bakr',
        role: "Il valide le récit publiquement le lendemain en disant 'S'il l'a dit, c'est la vérité', gagnant le titre de 'As-Siddiq' (Le Véridique).",
      },
    ],
    lecons: [
      "Dieu offre au Prophète le commandement spirituel de l'Humanité. Institution des 5 prières quotidiennes, don direct d'Allah.",
    ],
    versets:
      'Sourate Al-Isra (17:1) : « Gloire à Celui qui de nuit, fit voyager Son serviteur de la Mosquée Sacrée à la Mosquée Al-Aqsa... »',
    bgImage:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 20,
    age: '51 ans',
    date: '621 apr. J.-C.',
    dateH: "2 av. l'Hégire",
    titreCourt: 'Yathrib',
    titre: 'Les 6 hommes de Khazraj',
    recit:
      "Pendant le pèlerinage à La Mecque, le Prophète rencontre six jeunes nobles de la tribu de Khazraj venant de Yathrib. Épuisés par les conséquences de la guerre de Bu'ath, et connaissant les prophéties d'un envoyé imminent par les Juifs de leur ville, ils l'écoutent avec attention.<br><br>Ils se convertissent immédiatement en se disant : <em>'Peut-être que Dieu nous unira à nouveau grâce à lui !'</em>. Ils retournent à Yathrib comme les premiers semeurs de l'Islam.",
    personnages: [
      {
        nom: "As'ad ibn Zurara",
        role: "L'un des six jeunes hommes qui deviendra le grand leader de la conversion de Médine.",
      },
    ],
    lecons: [
      "L'espoir jaillit souvent d'endroits inattendus. Les cœurs brisés par la guerre civile de Bu'ath étaient les plus réceptifs à la paix de l'Islam.",
    ],
    versets: null,
    bgImage:
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 21,
    age: '52 ans',
    date: '621 apr. J.-C.',
    dateH: "1 av. l'Hégire",
    titreCourt: '1er Serment',
    titre: "Le Premier Serment d'Aqaba",
    recit:
      "Un an plus tard, 12 hommes de Yathrib (Aws et Khazraj réunis) reviennent. Dans la vallée d'Aqaba à La Mecque, ils prêtent allégeance au Prophète sur des bases strictement morales : ne rien associer à Dieu, ne pas voler, ne pas tuer leurs enfants.<br><br>Ce pacte est appelé 'Le Pacte des femmes'. Le Prophète leur envoie Mus'ab ibn 'Umayr comme ambassadeur.",
    personnages: [
      {
        nom: "Mus'ab ibn 'Umayr",
        role: "Jeune mecquois brillant envoyé à Médine. Il convertira l'élite de la ville par sa douceur et le Coran.",
      },
    ],
    lecons: [
      "La foi et l'éducation (Tarbiyya) par l'enseignement du Coran sont les fondations préalables à la construction de tout état.",
    ],
    versets:
      'Sourate Al-Mumtahanah (60:12) : Verset reprenant les mêmes clauses éthiques que ce serment.',
    bgImage:
      'https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 22,
    age: '53 ans',
    date: '622 apr. J.-C.',
    dateH: "Quelques mois av. l'Hégire",
    titreCourt: '2ème Serment',
    titre: 'Le Second Serment (Pacte de Guerre)',
    recit:
      "Grâce au travail de Mus'ab, l'Islam inonde Yathrib. Lors du pèlerinage, 73 hommes et 2 femmes rencontrent secrètement le Prophète de nuit.<br><br>Ils concluent le 'Pacte de la Guerre' : ils jurent sur leur sang de protéger le Prophète et les musulmans mecquois, s'ils émigrent chez eux, avec autant de ferveur qu'ils protègeraient leurs propres épouses et enfants. L'oncle du Prophète, Al-'Abbas (encore polythéiste), valide l'engagement.",
    personnages: [
      {
        nom: "Al-'Abbas ibn 'Abd al-Muttalib",
        role: "Il prend la parole pour exiger des Médinois une protection inconditionnelle ou l'abandon du projet.",
      },
    ],
    lecons: [
      "Le transfert du centre de gravité de l'Islam : La Mecque va être vidée de ses croyants au profit d'un état naissant et souverain.",
    ],
    versets: null,
    bgImage:
      'https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 23,
    age: '53 ans',
    date: '622 apr. J.-C.',
    dateH: "An 1 de l'Hégire",
    titreCourt: "L'Hégire",
    titre: "Le Grand Exil (L'Hégire)",
    recit:
      "Apprenant ces pactes, Quraysh panique. L'assemblée réunie à 'Dar Al-Nadwa' décide de faire tuer le Prophète par un commando composé d'un jeune de chaque clan.<br><br>La Révélation l'avertit. Le Prophète part la nuit, jetant du sable sur les assassins endormis. Il se cache 3 jours dans la Grotte de Thawr avec Abu Bakr (protégés par la toile d'une araignée et le nid d'un pigeon) avant de faire route vers Médine. C'est la fin de la période mecquoise.",
    personnages: [
      {
        nom: 'Ali ibn Abi Talib',
        role: 'Dort dans le lit du Prophète avec son manteau pour tromper les assassins.',
      },
      {
        nom: 'Asma bint Abi Bakr',
        role: "Elle ravitaille la grotte au péril de sa vie, gagnant le nom de 'Celle aux deux ceintures'.",
      },
      {
        nom: 'Suraqah ibn Malik',
        role: "Le chasseur de primes dont le cheval s'enfonce dans le sol à 3 reprises en tentant de les capturer.",
      },
    ],
    lecons: [
      "Tawakkul (Confiance totale en Dieu : 'Ne t'attriste pas, Allah est avec nous') combinée à une stratégie minutieuse humaine.",
    ],
    versets:
      "Sourate At-Tawbah (9:40) : « Si vous ne lui portez pas secours... Allah l'a déjà secouru... »",
    bgImage:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop',
  },
])

const activeIndex = ref(0)
const activeEvent = computed(() => evenements.value[activeIndex.value])
const progressPercentage = computed(() =>
  evenements.value.length <= 1
    ? '0%'
    : (activeIndex.value / (evenements.value.length - 1)) * 100 + '%',
)

const setChapter = (index) => {
  activeIndex.value = index
  activeTab.value = 'recit'
}
const nextChapter = () => {
  if (activeIndex.value < evenements.value.length - 1) {
    activeIndex.value++
    activeTab.value = 'recit'
  }
}
const prevChapter = () => {
  if (activeIndex.value > 0) {
    activeIndex.value--
    activeTab.value = 'recit'
  }
}

// Reset l'onglet sur "récit" à chaque changement de chapitre
watch(activeIndex, () => {
  activeTab.value = 'recit'
})

const handleKeydown = (e) => {
  // Navigation
  if (e.key === 'ArrowRight') nextChapter()
  if (e.key === 'ArrowLeft') prevChapter()
  // Menu Codex
  if (e.key === 'Escape') showCodex.value = false
}

const gameContainer = ref(null)
onMounted(() => {
  if (gameContainer.value) gameContainer.value.focus()
})
</script>

<style scoped>
/* Reset global */
.game-ui-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #050505;
  font-family: 'Inter', sans-serif;
  color: #fff;
  outline: none;
}

/* Couches d'images */
.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  animation: slowPan 30s linear infinite alternate;
}
@keyframes slowPan {
  0% {
    transform: scale(1) translate(0, 0);
  }
  100% {
    transform: scale(1.1) translate(-1%, -1%);
  }
}
.bg-fade-enter-active,
.bg-fade-leave-active {
  transition: opacity 1.2s ease-in-out;
}
.bg-fade-enter-from,
.bg-fade-leave-to {
  opacity: 0;
}

.vignette-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background:
    linear-gradient(90deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.8) 45%, rgba(0, 0, 0, 0) 100%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.4) 30%, rgba(0, 0, 0, 0) 100%);
}
.ui-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Top HUD */
.top-hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 60px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
}
.mode-title {
  display: flex;
  align-items: center;
  gap: 15px;
}
.mode-icon {
  background: #d97706;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 1.2rem;
}
.mode-title h2 {
  margin: 0;
  font-size: 1.2rem;
  letter-spacing: 4px;
  color: #e4e4e7;
}
.hud-right {
  display: flex;
  align-items: center;
  gap: 30px;
}
.progress-counter {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.2rem;
  font-weight: bold;
  color: #d97706;
  letter-spacing: 2px;
}

/* Bouton Codex */
.codex-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.2s;
  letter-spacing: 2px;
}
.codex-btn:hover {
  background: #d97706;
  border-color: #fcd34d;
}

/* Overlay Codex */
.codex-overlay {
  position: absolute;
  top: 0;
  right: 0;
  width: 500px;
  height: 100%;
  background: rgba(15, 15, 15, 0.95);
  border-left: 2px solid #d97706;
  z-index: 10;
  padding: 40px;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
}
.close-codex {
  align-self: flex-end;
  background: none;
  border: none;
  color: #a1a1aa;
  cursor: pointer;
  font-size: 1rem;
  letter-spacing: 2px;
  margin-bottom: 30px;
}
.close-codex:hover {
  color: #ef4444;
}
.codex-overlay h2 {
  color: #fcd34d;
  font-size: 1.5rem;
  border-bottom: 1px solid #3f3f46;
  padding-bottom: 15px;
  margin-bottom: 30px;
}
.codex-section {
  margin-bottom: 30px;
}
.codex-section h3 {
  color: #d97706;
  font-size: 1.1rem;
  margin-bottom: 10px;
}
.codex-section p {
  color: #d4d4d8;
  line-height: 1.6;
  font-size: 0.95rem;
}
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.4s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(100%);
}

/* Info Panel */
.info-panel {
  flex: 1;
  padding: 20px 60px;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.chapter-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 0.85rem;
  font-weight: bold;
  letter-spacing: 1px;
}
.age-tag {
  color: #fcd34d;
  background: rgba(217, 119, 6, 0.2);
  padding: 5px 12px;
  border-radius: 4px;
  border: 1px solid #d97706;
}
.date-tag,
.hijri-tag {
  color: #a1a1aa;
  background: rgba(255, 255, 255, 0.1);
  padding: 5px 12px;
  border-radius: 4px;
}

.chapter-title {
  font-size: 4rem;
  font-weight: 900;
  margin: 0 0 20px 0;
  font-family: 'Merriweather', serif;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
}

/* Onglets */
.chapter-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 10px;
}
.chapter-tabs button {
  background: none;
  border: none;
  color: #a1a1aa;
  font-weight: bold;
  letter-spacing: 2px;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 10px 15px;
  transition: 0.2s;
  border-radius: 4px;
}
.chapter-tabs button:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}
.chapter-tabs button.active {
  color: #d97706;
  background: rgba(217, 119, 6, 0.15);
  border-bottom: 2px solid #d97706;
}

/* Contenu des onglets */
.tab-content-area {
  min-height: 200px;
}
.tab-pane p {
  font-size: 1.2rem;
  line-height: 1.7;
  color: #e4e4e7;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.8);
}
.tab-pane ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.tab-pane li {
  margin-bottom: 15px;
  color: #d4d4d8;
  font-size: 1.1rem;
  line-height: 1.6;
  background: rgba(0, 0, 0, 0.4);
  padding: 15px;
  border-radius: 6px;
  border-left: 3px solid #d97706;
}
.verset-box {
  background: rgba(217, 119, 6, 0.1);
  border: 1px solid #d97706;
  padding: 25px;
  border-radius: 8px;
  text-align: center;
}
.verset-box p {
  font-family: 'Merriweather', serif;
  font-size: 1.3rem;
  font-style: italic;
  color: #fcd34d;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Timeline (Bas) - Identique à avant */
.chapter-selector-area {
  padding: 30px 60px 50px 60px;
  background: linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, transparent 100%);
}
.nav-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.nav-hint {
  color: #71717a;
  font-size: 0.9rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.nav-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 10px 25px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: 0.2s;
  border-radius: 4px;
}
.nav-btn:hover:not(:disabled) {
  background: #d97706;
  border-color: #fcd34d;
}
.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.track-container {
  position: relative;
  height: 60px;
  display: flex;
  align-items: center;
}
.track-line-bg {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-50%);
  z-index: 0;
}
.track-line-fill {
  position: absolute;
  top: 50%;
  left: 0;
  height: 4px;
  background-color: #d97706;
  transform: translateY(-50%);
  z-index: 1;
  transition: width 0.6s;
  box-shadow: 0 0 10px #d97706;
}
.nodes-container {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.node-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 20px;
}
.node-point {
  width: 16px;
  height: 16px;
  background-color: #18181b;
  border: 2px solid #52525b;
  transform: rotate(45deg);
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.node-core {
  width: 6px;
  height: 6px;
  background-color: #a1a1aa;
  opacity: 0;
  transition: 0.3s;
}
.node-point.completed {
  border-color: #d97706;
  background-color: #78350f;
}
.node-point.active {
  background-color: #fef3c7;
  border-color: #fff;
  transform: rotate(45deg) scale(1.6);
  box-shadow: 0 0 20px rgba(217, 119, 6, 0.8);
}
.node-point.active .node-core {
  opacity: 1;
  background-color: #d97706;
}
.node-label {
  position: absolute;
  top: -35px;
  font-size: 0.75rem;
  font-weight: bold;
  color: #a1a1aa;
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(10px);
  transition: 0.3s;
  pointer-events: none;
}
.node-label.active-label {
  opacity: 1;
  color: #fff;
  transform: translateY(0);
}
.node-wrapper:hover .node-point {
  transform: rotate(45deg) scale(1.4);
  border-color: #fff;
}
.node-wrapper:hover .node-label {
  opacity: 1;
  transform: translateY(0);
}
</style>
