import QRCode  from "qrcode"



export const generateQRcode= async({data = ''}={})=>{
    const qrcode =QRCode.toDataURL(JSON.stringify(data),{
    errorCorrectionLevel:'H',
})
return qrcode
}