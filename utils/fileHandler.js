import fs from 'fs'

export const writeCSV = async (data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile('./data.csv', data, (err) => {
            if(err){
                reject(err);
            }

            resolve('success');
        })
    })
}

export const readCSV = async () => {
    return new Promise((resolve, reject) => {
        fs.readFile('./data.csv', 'utf-8', (err, data) => {
            if(err){
                reject(err);
            }

            resolve(data);
        })
    })
}