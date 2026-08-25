export const business = {
  name: "Sevgi Butik",
  category: "Düzova'da bir giyim mağazası",
  address: "İskele Anayolu, Düzova, Lefkoşa",
  mapsQuery: "Sevgi Butik, İskele Anayolu, Düzova, Lefkoşa",
  coords: { lat: 35.227786, lng: 33.5310516 },
  phone: "0542 873 91 96",
  email: "info@sevgibutik.com",
  instagram: "https://www.instagram.com/sevgi.butikk18?igsi=OTcxdXRmc2RibXph&utm_source=qr",
  facebook: "https://www.facebook.com/profile.php?id=61564957254292&mibextid=wwXIfr&rdid=2VjaMhKQa675mN0o&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18mZBTVct9%2F%3Fmibextid%3DwwXIfr",
  hours: [
    { day: "Pazartesi", value: "09:30–19:00" },
    { day: "Salı", value: "09:30–19:00" },
    { day: "Çarşamba", value: "09:30–19:00" },
    { day: "Perşembe", value: "09:30–19:00" },
    { day: "Cuma", value: "09:30–19:00" },
    { day: "Cumartesi", value: "Kapalı" },
    { day: "Pazar", value: "09:30–19:00" },
  ],
  rating: 5,
  reviewCount: 3,
} as const;

export const googleReviews = [
  { author: "Ozcan Yazar", rating: 5, timeAgo: "2 yıl önce", text: "Harika ürünler." },
  { author: "Müjde Özata", rating: 5, timeAgo: "5 yıl önce", text: "" },
  { author: "Dogay Adal", rating: 5, timeAgo: "5 yıl önce", text: "" },
] as const;
