window.onload=function(){
    var stage, renderer;
    stage = new PIXI.Stage(0x0000ff, true);
    // stage.setInteractive(true);
    renderer = PIXI.autoDetectRenderer(320, 320, myCanvas);

    players = [];
    // sprites = [];
    // sprite = ''

 //    function findWithAttr(array, attr, value) {
    //     for(var i = 0; i < array.length; i += 1) {
    //         if(array[i][attr] === value) {
    //             return i;
    //         }
    //     }
    // }



/*setInterval( function () {
    console.log('test')
}, 1000 );*/


    createThing = function(name) {
        var newDiv = document.createElement("div"); 
        newDiv.setAttribute("id", name);
        var newContent = document.createTextNode(name); 
        newDiv.appendChild(newContent); 
        document.body.insertBefore(newDiv, document.getElementById("org_div1")); 


        r1 = new PIXI.Graphics();
        r1.beginFill(0x00FF00); r1.drawRect(0, 0, 10, 10);  r1.endFill();
        var texture = new PIXI.RenderTexture(10,10);
        texture.render(r1);
        sprite = new PIXI.Sprite(texture);
        sprite.anchor.x = sprite.anchor.y = 0.5;

        stage.addChild(sprite);

        players.push(name)
        console.log(players)
    }


    deleteThing = function(name) {
        var element = document.getElementById(name);
        element.outerHTML = "";
        delete element;

        stage.removeChildAt(players.indexOf(name))
        players.splice(players.indexOf(name), 1);
        console.log(players)
    }

    requestAnimFrame(animate);

    var socket = io.connect();

    socket.on('connect', function() { 
        console.log('connected to server');
        socket.emit('m5', JSON.stringify({'name': 'listener'}))
    });
obj = '';


    socket.on('m4', function(data) {
        // new player
        obj = JSON.parse(data);
        console.log('received new player: ' + obj.name)
        // CREATE SPRITE HERE
        createThing(obj.name)
    });


    socket.on('m6', function(data) {
        // newly connected, get player list
        obj = JSON.parse(data);
        console.log('get player list: ' + obj)
        obj.forEach(function(entry) {
            createThing(entry);
        });
    });


    socket.on('m5', function(data) {
        // delete player
        obj = JSON.parse(data);
        console.log('delete player: ' + obj.name)
        // CREATE SPRITE HERE
        deleteThing(obj.name)

    });

    socket.on('m2', function(data) {
        // receive coordinates and rotation
        obj = JSON.parse(data);
        // console.log(obj);

       document.getElementById(obj.n).innerText = obj.n +': ' +
          Math.round(obj.cx*100)/100 + '/' +
          Math.round(obj.cy*100)/100 + '/' + 
          Math.round(obj.cz*100)/100 + ',' + 
          Math.round(obj.rx*100)/100 + '/' + 
          Math.round(obj.ry*100)/100 + '/' + 
          Math.round(obj.rz*100)/100
 

        // var i = findWithAttr(players, 'name', obj.n) 

        var s = stage.getChildAt(players.indexOf(obj.n))
        s.position.x = 160 + obj.cx;
        s.position.y = 160 + obj.cz;
        s.rotation = -obj.ry;
        // if (i == undefined) {
        //  players.push( {'name': obj.n, 'time': Date.now() });
        //  console.log(players)
        // }
        // else
        // {
        //  players[i].time = Date.now();
        // }


        // if (players.indexOf(obj.n) == -1 )  {
        //     players.push(obj.n)
        //    console.log(players)
        // }
        // var index = array.indexOf(2); // index is assigned 0
        // index = array.indexOf(7); // index is assigned -1
    });

    function animate() {
        requestAnimFrame(animate);

        renderer.render(stage);
    }
}