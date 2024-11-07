//Thanks to Karik for this setup

//clint ID's
export const clientName = "cg";
export const clientID = 24;

export const baseUrl = "http://saas-api-dev.genefied.in/"  // "http://saas-api-dev.genefied.in/""

//icons and images
export const appIcon = require("../../assets/images/ozoStartsLogo.png");
export const splash = require("../../assets/images/splash2.png");

export const descriptionImages = [
  require("../../assets/images/asliVsnakli.png"),
  require("../../assets/images/rewardifyDescription.png"),
];

//Change Loader Manually By Simply Replacing it

//Registration
export const RegistrationMessage = `Thank you for joining ${clientName} Loyalty program, we will get back to you within 1-2 working days`;
export const eKyc = true;  // send true if you want to call aadhar gst and pan api else false


//Dashboard
export const needCaimpaign = __DEV__ ? false : true;
export const scannerType = "qr"; //"qr for qr", "bar for bar

// choose from ["points", "scanned", "redeemed", "cashback","coupon", "warranty","previous transaction","wheel","shared"]
export const neededHistory = [
  "points",
  "scanned",
  "redeemed",
  "cashback",
  "coupon",
  "warranty",
  "wheel",
  "shared",
  "previous",
];

export const showEditProfile = true;

export const redeemptionItems = ["gift", "cashback","coupon" ]; // choose from -->  ["gift", "cashback","coupon"]
