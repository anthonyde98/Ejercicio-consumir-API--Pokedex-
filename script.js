const btnBuscar = document.getElementById("buscar");
const formulario = document.getElementById("formulario");
const btnToTop = document.getElementById("btnToTop");
const toast = document.getElementById('toast');
const toastTitle = document.getElementById("title");
const toastMessage = document.getElementById("message");
const pokemonContainer = document.getElementById("pokemon-container");
let myAudio;
let pokemonInfo;

// ----------------------------------------------------------------------------

onscroll = () => {
    scrollTop();
}

btnBuscar.addEventListener("click", (e) => {
    e.preventDefault();
})

onload = () => {
    myAudio = new Audio('/assets/sounds/SaffronCity.mp3'); 
    if (typeof myAudio.loop == 'boolean')
    {
        myAudio.loop = true;
    }
    else
    {
        myAudio.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
    }
}

// ----------------------------------------------------------------------------

const audioControl = () => {
    const audioIcon = document.getElementById("audioIcon");
    let icon = "fad fa-";
    if(myAudio.paused){
        myAudio.play();
        icon += "pause";
    }
    else{
        myAudio.pause();
        icon += "play";
    }

    audioIcon.className = icon;
}

// ----------------------------------------------------------------------------

const scrollTop = () => {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        btnToTop.style.display = "block";
    } else {
        btnToTop.style.display = "none";
    }
}

const goTo = (direccionY) => {
    document.body.scrollTop = direccionY; 
    document.documentElement.scrollTop = direccionY;
}

// ---------------------------------------------------------------------------

const buscarPokemon = async () => {
    pokemonInfo = {
        name: "",
        image: "",
        types: [],
        height: 0,
        weight: 0,
        stats: [],
        moves: []
    };

    let pokemonNombre = new FormData(formulario).get("nombre").toLowerCase();
    if(pokemonNombre === ""){
        mostrarToast("warning", "Requerido", "Se requiere el nombre de un Pokemon para hacer la busqueda.");
        return;
    }

    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonNombre}`;
    let res = await fetch(url);
    if(res.status === 200){
        let pokemonData = await res.json();
        pokemonInfo.name = pokemonData.name;
        pokemonInfo.image = pokemonData.sprites.other.home.front_default;
        pokemonData.types.forEach(tipo => {
            pokemonInfo.types.push(tipo.type.name);
        })
        pokemonInfo.height = pokemonData.height;
        pokemonInfo.weight = pokemonData.weight;
        pokemonData.stats.forEach(stat => {
            pokemonInfo.stats.push({result: stat.base_stat, name: stat.stat.name});
        })
        pokemonData.moves.forEach(move => {
            pokemonInfo.moves.push(move.move.name);
        })

        mostrarInformacion();
    }
    else if(res.status === 404){
        mostrarToast("error", "No encontrado", "No se encontró este Pokemon.")
    }
    else if(res.status >= 500){
        mostrarToast("error", "¡Error en el servidor!", "Ocurrió un error en el servidor.")
    }
}

const mostrarInformacion = () => {

    const pokemonName = () => {
        pokemonInfo.name = pokemonInfo.name[0].toUpperCase() + pokemonInfo.name.slice(1)
        return `<p id="pokemonName">${pokemonInfo.name}</p>`;
    }

    const pokemonImage = () => {
        return `<img src="${pokemonInfo.image}" alt="${pokemonInfo.name}">`;
    }


    const pokemonData = () => {

        const formatearDato = (dato) => {
            dato = dato.replace("-", " ");
            dato = dato.replace(dato[0], dato[0].toUpperCase());

            return dato;
        }

        const caracteristicas = () => {
            
            let tipo = "";

            for(let i = 0; i < pokemonInfo.types.length; i++){
                if(i === pokemonInfo.types.length - 1){
                    tipo += pokemonInfo.types[i];
                }
                else{
                    tipo += pokemonInfo.types[i] + ", "
                }
            }

            return `
            <div class="principal">
                <p class="title">Caracterísiticas</p>
                <div class="second-container">
                    <p>Tipo: <span>${tipo}</span></p>
                    <p>Peso: <span>${pokemonInfo.weight / 10} kg</span></p>
                    <p>Altura: <span>${pokemonInfo.height / 10} m</span></p>
                </div>
            </div>`
        }

        const estadisticas = () => {

            let stats = ``;

            for(let i = 0; i <pokemonInfo.stats.length; i++){
                stats += `<p>${formatearDato(pokemonInfo.stats[i].name)}: <span>${pokemonInfo.stats[i].result}</span></p>`
            }

            return `
            <div class="principal">
                <p class="title">Estadísticas</p>
                <div class="second-container">
                    ${stats}
                </div>
            </div>
            `
        }

        const movimientos = () => {

            let movimientos = ``;

            for(let i = 0; i <pokemonInfo.moves.length; i++){
                movimientos += `<p class="move"><span>${formatearDato(pokemonInfo.moves[i])}</span></p>`
            }

            return `
            <div class="principal">
                <p class="title">Movimientos</p>
                <div class="second-container">
                    ${movimientos}
                </div>
            </div>
            `
        }

        return `
        <div class="info">
        ${
            caracteristicas() +
            estadisticas() +
            movimientos()
        }
        </div>`
    }

    pokemonContainer.innerHTML = pokemonName() + pokemonImage() + pokemonData();
}

// -----------------------------------------------------------------------------

const mostrarToast = (tipo, titulo, mensaje) => {
    toast.style.backgroundColor = tipo === "warning" ? "rgb(236, 190, 62)" : tipo === "error" ? "rgb(245, 58, 58)" : "rgb(62, 236, 129)";
    toast.style.animation = "bounceInRight 1s";
    toast.style.display = "block";
    toastTitle.innerText = titulo;
    toastMessage.innerHTML = mensaje;
    ocultarToast();
}

const ocultarToast = () => {
    setTimeout(() => {
        toast.style.animation = "bounceOutRight 1s";
        setTimeout(() => {
            toast.style.display = "none";
        }, 900);
    }, 4000);
}

