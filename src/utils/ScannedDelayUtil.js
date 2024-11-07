

var lastQr = ""
const TIME_LIMIT = 500 
let lastScanTime;
const arr = [];
const scanDelay = (qr, next) => {
    console.log("scanDelay",qr)
    const d1 = Date.now();
    if(arr.includes(qr))
    {
        return;
    }
    if(qr === lastQr){
        let diff = d1 - lastScanTime;
        if (diff < 800){
            lastScanTime = d1;
            return;
        }
    }
    lastQr = qr;
    lastScanTime = d1;
    next();
}

export default scanDelay;