const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function (req,res) { 
      res.sendFile(__dirname+"/signup.html");
 });

app.post("/",function(req,res){
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    console.log(firstname+" "+lastname+" "+email);

    var data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };
    var jsonData = JSON.stringify(data);

    const url = "https://us6.api.mailchimp.com/3.0/lists/a7d725986e";

    const options = {
        method: "POST",
        auth: "vaibhav:283f028895d346d4c2f36f95dc0b657e-us6",

    }

    const request = https.request(url,options,function(response){

        if(response.statusCode === 200)
        {
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }


        response.on("data",function(data){
            console.log(JSON.parse(data));
        });

    });
    request.write(jsonData);
    request.end();

});

app.post("/failure",function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
    console.log("server is running");
})

