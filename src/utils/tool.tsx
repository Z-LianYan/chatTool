import dayjs from 'dayjs';
export function uniqueMsgId(user_id:string){
    return (user_id?String(user_id):'') + dayjs().format('YYYYMMDDHHmmssSSS')+String(Math.floor(Math.random()*1000))
}