var firebaseConfig = {
    apiKey: "AIzaSyCLtWYNz7RJDNfwTbjiI8ReYhvYhHws-MU",
    authDomain: "ai-examiner.firebaseapp.com",
    databaseURL: "https://ai-examiner-default-rtdb.firebaseio.com",
    projectId: "ai-examiner",
    storageBucket: "ai-examiner.appspot.com",
    messagingSenderId: "1098113736044",
    appId: "1:1098113736044:web:8240db83f4bd229fbb2749"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

noseY = 0;
noseX = 0;
warning = 0;
check = "false";
var nam = "";
var user_name = "";

document.getElementById("frm").style.display = "none";

function preload() {

}

function name() {
    user_name = localStorage.getItem("user_name_ai");
    var ref = firebase.database().ref(user_name);

    ref.once("value", function (snapshot) {
        snapshot.forEach(function (fnc) {
            nam = fnc.key;
        });
    })
}

uname = "Welcome " + user_name;
document.getElementById("Name").innerHTML = uname;

function setup() {
    canvas = createCanvas(300, 300);
    camera = createCapture(VIDEO);
    console.log("Camera Permission asked!");
    camera.size(300, 300);
    camera.hide();
    camera.center();
    ai = ml5.poseNet(camera, modelLoaded);
    ai.on('pose', getPoses);
}

function getPoses(results) {
    document.getElementById("frm").style.display = "block";
    console.log(results);
    noseX = Math.floor(results[0].pose.nose.x);
    noseY = Math.floor(results[0].pose.nose.y);
    nose = "false";
    console.log("x: " + noseX);
    console.log("y: " + noseY);
    setTimeout(change, 5000);


    function change() {
        document.getElementById("body").style.backgroundColor = "lightgreen";
        if (noseX <= 160) {
            move();
        }
        if (noseX >= 178) {
            move();
        }
        if (noseY >= 161) {
            move();
        }
        if (noseY <= 143) {
            move();
        }
    }
}

function move() {
    nose = "true";
    console.log("x: " + noseX);
    console.log("y: " + noseY);
    console.log("button clicked!");
    document.getElementById("body").style.backgroundColor = "red";
    setTimeout(detect, 500)
}

function detect() {
    var ref = firebase.database().ref(user_name);

    ref.on("value", function (snapshot) {
        snapshot.forEach(function (child) {

            if (child.val().warnings == 2) {
                camera.remove();
                camera.stop();
                canvas.hide();
                document.getElementById("frm").style.display = "none";
                document.getElementById("warning").innerHTML = "As you were found cheating! Your form has been blocked!";
                document.getElementById("warning").style.fontWeight = "bold";
                document.getElementById("body").style.backgroundColor = "red";
                nose = "false";
            }
            else {
                warning = warning + 1;
                ref = firebase.database().ref(nam)
                ref.once("value", function (snapshot) {
                    snapshot.forEach(function (child) {
                        w = child.val().warnings + 1;
                        ref.child(user_name).update({
                            warnings: w
                        });
                    })
                })
            }
        }
        )
    }
    )
}


function modelLoaded() {
    console.log("Model Successfully Integrated!");
}

function draw() {
    image(camera, 0, 0, 300, 300);
    fill("white");
    circle(170, 150, 150);
    circle(noseX, noseY, 20);
    circle(170, 150, 20);
    fill('White');
}

function take_snapshot() {
    save("Picture.png");
}