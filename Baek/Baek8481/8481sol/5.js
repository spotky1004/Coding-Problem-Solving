const years = [
  "dzien roku dwutysiecznego", "dzien roku dwa tysiace pierwszego", "dzien roku dwa tysiace drugiego", "dzien roku dwa tysiace trzeciego", "dzien roku dwa tysiace czwartego", "dzien roku dwa tysiace piatego",
  "dzien roku dwa tysiace szostego", "dzien roku dwa tysiace siodmego", "dzien roku dwa tysiace osmego", "dzien roku dwa tysiace dziewiatego", "dzien roku dwa tysiace dziesiatego",
  "dzien roku dwa tysiace jedenastego", "dzien roku dwa tysiace dwunastego", "dzien roku dwa tysiace trzynastego", "dzien roku dwa tysiace czternastego", "dzien roku dwa tysiace pietnastego",
  "dzien roku dwa tysiace szesnastego", "dzien roku dwa tysiace siedemnastego", "dzien roku dwa tysiace osiemnastego", "dzien roku dwa tysiace dziewietnastego", "dzien roku dwa tysiace dwudziestego", 
];
const month = [
  "stycznia", "lutego", "marca", "kwietnia", "maja",
  "czerwca", "lipca", "sierpnia", "wrzesnia", "pazdziernika",
  "listopada", "grudnia"
];
const days = [
  "Pierwszy", "Drugi", "Trzeci", "Czwarty", "Piaty",
  "Szosty", "Siodmy", "Osmy", "Dziewiaty", "Dziesiaty",
  "Jedenasty", "Dwunasty", "Trzynasty", "Czternasty", "Pietnasty",
  "Szesnasty", "Siedemnasty", "Osiemnasty", "Dziewietnasty", "Dwudziesty",
  "Dwudziesty pierwszy", "Dwudziesty drugi", "Dwudziesty trzeci", "Dwudziesty czwarty", "Dwudziesty piaty",
  "Dwudziesty szosty", "Dwudziesty siodmy", "Dwudziesty osmy", "Dwudziesty dziewiaty", "Trzydziesty",
  "Trzydziesty pierwszy"
];
const extra = [
  [2647, "Pierwszego kwietnia jest prima aprilis."],
  [4900, "Pierwszego czerwca jest dzien dziecka."],
  [7671, "Koniec."]
];

function getNumber(n) {
  if (n <= 20) return [
    "zero",
    "pierwszy", "drugi", "trzeci", "czwarty", "piaty",
    "szosty", "siodmy", "osmy", "dziewiaty", "dziesiaty",
    "jedenasty", "dwunasty", "trzynasty", "czternasty", "pietnasty",
    "szesnasty", "siedemnasty", "osiemnasty", "dziewietnasty", "dwudziesty",
  ][n];
  if (n % 100 === 0) return ["", "setny", "dwusetny", "trzysetny"][Math.floor(n / 100)];

  const o1 = [
    "",
    "pierwszy", "drugi", "trzeci", "czwarty", "piaty",
    "szosty", "siodmy", "osmy", "dziewiaty", "dziesiaty",
  ];
  const o1_1 = [
    "",
    "pierwszy", "drugi", "trzeci", "czwarty", "piaty",
    "szosty", "siodmy", "osmy", "dziewiaty", "dziesiaty",
    "jedenasty", "dwunasty", "trzynasty", "czternasty", "pietnasty",
    "szesnasty", "siedemnasty", "osiemnasty", "dziewietnasty", "dwudziesty"
  ];
  const o2 = [
    "",
    "", "dwudziesty", "trzydziesty", "czterdziesty", "piecdziesiaty",
    "szescdziesiaty", "siedemdziesiaty", "osiemdziesiaty", "dziewiecdziesiaty", 
  ];
  const o3 = [
    "", "sto", "dwiescie", "trzysta"
  ];

  let out = "";
  out += o3[Math.floor(n / 100)] + " ";
  if ((n - 1) % 100 < 20) {
    out += o1_1[n % 100] + " ";
  } else {
    out += o2[Math.floor(n / 10) % 10] + " ";
    out += o1[n % 10] + " ";
  }
  return out.replace(/  /g, " ").trim();
}
const numbers = [];
for (let i = 0; i <= 366; i++) {
  numbers.push(getNumber(i));
}

const out = [];
const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
for (let i = 0; i < years.length; i++) {
  let d = 1;
  for (let j = 0; j < month.length; j++) {
    const monthDay = j === 1 && i % 4 === 0 ? 29 : monthDays[j];
    for (let k = 0; k < monthDay; k++) {
      out.push(`${days[k]} ${month[j]} to ${numbers[d]} ${years[i]}.`);
      d++;
    }
  }
}
for (const [i, m] of extra) {
  out[i] = m;
}

require("fs").writeFileSync("./out.txt", out.join("\n") + "\n");
