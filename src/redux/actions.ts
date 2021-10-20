export const ADDGAME = 'ADDGAME';
export const DELETEGAME = 'DELETEGAME';

 export const addGame = (name='', score=0)=>({
     type:ADDGAME,
     name:name,
     score:score

 })

 export const deleteGame = (userId='')=>({
    type:DELETEGAME,
    id:userId
})
