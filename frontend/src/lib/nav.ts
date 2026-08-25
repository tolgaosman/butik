export type NavColumn = {
  title: string;
  items: { label: string; href: string }[];
};

export type NavItem = {
  label: string;
  href: string;
  columns: NavColumn[];
};

export const primaryNav: NavItem[] = [
  {
    label: "Ana Sayfa",
    href: "/",
    columns: [],
  },
  {
    label: "Giyim",
    href: "/giyim",
    columns: [
      {
        title: "Elbise",
        items: [
          { label: "Midi Elbise", href: "/giyim/midi-elbise" },
          { label: "Maxi Elbise", href: "/giyim/maxi-elbise" },
          { label: "Günlük Elbise", href: "/giyim/gunluk-elbise" },
          { label: "Abiye", href: "/giyim/abiye" },
        ],
      },
      {
        title: "Üst Giyim",
        items: [
          { label: "Bluz & Gömlek", href: "/giyim/bluz-gomlek" },
          { label: "T-Shirt", href: "/giyim/tisort" },
          { label: "Örgü & Triko", href: "/giyim/orgu-triko" },
          { label: "Ceket & Blazer", href: "/giyim/ceket-blazer" },
        ],
      },
      {
        title: "Alt Giyim",
        items: [
          { label: "Pantolon", href: "/giyim/pantolon" },
          { label: "Etek", href: "/giyim/etek" },
          { label: "Şort", href: "/giyim/sort" },
          { label: "Jean", href: "/giyim/jean" },
        ],
      },
    ],
  },
  {
    label: "Elbise",
    href: "/elbise",
    columns: [
      {
        title: "Elbise",
        items: [
          { label: "Midi Elbise", href: "/elbise/midi" },
          { label: "Maxi Elbise", href: "/elbise/maxi" },
          { label: "Mini Elbise", href: "/elbise/mini" },
          { label: "Günlük Elbise", href: "/elbise/gunluk" },
          { label: "Abiye & Davet", href: "/elbise/abiye" },
        ],
      },
    ],
  },
  {
    label: "Üst Giyim",
    href: "/ust-giyim",
    columns: [
      {
        title: "Üst Giyim",
        items: [
          { label: "Bluz & Gömlek", href: "/ust-giyim/bluz-gomlek" },
          { label: "T-Shirt & Body", href: "/ust-giyim/tisort-body" },
          { label: "Örgü & Triko", href: "/ust-giyim/orgu-triko" },
          { label: "Ceket & Blazer", href: "/ust-giyim/ceket-blazer" },
          { label: "Hırka", href: "/ust-giyim/hirka" },
        ],
      },
    ],
  },
  {
    label: "Alt Giyim",
    href: "/alt-giyim",
    columns: [
      {
        title: "Alt Giyim",
        items: [
          { label: "Pantolon", href: "/alt-giyim/pantolon" },
          { label: "Jean", href: "/alt-giyim/jean" },
          { label: "Etek", href: "/alt-giyim/etek" },
          { label: "Şort", href: "/alt-giyim/sort" },
          { label: "Tayt", href: "/alt-giyim/tayt" },
        ],
      },
    ],
  },
  {
    label: "Aksesuar",
    href: "/aksesuar",
    columns: [
      {
        title: "Aksesuar",
        items: [
          { label: "Çanta", href: "/aksesuar/canta" },
          { label: "Takı", href: "/aksesuar/taki" },
          { label: "Kemer", href: "/aksesuar/kemer" },
          { label: "Şal & Fular", href: "/aksesuar/sal-fular" },
          { label: "Güneş Gözlüğü", href: "/aksesuar/gunes-gozlugu" },
        ],
      },
    ],
  },
  {
    label: "Makyaj Malzemesi",
    href: "/makyaj-malzemesi",
    columns: [
      {
        title: "Makyaj",
        items: [
          { label: "Yüz", href: "/makyaj-malzemesi/yuz" },
          { label: "Göz", href: "/makyaj-malzemesi/goz" },
          { label: "Dudak", href: "/makyaj-malzemesi/dudak" },
        ],
      },
    ],
  },
  {
    label: "İç Çamaşırı",
    href: "/ic-camasiri",
    columns: [
      {
        title: "İç Çamaşırı",
        items: [
          { label: "Sütyen", href: "/ic-camasiri/sutyen" },
          { label: "Külot", href: "/ic-camasiri/kulot" },
          { label: "Gecelik", href: "/ic-camasiri/gecelik" },
        ],
      },
    ],
  },
] as const;

export const footerLinks = {
  magaza: [
    { label: "Ana Sayfa", href: "/" },
    { label: "Giyim", href: "/giyim" },
    { label: "Elbise", href: "/elbise" },
    { label: "Üst Giyim", href: "/ust-giyim" },
    { label: "Alt Giyim", href: "/alt-giyim" },
    { label: "Makyaj Malzemesi", href: "/makyaj-malzemesi" },
    { label: "İç Çamaşırı", href: "/ic-camasiri" },
  ],
  musteriHizmetleri: [
    { label: "Siparişimi Takip Et", href: "/siparis-takip" },
    { label: "Kargo ve Teslimat", href: "/kargo-teslimat" },
    { label: "Beden Rehberi", href: "/beden-rehberi" },
    { label: "Sıkça Sorulan Sorular", href: "/sss" },
    { label: "İletişim", href: "/iletisim" },
  ],
  hakkimizda: [
    { label: "Hikayemiz", href: "/hikayemiz" },
    { label: "Sürdürülebilirlik", href: "/surdurulebilirlik" },
    { label: "Lookbook", href: "/lookbook" },
    { label: "Kariyer", href: "/kariyer" },
    { label: "Blog", href: "/blog" },
    { label: "Bize Ulaşın", href: "/iletisim" },
  ],
} as const;
