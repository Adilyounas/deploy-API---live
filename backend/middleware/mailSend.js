const nodemailer = require("nodemailer")

const mailSend = async(email,message)=>{
    const transporter = nodemailer.createTransport({
        port:process.env.SMPT_PORT,
        host:process.env.SMPT_HOST,
        service:process.env.SMPT_SERVICE,
        auth:{
            user:process.env.SMPT_USER,
            pass:process.env.SMPT_PASSWORD
        },
    })
    
    const options = {
        from:process.env.SMPT_USER,
        to:email,
        subject:"1-25-2023 send you email",
        text:message
    }
    
    await transporter.sendMail(options)
}

module.exports = mailSend