var express = require("express");
var app = express();
var db = require("./database.js");
var bodyParser = require("body-parser");
const { request, response } = require("express");
const res = require("express/lib/response");
app.use(bodyParser.json());

let HTTP_PORT = 8080;

app.listen(HTTP_PORT, () => {
    console.log("Server is running on %PORT%".replace("%PORT%", HTTP_PORT))
});

app.post("/api/customer/", (req, res, next) => {

    try {
        var errors = []

        if (!req.body) {
            errors.push("An invalid input");
        }
        const {
            customerName,
            address,
            email,
            dateOfBirth,
            gender,
            age,
            cardHolderName,
            cardNumber,
            expiryDate,
            cvv,
            timeStamp
        } = req.body;

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push("Invalid email address");
        }

        // Credit card number validation (12 digits)
        const cardNumberRegex = /^\d{12}$/;
        if (!cardNumberRegex.test(cardNumber)) {
            errors.push("Invalid credit card number (must be 12 digits)");
        }

        if (errors.length > 0) {
            res.status(400).json({ "error": errors.join(", ") });
            return;
        }

        var sql = 'INSERT INTO customer (customerName, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv, timeStamp) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
        var params = [customerName, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv, timeStamp]
        db.run(sql, params, function (err, result) {

            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            } else {
                res.status(201).json({
                    "message": "customer P.G.Nadeesha Ekanayaka has registered",
                    "data": req.body,
                    "id": this.lastID
                })
            }

        });

} catch (E) {
    res.status(400).send(E);
} 
});

app.get("/api/customer", (req, res, next) => {

    try {
        var sql = "select * from customer"
        var params = []
        db.all(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "customer P.G.Nadeesha Ekanayaka has registered",
                "data": rows
            })
        });
    } catch (E) {
        res.status(400).send(E);
    }
});

app.put("/api/customer/", (req, res, next) => {
    const {
        id,
        customerName,
        address,
        email,
        dateOfBirth,
        gender,
        age,
        cardHolderName,
        cardNumber,
        expiryDate,
        cvv,
        timeStamp
    } = req.body;

    db.run(`UPDATE customer set customerName = ?, address = ?, email = ?, dateOfBirth = ?,gender=?,age=?, cardHolderName=?, cardNumber=?, cvv=?, timeStamp=?, WHERE id = ?`,
        [customerName, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv, timeStamp, id],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.status(200).json({ updated: this.changes });
        });
});

app.delete("/api/customer/delete/:id", (req, res, next) => {
    try {
        db.run('DELETE FROM customer WHERE id = ?',
            req.params.id,
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": res.message })
                    return;
                }
                res.json({ "message": "deleted", rows: this.changes })
            });
    } catch (E) {
        res.status(400).send(E)
    }

});

