'use server'
import fsPromises from 'fs/promises'
import activityFiles from '../activityfiles.json';

export const saveFromModalSrvr = async(filename:string, tag:string, str:string) =>{
    await fsPromises.writeFile('public/activityfiles/' + filename + '.json', str);
    const newOfflineData = {
        activities:[...activityFiles.activities, {
            "name": filename +'.json',
            "status": "active",
            "lessontag": tag
          }]
    }
    const newOfflineDataStr = JSON.stringify(newOfflineData);
    console.log(newOfflineDataStr)
    await fsPromises.writeFile('app/activityfiles.json', newOfflineDataStr);
}

export const saveActivityThumb = async(filename:string, thumb:string) =>{
    var data = thumb.replace(/^data:image\/\w+;base64,/, "");
    var buf = Buffer.from(data, 'base64');
    await fsPromises.writeFile('public/thumbs/' + filename + '.png', buf)
}