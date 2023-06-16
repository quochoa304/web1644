var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.listen(3200);


var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended:false}))
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://qhoa:NGQRuTd1DkVHsPjf@toystore.hxhpwrh.mongodb.net/');
}

//upload
//multer
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()  + "-" + file.originalname)
    }
});  
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/bmp" ||
           file.mimetype=="image/png"||
           file.mimetype=="image/gif"||
           file.mimetype=="image/jpg"||
           file.mimetype=="image/jpeg"
         ){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
            
        }
    }
}).single("fileImage");

const Items = require("./models/items")

app.post("/page/newcat", function (req, res) {

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log("A Multer error occurred when uploading."); 
      res.json({kq:0});
    } else if (err) {
      console.log("An unknown error occurred when uploading." + err);
      res.json({kq:0});
    }else{
        console.log("Upload is okay");
        //
        var item = new Items({
            Name: req.body.txtName,
            image: req.file.filename,
            file: req.body.txtFile,
            price: req.body.txtPrice,
            quantity:req.body.txtQuantity,
            descrip:req.body.txtDetail,
            item_id:[]
          });
          item.save()
          .then(function (models) {
            console.log(models);
            res.render("home",{page:"newcat", message:"Save sucessfull"});
          })
          .catch(function (err) {
            console.log(err);
            res.render("home",{page:"newcat", message:"Save fail, please check the format !!"});
          });
    }

});
      
});


app.get("/page/item", function (req, res) {
  Items.find()
  .then(function (models) {
    console.log(models);
    res.render("home",{page:"item", items:models});
    
  })
  .catch(function (err) {
    console.log(err);
    res.render("home",{page:"item", items:[]});
  });

});





app.get("/", function(req, res){
    res.render("home",{page: "home"});
});

app.get("/page/:p", function(req, res){
  res.render("home",{page: req.params.p});
});

app.get("/login", function(req, res){
    res.render("login");
});
app.get("/register", function(req, res){
  res.render("register");
});

app.get("/about", function(req, res){
  res.render("about");
});

