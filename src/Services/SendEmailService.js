import nodemailer from 'nodemailer'

export  async function sendmailService({
    to,
    subject,
    message,
    attachments=[],
} = {}) {
const Transporter = nodemailer.createTransport({
    //configuration
    host:'localhost',    ///smpt.gmail.com
    port:587, //587, 465
    secure:false, //false, true
    service:'gmail',

    auth:{
        //credentials
        user:'nonaalaassar@gmail.com',
        pass:'vewvyksxkesulkge',
    }

})

const emailInfo = await Transporter.sendMail({
from:'"nour route 👻"<nonaalaassar@gmail.com>',
to: to ? to : '',
subject: subject ? subject :'hello',
html:message?message :'',
attachments,
})
// console.log(emailInfo)
if (emailInfo.accepted.length) {
    return true
}
return false
}