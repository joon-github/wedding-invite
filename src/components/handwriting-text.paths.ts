export type HandwritingStroke = {
  d: string;
  revealWidth: number;
  transform?: string;
};

export type HandwritingMaskGroup = {
  outlineIndex: number;
  strokes: readonly HandwritingStroke[];
};

const eyebrowGroups: HandwritingMaskGroup[] = [
  "M110 10 H116 M113 10 V18",
  "M119 10 V18 M119 14 H125 M125 10 V18",
  "M134 10 H128 V18 H134 M128 14 H133",
  "M140 10 L142 18 L145 12 L148 18 L150 10",
  "M158 10 H152 V18 H158 M152 14 H157",
  "M161 10 V18 H164 Q169 18 169 14 Q169 10 164 10 Z",
  "M172 10 V18 H175 Q180 18 180 14 Q180 10 175 10 Z",
  "M183 10 V18",
  "M187 18 V10 L194 18 V10",
  "M204 11 Q202 10 199 10 Q196 11 196 14 Q196 18 200 18 Q202 18 204 17 V14 H201",
  "M211 14 Q211 10 215 10 Q219 10 219 14 Q219 18 215 18 Q211 18 211 14 Z",
  "M228 10 H222 V18 M222 14 H227",
].map((d, outlineIndex) => ({
  outlineIndex,
  strokes: [
    {
      d,
      transform: "translate(49.5 0) scale(0.66 1)",
      revealWidth: 4.4,
    },
  ],
}));

const titleGroups: HandwritingMaskGroup[] = [
  {
    outlineIndex: 12,
    strokes: [
      { d: "M79 44 C78 50 79 58 79 64", revealWidth: 9 },
      {
        d: "M82 44 C88 42 96 43 100 45 C100 51 100 58 99 63",
        revealWidth: 9,
      },
      { d: "M81 63 C87 61 95 62 100 64", revealWidth: 9 },
    ],
  },
  {
    outlineIndex: 13,
    strokes: [
      {
        d: "M102 44 C107 41 114 42 118 44 C115 47 110 50 103 52",
        revealWidth: 8,
      },
      { d: "M102 53 C108 52 114 53 118 54", revealWidth: 8 },
      {
        d: "M103 60 C108 58 114 59 117 61 C117 64 116 66 116 67",
        revealWidth: 8,
      },
      { d: "M102 66 C108 65 114 66 118 66", revealWidth: 8 },
    ],
  },
  {
    outlineIndex: 14,
    strokes: [
      {
        d: "M134 47 C139 45 145 46 148 47 C147 50 147 53 147 55",
        revealWidth: 8,
      },
      { d: "M134 59 C140 58 145 59 148 59", revealWidth: 8 },
    ],
  },
  {
    outlineIndex: 15,
    strokes: [
      {
        d: "M151 47 C156 45 163 46 166 47 C163 50 156 50 152 51 C156 53 162 53 166 54",
        revealWidth: 8,
      },
      { d: "M165 46 C164 51 165 57 165 60", revealWidth: 8 },
    ],
  },
  {
    outlineIndex: 16,
    strokes: [
      {
        d: "M171 47 C175 45 181 46 184 47 C183 50 183 53 183 55",
        revealWidth: 8,
      },
      { d: "M176 57 C176 59 176 61 176 62", revealWidth: 8 },
      { d: "M170 60 C175 59 181 60 184 60", revealWidth: 8 },
    ],
  },
  {
    outlineIndex: 17,
    strokes: [
      {
        d: "M201 45 C207 42 215 43 219 45 C215 48 211 51 202 53",
        revealWidth: 9,
      },
      { d: "M217 44 C218 49 218 54 218 57", revealWidth: 9 },
      {
        d: "M203 62 C205 58 214 57 218 61 C221 65 217 68 211 68 C206 68 203 66 203 62",
        revealWidth: 9,
      },
    ],
  },
  {
    outlineIndex: 18,
    strokes: [
      {
        d: "M226 51 C225 46 229 43 234 44 C239 45 240 51 237 55 C233 58 227 56 226 51",
        revealWidth: 9,
      },
      { d: "M243 45 C243 51 243 57 243 61", revealWidth: 9 },
      { d: "M243 53 C245 52 247 52 248 52", revealWidth: 9 },
    ],
  },
];

const dateGroups: HandwritingMaskGroup[] = [
  "M123 91 Q124 88 127 88 Q131 88 131 91 Q131 93 123 99 H132",
  "M135 93 Q135 88 139 88 Q143 88 143 93 V95 Q143 100 139 100 Q135 100 135 95 Z",
  "M146 91 Q147 88 150 88 Q154 88 154 91 Q154 93 146 99 H155",
  "M164 89 Q157 91 158 96 Q159 101 163 100 Q167 99 166 95 Q165 92 159 94",
  "M171 99 Q171 98 172 98",
  "M180 90 L183 88 V100",
  "M188 93 Q188 88 192 88 Q196 88 196 93 V95 Q196 100 192 100 Q188 100 188 95 Z",
  "M201 99 Q201 98 202 98",
  "M210 93 Q210 88 214 88 Q218 88 218 93 V95 Q218 100 214 100 Q210 100 210 95 Z",
  "M227 100 V88 L221 96 H229",
].map((d, index) => ({
  outlineIndex: 19 + index,
  strokes: [
    {
      d,
      transform: "translate(72 0) scale(0.5 1)",
      revealWidth: 5.2,
    },
  ],
}));

export const HERO_HANDWRITING_ARTWORK = {
  ariaLabel: "THE WEDDING OF, 범준 그리고 정아, 2026년 10월 4일",
  viewBox: "42 0 236 108",
  groups: [...eyebrowGroups, ...titleGroups, ...dateGroups],
} as const;
