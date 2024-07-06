var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE,(err)=>{
     if(err){
        console.error(err.message)
        throw err
     }else{
        console.log('Connected to the SQLite Database.')
        db.run(`CREATE TABLE customer (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customerName VARCHAR(255) NOT NULL,
            address VARCHAR,
            email VARCHAR,
            dateOfBirth DATE,
            gender VARCHAR,
            age INTEGER,
            cardHolderName TEXT,
            cardNumber VARCHAR,
            expiryDate VARCHAR,
            cvv VARCHAR,
            timeStamp TIMESTAMP
            )`, (err) => {
        if (err) {
            //Table already created
        } else {
            //Table just created, creating some rows
            var insert = 'INSERT INTO customer (customerName, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv, timeStamp) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
            db.run(insert, ["P.G.Nadeesha Ekanayaka", "No 200/A Ra De Mel Road, Kandy", "nadeesha@gmail.com", "1990.01.05", "Female", 30, "P.G.N.Ekanayaka", "100445217634", "12/2024", 646, "2024-12-31 23:59:59"])
        }
        }

        )
     }

})

module.exports = db