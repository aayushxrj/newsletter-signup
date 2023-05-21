const express = require("express");
const bodyParser  = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));


app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members : [
            {
                email_address: email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data); //as string of data is needed

    const url = "https://us21.api.mailchimp.com/3.0/lists/25e8d2f59b";

    const options = {
        method: "POST",
        auth : "aayush:3ad00f84cdb701c33e3ff84caabec13a-us21"
    }
    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            // res.send("Successfully subscribed!");
            res.sendFile(__dirname + "/success.html");
        }
        else{
            // res.send("There was an error singing up, please try again!");
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();


    // console.log(firstName, lastName, email);
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(3000, function(){
    console.log("Server is running on port 3000.");
});