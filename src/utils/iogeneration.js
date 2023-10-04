
import {Server}from'socket.io'

let io

export function initiatio(server){
    const io = new Server(server)
    return io
}
    
    export function getio(){
        if(!io){
            return new Error('no io')
        }
        return io

    }