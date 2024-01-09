let express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

let app = express();

app.use(session({
    secret: 'GALTI MERI NHI THI KAHAN GAI THI KIYA PEHNA THA', // Change this to a random, secure key
    resave: false,
    saveUninitialized: true,
}));



const bodyParser = require("body-parser")

//firebase
const authentication = require('firebase/auth')
const firebaseApp = require("firebase/app")
const firebaseStore = require("firebase/firestore");
const { param } = require('express/lib/request');
const addDoc = firebaseStore.addDoc
const deleteDoc = firebaseStore.deleteDoc
const query = firebaseStore.query
const where = firebaseStore.where
const createUserWithEmailAndPassword  =  authentication.createUserWithEmailAndPassword
const signInWithEmailAndPassword = authentication.signInWithEmailAndPassword
const getAuth = authentication.getAuth
const orderBy = firebaseStore.orderBy
const doc = firebaseStore.doc

const firebaseConfig = {
    apiKey: "AIzaSyByG0fFkNn6wZj2jVSJKswjsHNeZExRv1M",
    authDomain: "chatting-app-52d94.firebaseapp.com",
    databaseURL: "https://chatting-app-52d94-default-rtdb.firebaseio.com",
    projectId: "chatting-app-52d94",
    storageBucket: "chatting-app-52d94.appspot.com",
    messagingSenderId: "636428941395",
    appId: "1:636428941395:web:f16f0e6da8e0f654b9aea6",
    measurementId: "G-R7PS9JJJH2"
};
firebaseApp.initializeApp(firebaseConfig);
const db = firebaseStore.getFirestore()


//required for body parser used for get the post value
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//ejs
app.set("view engine",require("ejs")) //ejs look for views folder and run the file 
//defining the folders so ejs can use this
app.use(express.static("public"))
app.use(express.static('uploads')); // Serve files from the 'uploads' directory
app.use(express.static("public/images"))



app.get("/home",(req,res)=>{
res.render("index.ejs")
})





// quarry
// const q = query(ref,where("Email","==","ahmadmujtabap70@gmail.com"))

// firebaseStore.onSnapshot(q,(snapshot)=>{
//     let users = []
//     snapshot.docs.forEach((doc)=>{
//         users.push({...doc.data(), id : doc.id})
//     })
//     console.log(users)
// })

// DELTEING
// const docref = firebaseStore.doc(db,"ChattingAPP","divqGoj8pgGMoTGFRQLt")

// deleteDoc(docref)






app.get("/sign/In",(req,res)=>{
    res.render("sign-in.ejs")
})

// const ref = firebaseStore.collection(db,"ChattingAPP")
// var allusers = []
// firebaseStore.getDocs(ref)
//         .then(async(snapshot)=>{
//             await new Promise((resolve,reject)=>{
//             allusers = []
//             snapshot.docs.forEach((doc)=>{
//                 allusers.push({...doc.data(), id : doc.id})
//             })
//             resolve()
//             })
//         })
//         .catch(err => {
//             console.log(err)
//         })
//         console.log(allusers)

// Declare allusers globally


// Function to fetch and update allusers

    const ref = firebaseStore.collection(db,"ChattingAPP")




// Call the function to fetch and update alluser



app.post("/create/acc",async(req,res)=>{
    console.log(req.body)
    let email = req.body.email
    let name = req.body.name
    let pwd = req.body.password
    const auth = getAuth();
createUserWithEmailAndPassword(auth, email, pwd)
    .then((userCredential) => {
    // Signed up 
    addDoc(ref,{
        Uname:name,
        Email:email
    })
    const user = userCredential.user;
    // ...
    })
    .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
    });
    res.redirect("/home")
})
var user, id;
app.post("/sign_in/acc", (req, res) => {
    let email = req.body.email
    let pwd = req.body.password
    const auth = getAuth();

    // Declare variables outside the promise chain
    

    signInWithEmailAndPassword(auth, email, pwd)
        .then((userCredential) => {
            // Signed in 
            const ref = firebaseStore.collection(db, "ChattingAPP")
            const q = query(ref, where("Email", "==", email))

            return firebaseStore.getDocs(q); // Returning a promise to continue the chain
        })
        .then((snapshot) => {
            let users = []
            snapshot.docs.forEach((doc) => {
                users.push({ ...doc.data(), id: doc.id })
            })
            user = users[0].Uname;
            id = users[0].id;
            // Continue the promise chain
            return Promise.resolve(); 
        })
        .then(() => {
            // Access the user and id variables here
            console.log("User:", user);
            console.log("ID:", id);
            // Perform the redirect
            res.redirect('/chattingAPP');
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
            res.status(500).send(errorMessage);
        });
});


// app.post("/sign_in/acc",(req,res)=>{
//     let email = req.body.email
//     let pwd = req.body.password
//     const auth = getAuth();
//     signInWithEmailAndPassword(auth, email, pwd)
//     .then((userCredential) => {
//     // Signed in
//     const ref = firebaseStore.collection(db,"ChattingAPP")
//     const q = query(ref,where("Email","==",email))
    
//     firebaseStore.onSnapshot(q,(snapshot)=>{
//         let users = []
//         snapshot.docs.forEach((doc)=>{
//             users.push({...doc.data(), id : doc.id})
//         })
//         var user
//         var id
//         user = users[0].Uname;
//         id = users[0].id;
//         // console.log("this user logged in",req.session.user);
//         // res.redirect('/chattingAPP?aiuhn7289sndwww97='+req.session.user+'&aiuhn7rf9s22ww97='+req.session.id)
//         res.redirect('/chattingAPP')
//     })
//     const user = userCredential.user;
//     console.log(user)
//     })
//     .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     console.log(errorMessage)
//     });
// })


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Set the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        cb(null, fileName);
      }
  });
  
  const upload = multer({ storage: storage });
  


app.post('/upload', upload.single('file'), async(req,res,next) => {
    
    const uploadedFileName = req.file.filename;
    console.log(uploadedFileName)
    const sending_id = req.body.param2
    const Receiving_id = req.body.param1
    
    console.log(sending_id,Receiving_id,uploadedFileName)
    
    const counter_ref = firebaseStore.collection(db,"counter")
    var counter 
    await new Promise((resolve, reject)=>{
        firebaseStore.getDocs(counter_ref)
        .then((snapshot)=>{
            count = []
            snapshot.docs.forEach((doc)=>{
                count.push({...doc.data(), id : doc.id})
            })
            console.log(count)
            counter = count
            resolve()
        })
    }) 
        console.log("this",counter)
        const ref2 = firebaseStore.collection(db,"Messages")
        let documentId = counter[0].count
        console.log(documentId)
        const jsonString = JSON.stringify(documentId);
        const documentRef = firebaseStore.doc(ref2, jsonString);
        firebaseStore.setDoc(documentRef,{
            msg:uploadedFileName,
            file:"1",
            sentby:sending_id,
            sentto:Receiving_id
        })
        documentId++
        const counterRef = firebaseStore.doc(counter_ref,"YWs7KSnGVWa29sSVtDgc");
        firebaseStore.setDoc(counterRef,{
            count: documentId
        })

    res.redirect('/chattingAPP');
    console.log("idk")
  });

  app.get('/download/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, 'uploads', fileName);
  
    // Set appropriate headers for the response
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/octet-stream');
  
    // Send the file as a stream
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });



app.post("/New/Chat",async(req,res)=>{
    const sending_id = req.body.param2
    const Receiving_id = req.body.param1
    const message = req.body.param3
    
    console.log(sending_id,Receiving_id,message)
    
    const counter_ref = firebaseStore.collection(db,"counter")
    var counter
    await new Promise((resolve, reject)=>{
        firebaseStore.getDocs(counter_ref)
        .then((snapshot)=>{
            count = []
            snapshot.docs.forEach((doc)=>{
                count.push({...doc.data(), id : doc.id})
            })
            console.log(count)
            counter = count
            resolve()
        })
    }) 
        console.log("this",counter)
        const ref2 = firebaseStore.collection(db,"Messages")
        let documentId = counter[0].count
        console.log(documentId)
        const jsonString = JSON.stringify(documentId);
        const documentRef = firebaseStore.doc(ref2, jsonString);
        firebaseStore.setDoc(documentRef,{
            msg:message,
            sentby:sending_id,
            sentto:Receiving_id
        })
        documentId++
        const counterRef = firebaseStore.doc(counter_ref,"YWs7KSnGVWa29sSVtDgc");
        firebaseStore.setDoc(counterRef,{
            count: documentId
        })

    res.redirect('/chattingAPP');
})

app.post("/unblur", async (req, res) => {
    try {
        console.log("i am working")
      const Receiving_id = req.body.param1;
      const sending_id = req.body.param2;
      const imageSource = req.body.param3;
  
      const ref2 = firebaseStore.collection(db, "Messages");
      const q = query(ref2, where("msg", "==", imageSource));
  
      const querySnapshot = await firebaseStore.getDocs(q);
  
      // Use Promise.all to ensure all updates are completed before sending a response
      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const docRef = doc.ref;
          await firebaseStore.updateDoc(docRef, {
            file: "0"
          });
          console.log("Document successfully updated!");
        })
      );
  
      res.status(200).send("Update successful");
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  



app.post("/Check/New/Chat",(req,res)=>{
    const Receiving_id = req.body.param1
    const sending_id = req.body.param2
    const orderBy = firebaseStore.orderBy
    const ref2 = firebaseStore.collection(db,"Messages")
    const q = query(ref2, where("sentto", "==", Receiving_id), where("sentby", "==", sending_id));
    const qOR = query(ref2, where("sentby", "==", Receiving_id), where("sentto", "==", sending_id));
    
    // Use Promise.all to wait for both queries to complete
    Promise.all([
        firebaseStore.getDocs(q),
        firebaseStore.getDocs(qOR)
    ]).then(results => {
        const msgs = [];
    
        // Process results of the first query
        results[0].docs.forEach(doc => {
            msgs.push({ ...doc.data(), id: doc.id });
        });
    
        // Process results of the second query
        results[1].docs.forEach(doc => {
            msgs.push({ ...doc.data(), id: doc.id });
        });
    
        console.log(msgs);
        res.json({ success: true, messages: msgs });
    }).catch(error => {
        // Handle any errors that occurred during the queries
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    });
    

})
app.get("/chattingAPP",(req,res)=>{

    console.log("ayo",user,id)
    let users = {
        user:user,
        id:id
    }
        firebaseStore.getDocs(ref)
        .then((snapshot) => {
            // Clear the array before populating it with new data
            var allusers = [];
            snapshot.docs.forEach((doc) => {
                allusers.push({ ...doc.data(), id: doc.id });
            });
             res.render("chatting.ejs",{user:users, allusers:allusers})
        })
        .catch(err => {
            console.log(err);
        });
   
})


app.listen(3000,() =>{
    console.log("i am starting get aside")
})
