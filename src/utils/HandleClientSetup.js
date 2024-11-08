//Thanks to Karik for this setup (the Half blood prince)

//clint ID's
export const clientName = "genefied";
export const clientID = 28;

export const baseUrl = "http://sales-saas-api.genefied.in/"  // "http://saas-api-dev.genefied.in/""

//icons and images
export const appIcon = require("../../assets/images/genefiedLogo.jpg");
export const splash = require("../../assets/gif/SplashGenefied.gif");

export const descriptionImages = [
  require("../../assets/images/Step1.png"),
  require("../../assets/images/Step2.png"),
  require("../../assets/images/Step3.png"),
  require("../../assets/images/Step4.png"),
  require("../../assets/images/Step5.png")
];

//Change Loader Manually By Simply Replacing images

//Registration
export const RegistrationMessage = `Thank you for joining ${clientName} Loyalty program, we will get back to you within 1-2 working days`;
export const eKyc = true;  // send true if you want to call aadhar gst and pan api else false


//Dashboard
export const needCaimpaign = __DEV__ ? false : true;

export const scannerType = "qr"; //"qr for qr", "bar for bar

// choose from ["points", "scanned", "redeemed", "cashback","coupon", "warranty", "wheel","previous transaction","wheel","shared"]
export const neededHistory = [
  "points",
  "scanned",
  "redeemed",
  "cashback",
  "coupon",
  "warranty",
  "shared",
  "previous",
];

export const showEditProfile = true;

export const redeemptionItems = ["gift", "cashback","coupon" ]; // choose from -->  ["gift", "cashback","coupon"]
