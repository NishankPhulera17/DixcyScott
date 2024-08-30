export const splash = require('../../assets/images/splash2.png')
export const icon = require('../../assets/images/splash2.png')
export const needCaimpaign = true
export const needCaimpaignVideo = true
export const needCaimpaignKnowMore = true
export const scannerType = "qr" //"qr for qr", "bar for bar
// choose from ["points", "scanned", "redeemed", "cashback","coupon", "warranty","previous transaction","wheel","shared"]
export const neededHistory = ["points", "scanned", "redeemed", "cashback","coupon", "warranty",,"wheel","shared","previous"] 
export const showEditProfile = true 


// use kycOption1 and kycOption2 in case of optional kyc

// use kycOption1 in case there is no conditional kyc
export const kycOption1 = ["gstin"]
// enable this with secondary kyc options to enable optional kyc
export const kycOption2 = ["aadhar","pan"]
