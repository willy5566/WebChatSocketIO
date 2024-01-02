var socket = io();

document.addEventListener('DOMContentLoaded', () => {
    var status = document.getElementById('status');
    var online = document.getElementById('online');
    var sendForm = document.getElementById('send-form');
    var content = document.getElementById('content');

    socket.on('connect', function() {
        status.innerText = 'Connencted.';
    });
    
    socket.on('disconnect', function (){
        status.innerText = 'Disconnencted.';
    });

    socket.on('online', function (amount){
        online.innerText = amount;
    });

    socket.on('msg', function (d){
        var msgBox = document.createElement('div');
        msgBox.className = 'msg';
        var nameBox = document.createElement('span');
        nameBox.className = 'name';
        var name = document.createTextNode(d.name);
        var msg = document.createTextNode(d.msg);

        nameBox.appendChild(name);
        msgBox.appendChild(nameBox);
        msgBox.appendChild(msg);
        content.appendChild(msgBox);
    });

    sendForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var ok = true;
        var formData = {};
        var formChild = sendForm.children;

        for( var i=0; i< sendForm.childElementCount; i++) {
            var child = formChild[i];
            if(child.name !== '') {
                var val = child.value;
                if(val === '' || !val) {
                    ok = false;
                    child.classList.add('error');
                } else {
                    child.classList.remove('error');
                    formData[child.name] = val;
                }
            }
        }

        if( ok ) socket.emit('send', formData);
    });
});

