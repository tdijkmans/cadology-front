import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const bodyParts = [
  'hoofd',
  'schouders',
  'armen',
  'heupen',
  'bovenbenen',
  'onderbenen',
  'voeten',
  'enkels',
  'tenen',
  'knieën',
  'ellebogen',
];

type Lichaamsdeel = (typeof bodyParts)[number];
type Baandeel = 'rechte stuk' | 'bocht';
type Bewegingsfase = 'afzet' | 'bijhaal' | 'inzet' | 'armzwaai';
type Name = string;
export type CheckListItem = {
  name: Name;
  baandeel: Baandeel[];
  bewegingsfase: Bewegingsfase[];
  effect: string;
  metaforen: string[];
  lichaamsdelen: Lichaamsdeel[];
  id: number;
  ezelsbruggetje: string;
};

const usefulLinks = [
  {
    url: 'https://www.beterlerenschaatsen.nl/',
    name: 'Beter leren schaatsen',
  },
  {
    url: 'https://www.duosport.nl/schaatsacademie/',
    name: 'Duo Sport - Schaatsacademie',
  },
  {
    url: 'https://www.schaatstechniek.com/',
    name: 'Schaatstechniek.com',
  },
];

const checkList: CheckListItem[] = [
  {
    baandeel: ['rechte stuk', 'bocht'],
    bewegingsfase: ['bijhaal', 'inzet'],
    effect: 'Verhoogde stabiliteit en betere schaatshouding',
    ezelsbruggetje: 'Denk aan een kat die zich uitrekt na het slapen.',

    id: 1,
    lichaamsdelen: ['rug'],
    metaforen: ['rug als een kat', 'rug als een brug'],
    name: 'Ik bol mijn rug',
  },
  {
    baandeel: ['rechte stuk', 'bocht'],
    bewegingsfase: ['afzet', 'bijhaal'],
    effect: 'Een optimale hoek van de heupen (10°)',
    ezelsbruggetje:
      'Stel je voor dat je een kom water vasthoudt en deze voorzichtig naar voren giet.',

    id: 2,
    lichaamsdelen: ['heupen'],
    metaforen: ['bekken als een emmer'],
    name: 'Ik kantel mijn bekken naar voren',
  },
  {
    baandeel: ['rechte stuk', 'bocht'],
    bewegingsfase: ['afzet'],
    effect: 'Optimale druk op het ijs en stabiele houding',
    ezelsbruggetje:
      'Denk aan een stoel waar je op zit, maar zonder stoelpoten.',

    id: 3,
    lichaamsdelen: ['knieën'],
    metaforen: ['zitten op een stoel', 'bidden'],
    name: 'Ik houd mijn knieën in een hoek van 90°',
  },
  {
    baandeel: ['rechte stuk', 'bocht'],
    bewegingsfase: ['afzet', 'bijhaal'],
    effect: 'Mijn bovenbenen zijn horizontaal',
    ezelsbruggetje: 'Hoe kleiner de hoek, hoe scherper en krachtiger je afzet.',

    id: 4,
    lichaamsdelen: ['bovenbenen', 'knieën'],
    metaforen: ['zitten op een stoel', 'bidden'],
    name: 'Ik houd de hoek van mijn standbeen klein',
  },
  {
    baandeel: ['rechte stuk', 'bocht'],
    bewegingsfase: ['bijhaal'],
    effect: 'Een efficiënte afzet en balans',
    ezelsbruggetje: 'Enkel, knie, sleutelbeen, schaatsen gaan heen',

    id: 5,
    lichaamsdelen: ['enkels', 'knieën', 'schouders'],
    metaforen: ['EKS-lijn'],
    name: 'Ik houd mijn enkel, knie en sleutelbeen op 1 lijn',
  },
  {
    baandeel: ['rechte stuk', 'bocht'],
    bewegingsfase: ['afzet', 'bijhaal'],
    effect: 'Een diepe zit en een stabiele houding',
    ezelsbruggetje: 'Tenen, knie, schouder, met schaatsen worden we ouder',

    id: 6,
    lichaamsdelen: ['tenen', 'knieën', 'schouders'],
    metaforen: ['TKS-lijn'],
    name: 'Ik houd mijn tenen, knieën en schouders op 1 lijn',
  },
  {
    baandeel: ['rechte stuk', 'bocht'],
    bewegingsfase: ['afzet', 'bijhaal'],
    effect: 'Minder spanning in je bovenlichaam',
    ezelsbruggetje: 'Ellebogen als een vogel, schaatsen als een dolle',

    id: 7,
    lichaamsdelen: ['ellebogen', 'schouders'],
    metaforen: ['ellebogen als een vogel'],
    name: 'Ik strek mijn ellebogen en ontspan mijn schouders',
  },
  {
    baandeel: ['rechte stuk', 'bocht'],
    bewegingsfase: ['afzet'],
    effect: 'Maximale kracht op het ijs en een vloeiende afzet',
    ezelsbruggetje: 'Duw alsof je een grote doos zijwaarts wilt verschuiven',

    id: 8,
    lichaamsdelen: ['voeten', 'enkels', 'knieën'],
    metaforen: ['schaats als een mes'],
    name: 'Ik zet zijwaarts af met mijn schaats',
  },
  {
    baandeel: ['rechte stuk', 'bocht'],
    bewegingsfase: ['bijhaal'],
    effect: 'Vermindert onnodige weerstand en verbetert balans',
    ezelsbruggetje:
      'Doe alsof je met je knie een bal naar de grond wilt duwen.',

    id: 9,
    lichaamsdelen: ['bovenbenen', 'heupen'],
    metaforen: ['bovenbeen als een zak aardappelen'],
    name: 'Ik richt mijn bijhalende bovenbeen naar beneden',
  },
  {
    baandeel: ['rechte stuk', 'bocht'],
    bewegingsfase: ['bijhaal'],
    effect: 'Een vloeiende overgang van de bijhaal naar de afzet',
    ezelsbruggetje:
      'Voel alsof je met elke stap naar een denkbeeldige stip op het ijs reikt.',

    id: 10,
    lichaamsdelen: ['bovenbenen', 'heupen'],
    metaforen: ['been als een zwaaiende slinger'],
    name: 'Ik breng mijn bijhalende been naar voren en val voorwaarts',
  },
  {
    baandeel: ['bocht'],
    bewegingsfase: ['bijhaal'],
    effect: 'Mijn heupen zijn waterpas en krachtverdeling is optimaal',
    ezelsbruggetje: 'Stel je voor dat je een plat dak vormt met je heupen.',

    id: 11,
    lichaamsdelen: ['heupen'],
    metaforen: ['heupen als een schommel'],
    name: 'Ik til mijn vrije heup op en breng mijn standheup omlaag',
  },
  {
    baandeel: ['rechte stuk', 'bocht'],
    bewegingsfase: ['bijhaal'],
    effect: 'Mijn schouders zijn waterpas',
    ezelsbruggetje: 'Denk aan een weegschaal met een lichte en zware kant.',

    id: 12,
    lichaamsdelen: ['schouders'],
    metaforen: ['schouders als een schommel'],
    name: 'Ik til mijn vrije schouder op en breng mijn standschouder omlaag',
  },
];

@Injectable({
  providedIn: 'root',
})
export class InstructionService {
  constructor() {}

  private checklist = new BehaviorSubject<CheckListItem[]>(checkList);

  public checklist$ = this.checklist.asObservable().pipe();

  getBodyParts() {
    return bodyParts;
  }

  getUsefulLinks() {
    return usefulLinks;
  }

  getCheckList() {
    return checkList;
  }
}
