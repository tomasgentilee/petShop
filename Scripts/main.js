Vue.createApp({

    data() {
        return {
            URLAPI: "",
            productos: [],
            juguetes: [],
            medicamentos: [],
            medFiltrados: [],
            juguetesFiltrados: [],
            storageCarrito: [],
            stockProductosEnStorage: [],
            productosID: [],
            nombreDelBuscador: "",
            cantidadProd: [],
        }
    },

    created() {
        URLAPI = "https://apipetshop.herokuapp.com/api/articulos"
        fetch(URLAPI)
            .then(response => response.json())
                .then(data => {
                this.productos = data.response
                
                this.stockProductosEnStorage = JSON.parse(localStorage.getItem("favs"))
                if(this.stockProductosEnStorage){
                    this.storageCarrito = this.stockProductosEnStorage
                }
                
                this.filtro()
                this.medFiltrados = this.medicamentos
                this.juguetesFiltrados = this.juguetes
            })
            .catch(err => console.log(err))
    },

    computed: {
        buscadorMed() {
            if (!this.nombreDelBuscador == "") {
                this.medFiltrados = this.medFiltrados.filter(producto => producto.nombre.toUpperCase().includes(this.nombreDelBuscador.toUpperCase()))
            } else {
                this.medFiltrados = this.medicamentos
            }
        },
        buscadorJuguetes() {
            if (!this.nombreDelBuscador == "") {
                this.juguetesFiltrados = this.juguetesFiltrados.filter(producto => producto.nombre.toUpperCase().includes(this.nombreDelBuscador.toUpperCase()))
            } else {
                this.juguetesFiltrados = this.juguetes
            }
        },
        total(){
            let traerProductos = JSON.parse(localStorage.getItem("favs"))
            console.log(traerProductos)
            let sumaAux = 0;
            if(traerProductos.length > 1){
                traerProductos.map(prod => sumaAux += (prod.precio * prod.cantidad))
            }
            console.log(sumaAux)
            return sumaAux
        },
        /* totalDeTotales(){
                let suma = 0;
                for(key in this.storageCarrito){
                    suma = suma + (this.storageCarrito[key].cantidad * this.storageCarrito[key].precio)
                }
                return suma
            },  */
    },
        
    methods: {
        filtro() {
            this.productos.forEach(producto => {
                if (producto.tipo == "Juguete") {
                    this.juguetes.push(producto)
                } else if (producto.tipo == "Medicamento") {
                    this.medicamentos.push(producto)
                }
            });
        },
        alerta() {
            this.productos.forEach(producto => {
                if (producto.stock < 5) {
                }
            });
        },
        agregarCarrito(producto) {
            this.productosID = this.storageCarrito.map(producto => producto._id)     
            if (!this.productosID.includes(producto._id)) {
                producto.cantidad = 1
                this.storageCarrito.push(producto)
                localStorage.setItem("favs", JSON.stringify(this.storageCarrito))
                
                console.log(this.storageCarrito)
            }
        },
        removerCarrito(producto) {
            this.storageCarrito = this.stockProductosEnStorage
            this.stockProductosEnStorage = this.stockProductosEnStorage.filter(prod => prod._id !== producto._id)
            
            localStorage.setItem("favs", JSON.stringify(this.stockProductosEnStorage))
        },
        sumarProductoCarrito(med) {
            let input = document.getElementById(`${med._id}`)
            let localS = JSON.parse(localStorage.getItem("favs"))
            let localSCopy = [...localS]
            let localSFilterToModify = localS.filter(product => product._id == med._id)
            if (input.value < med.stock) {
                ++input.value
                localSFilterToModify[0].cantidad = input.value
            }
            let localScopyFiltered = localSCopy.filter(prod => prod._id != med._id)
            localScopyFiltered.push(localSFilterToModify[0])
            localStorage.clear()
            localStorage.setItem("favs", JSON.stringify(localScopyFiltered))
        },
        restarProductoCarrito(med){
            let input = document.getElementById(`${med._id}`)
            let localS = JSON.parse(localStorage.getItem("favs"))
            let localSCopy = [...localS]
            let localSFilterToModify = localS.filter(product => product._id == med._id)
            if (input.value > 0) {
                --input.value
                localSFilterToModify[0].cantidad = input.value
            }
            let localScopyFiltered = localSCopy.filter(prod => prod._id != med._id)
            localScopyFiltered.push(localSFilterToModify[0])
            localStorage.clear()
            localStorage.setItem("favs", JSON.stringify(localScopyFiltered))
        },
    },

}).mount("#app")