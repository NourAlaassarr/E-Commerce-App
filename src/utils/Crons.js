import {scheduleJob} from 'node-schedule'

export const job = () =>{
    scheduleJob('* * * * * *', function () {
    console.log('The answer to life, the universe, and everything!');}
)};