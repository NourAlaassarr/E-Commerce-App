import Jwt from 'jsonwebtoken'

export const generateToken = ({

payload = {},
signature=  process.env.DEFAULT_SIGNATURE,
expiresIn='1d'

}={})=>{
    if (!Object.keys(payload).length) { // Check if payload is empty
        return false
    }
    const Token = Jwt.sign(payload,signature,{expiresIn})
    return Token
}

export const VerifyToken = ({
    token='',
    signature=process.env.DEFAULT_SIGNATURE

}={})=>{
    if(!token)
    {
        return false
    }
    const data = Jwt.verify(token,signature)
    return data
}
