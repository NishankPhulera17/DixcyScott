export const splash = require('../../assets/images/splash2.png')
export const icon = require('../../assets/images/splash2.png')
export const needCaimpaign = false
export const needCaimpaignVideo = false
export const needCaimpaignKnowMore = false
export const scannerType = "qr" //"qr for qr", "bar for bar
// choose from ["points", "scanned", "redeemed", "cashback","coupon", "warranty","previous transaction","wheel","shared"]
export const neededHistory = ["redeemed","order"] 
export const showEditProfile = true 
export const theme = "2"
export const hasTdsSetup = false;
// use kycOption1 and kycOption2 in case of optional kyc

// use kycOption1 in case there is no conditional kyc
export const kycOption1 = ["gstin"]
// enable this with secondary kyc options to enable optional kyc
export const kycOption2 = ["aadhar","pan"]
