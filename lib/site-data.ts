export const walkthroughUrl =
  "https://www.coohom.com/pub/tool/panorama/viewer?obsPicId=3FOFEGNEL1FN&utm_source=pano_share&uri=%2Fpub%2Ftool%2Fbim%2Fcloud%3Fdesignid%3D3FO3RUW4J8H6%26redirecturl%3D%2Fpub%2Fsaas%2Fapps%2Fproject%2Fdetail%2F3FO3RUW4J8H6%26em%3D0%26uid%3D3FO4MGY4K1TK%26locale%3Den_US&utm_content=3FOFEGNEL1FN&utm_medium=linkcopy&locale=en_US";

export const instagramHandle = "@stay_by_jordan";
export const instagramUrl = "https://www.instagram.com/stay_by_jordan/";
export const phoneNumber = "+2349066875283";
export const phoneUrl = `tel:${phoneNumber}`;
export const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, "")}`;

export const navItems = [
  { href: "/reservations", label: "Residences" },
  { href: "/visualization", label: "Walkthrough" },
  { href: "/about", label: "Our story" },
  { href: "/policies", label: "Policies" },
];

export const apartmentTypes = [
  {
    id: "two-bedroom",
    name: "The Two Bedroom",
    shortName: "Two bedroom",
    eyebrow: "Intimate residence",
    address: "Glendale Pearl Estate, Wuye, Abuja, Nigeria",
    summary:
      "A composed private apartment for couples, executives, and small families who value a quieter kind of stay.",
    rate: "From ₦140,000",
    rateSuffix: "per night",
    capacity: "Up to 4 guests",
    bedrooms: "2 bedrooms",
    baths: "2 baths",
    image: "/images/residence-bedroom.jpg",
    imageAlt: "A softly lit premium bedroom with an upholstered bed",
    signature:
      "Layered comfort, generous living space, and an arrival shaped around you.",
    inclusions: [
      "Private living and dining room",
      "High-speed Wi-Fi",
      "Curated arrival essentials",
      "Personally confirmed reservation",
    ],
  },
  {
    id: "three-bedroom",
    name: "The Three Bedroom",
    shortName: "Three bedroom",
    eyebrow: "Generous residence",
    address: "8a King AJ turner Crescent, Wuye, Abuja, Nigeria",
    summary:
      "A larger residence designed for families, close friends, and longer stays without compromising privacy.",
    rate: "From ₦155,000",
    rateSuffix: "per night",
    capacity: "Up to 6 guests",
    bedrooms: "3 bedrooms",
    baths: "3 baths",
    image: "/images/residence-dining.jpg",
    imageAlt: "A warm modern dining room and kitchen in a private apartment",
    signature:
      "Room to gather, room to retreat, and thoughtful support throughout the stay.",
    inclusions: [
      "Dining for six",
      "Fully appointed kitchen",
      "Flexible arrival coordination",
      "Personally confirmed reservation",
    ],
  },
];

export const availableWindows = [
  {
    range: "12–15 July",
    nights: "3 nights",
    status: "Available",
    price: "From ₦420,000",
  },
  {
    range: "19–21 July",
    nights: "2 nights",
    status: "Available",
    price: "From ₦280,000",
  },
  {
    range: "2–6 August",
    nights: "4 nights",
    status: "Limited",
    price: "From ₦620,000",
  },
];

export const servicePromises = [
  {
    number: "01",
    title: "See before you stay",
    body: "Walk through the residence virtually, understand the space, and reserve with a clear sense of arrival.",
  },
  {
    number: "02",
    title: "A considered booking",
    body: "Every request is personally reviewed so dates, guest details, and expectations are aligned.",
  },
  {
    number: "03",
    title: "Privacy, quietly protected",
    body: "Exact location and sensitive stay information are shared only at the appropriate stage.",
  },
];

export const bookingSteps = [
  {
    number: "01",
    title: "Choose your residence",
    body: "Compare the two and three-bedroom stays.",
  },
  {
    number: "02",
    title: "Select your dates",
    body: "Choose your preferred check-in and check-out dates.",
  },
  {
    number: "03",
    title: "Secure the reservation",
    body: "Create your request, then complete payment during the 10-minute temporary hold.",
  },
  {
    number: "04",
    title: "Receive confirmation",
    body: "Only admin approval creates the final date lock for your stay.",
  },
];

export const paymentDetails = [
  ["Amount", "₦420,000"],
  ["Account name", "Stay By Jordan"],
  ["Bank", "To be confirmed"],
  ["Account number", "0000000000"],
] as const;

export const kycRequirements = [
  "A valid government-issued ID",
  "A clear portrait or selfie",
  "Current residential address",
  "Primary guest contact details",
];

export const adminReservations = [
  {
    id: "SBJ-2407",
    guest: "Amina Yusuf",
    apartment: "Two Bedroom",
    date: "12–15 Jul",
    status: "Payment pending",
    signal: "08:42 left",
    amount: "₦420,000",
    guests: "3 guests",
    contact: "+234 803 000 2184",
  },
  {
    id: "SBJ-2406",
    guest: "Daniel Cole",
    apartment: "Three Bedroom",
    date: "19–21 Jul",
    status: "KYC review",
    signal: "Proof received",
    amount: "₦310,000",
    guests: "5 guests",
    contact: "+234 806 000 4472",
  },
  {
    id: "SBJ-2405",
    guest: "Tara Williams",
    apartment: "Two Bedroom",
    date: "2–6 Aug",
    status: "Confirmed",
    signal: "Ready for arrival",
    amount: "₦560,000",
    guests: "2 guests",
    contact: "+234 809 000 5531",
  },
];

export const dashboardMetrics = [
  ["03", "Active requests", "+1 today"],
  ["₦1.29m", "Stay value", "Across current queue"],
  ["02", "Awaiting review", "Needs your attention"],
  ["01", "Confirmed stay", "Next arrival 12 Jul"],
] as const;
