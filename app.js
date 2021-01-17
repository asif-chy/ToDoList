const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
//const date = require(__dirname+"/date.js");
const PORT = process.env.PORT || 3000;

var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true}); //Local MongoDb Connection
mongoose.connect("mongodb+srv://Asiful_01:Test1234@cluster0.9hlzt.mongodb.net/listDB?retryWrites=true&w=majority", {useNewUrlParser: true});

const itemsSchema = {
  item: String
}

const Item = mongoose.model("Item",itemsSchema);

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model("List",listSchema);

const item1 = new Item({
  item: "Welcome to toDoList"
})

const item2 = new Item({
  item: "Delete -> checkbox"
})

const item3 = new Item({
  item: "Add -> +"
})

const defaultItems = [item1, item2, item3];

// Item.insertMany(items,function(err){
//   if(err){
//     console.log(err);
//   }else{
//     console.log("Insert Successful");
//   }
// })



//var items = [];
// var workItems = [];

app.get("/", function(request, response) {

  Item.find(function(err, listItems){

      if(listItems.length === 0){
        Item.insertMany(defaultItems,function(err){
          if(err){
            console.log(err);
          }else{
            console.log("Insert Successful");
            response.redirect("/");
          }
        });
      }else{
        response.render("list",{listTitle:"Today", itemList:listItems});
      }
  })
  //day = date.getDate();
  //response.render("list",{listTitle:"Today", itemList:listItems});
})

app.post("/",function(request,response){
  const itemName = request.body.newInput;
  const listName = request.body.list;

  const newItem = new Item({
    item: itemName
  })

  if(listName === "Today"){
    newItem.save();
    response.redirect("/");
  }else{
    List.findOne({name: listName}, function(err, result){
      result.items.push(newItem);
      result.save();
      response.redirect("/"+listName);
    })
  }


  // console.log(request.body.list);
  // if(request.body.list === "Work"){
  //   workItems.push(item);
  //   response.redirect("/work");
  // }else{
  //   items.push(item);
  //   response.redirect("/");
  // }

})

// app.get("/work", function(request,response){
//   response.render("list",{listTitle:"Work", itemList:workItems});
// })

app.get("/:customUrl",function(request,response){
  const newList = _.capitalize(request.params.customUrl);

  console.log(newList);
  List.findOne({name: newList}, function(err,result){

    if(!result){
      const list = new List({
        name: newList,
        items: defaultItems
      })
      list.save();
      response.redirect("/"+newList);
    }else{
      response.render("list",{listTitle:newList, itemList:result.items});
    }
  })
})

app.post("/delete",function(request,response){
  const id = request.body.deleteItem;
  const hiddenTitle = request.body.hiddenValue;
  if(hiddenTitle === "Today"){
    Item.findByIdAndRemove({_id:id},function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Delete Successful");
        response.redirect("/");
      }
    })
  }else{
    List.findOneAndUpdate({name:hiddenTitle},{$pull: {items:{_id:id}}},function(err){
      if(!err){
        console.log("Delete Successful")
        response.redirect("/"+hiddenTitle);
      }
    })
  }
})

app.listen(PORT || 3000, function(){
  console.log("App is Live");
});

//  console.log(today);
//  var day = "";

  // switch (today) {
  //   case 0:
  //     day = "Sunday";
  //     break;
  //   case 1:
  //     day = "Monday";
  //     break;
  //   case 2:
  //     day = "Tuesday";
  //     break;
  //   case 3:
  //     day = "Wednesday";
  //     break;
  //   case 4:
  //     day = "Thursday";
  //     break;
  //   case 5:
  //     day = "Friday";
  //     break;
  //   case 6:
  //     day = "Saterday";
  //     break;
  //   default:
  //
  // }
