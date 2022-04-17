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
                if (this.stockProductosEnStorage) {
                    this.storageCarrito = this.stockProductosEnStorage
                }


                this.contadorCantidadProductosCarrito()
                this.filtro()
            })
            .catch(err => console.error(err))
    },

    computed: {
        buscadorMed() {
            if (!this.nombreDelBuscador == "") {
                this.medFiltrados = this.medicamentos.filter(producto => producto.nombre.toUpperCase().includes(this.nombreDelBuscador.toUpperCase()))
            } else {
                this.medFiltrados = this.medicamentos
            }
        },
        buscadorJuguetes() {
            if (!this.nombreDelBuscador == "") {
                this.juguetesFiltrados = this.juguetes.filter(producto => producto.nombre.toUpperCase().includes(this.nombreDelBuscador.toUpperCase()))
            } else {
                this.juguetesFiltrados = this.juguetes
            }
        },
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
        agregarCarrito(producto) {
            this.productosID = this.storageCarrito.map(producto => producto._id)
            if (!this.productosID.includes(producto._id)) {
                producto.cantidad = 1
                this.storageCarrito.push(producto)
                localStorage.setItem("favs", JSON.stringify(this.storageCarrito))
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
        restarProductoCarrito(med) {
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
        contadorCantidadProductosCarrito() {
            let localS = JSON.parse(localStorage.getItem("favs"))
            if(localS != null) {
                let spanCarrito = document.getElementById("spanCarrito")
                let almacenDeCantidad = 0
                localS.forEach(producto => {
                    almacenDeCantidad += Number(producto.cantidad)
                });
                spanCarrito.innerHTML=`${almacenDeCantidad}`
            }
        },
        total() {
            let traerProductos = JSON.parse(localStorage.getItem("favs"))
            let sumaAux = 0;
            if (traerProductos != null) {
                traerProductos.map(prod => sumaAux += (prod.precio * prod.cantidad))
                let divTotal = document.getElementById("totalFinal")
                divTotal.innerHTML=`<h3>El total de su compra es: $${sumaAux}</h3>`
            }
            else {
                console.log("vacio")
            }
        },
        comprar() {
            let traerProductos = JSON.parse(localStorage.getItem("favs"))
            traerProductos.map(product =>{
                let med = this.medicamentos.findIndex(element => element._id === product._id)                
                let jug = this.juguetes.findIndex(element => element._id === product._id)

                if(med != -1){
                    this.medicamentos[med].stock -= Number(product.cantidad)
                }
                else if(jug != -1) {
                    this.juguetes[jug].stock -= Number(product.cantidad)
                }
            })
            localStorage.clear()
            this.storageCarrito = []
            let spanCarrito = document.getElementById("spanCarrito")
            spanCarrito.innerHTML=``
            window.alert("Gracias por su compra")
        }
    },

}).mount("#app")