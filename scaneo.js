const response = document.getElementById("response");
const img_true = document.getElementById("img_true");
const btnScanner = document.getElementById("btnScanner");
let scanner = new Instascan.Scanner({
        continuous: true,
        video: document.getElementById('preview'),
        mirror: false,
        refractoryPeriod: 5000,
        scanPeriod: 5
    } );
scanner.addListener('scan', function(content) {   
    fetch('https://scanner-f97e1-default-rtdb.firebaseio.com/clientes.json')
    .then((response) => response.json())
    .then((data) => {
        data.map((cliente,index)=>{
            let nombre=content.split("-");
            response.classList.remove("none")
            response.classList.add("block")
            if(cliente.content===content ){
                if (cliente.number_scanners==0) {
                    response.innerHTML=nombre[0]+" fue verificado "
                    img_true.classList.remove("none")
                    img_true.classList.add("block")
                    let registro = new Date();
                    cliente.number_scanners++
                    fetch(`https://scanner-f97e1-default-rtdb.firebaseio.com/clientes/${index}.json`, {
                        method: "PATCH",
                        body: JSON.stringify({
                            date_scanner: registro.getHours.toLocaleString() + ":"+registro.getMinutes.toLocaleString(), 
                            number_scanners: cliente.number_scanners
                        }),
                        headers: {
                            "Content-Type" : "application/json"
                        }
                    })
                }else{
                    if(cliente.number_scanners>=1) {
                        img_true.classList.remove("block")
                        img_true.classList.add("none")
                        response.innerHTML="Este codigo ya fue escaneado <br/> "+cliente.date_scanner
                    }
                }
            }
        })
    });
});
Instascan.Camera.getCameras().then(cameras => {
    if(cameras.length > 0){             
        scanner.start(cameras[2]);
    } else {
        console.error("No existe câmera no dispositivo!");
    }
});
