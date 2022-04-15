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
        this.URLAPI = "https://apipetshop.herokuapp.com/api/articulos"
        fetch(this.URLAPI)
            .then(response => response.json())
            .then(data => {
                this.productos = data.response

                this.stockProductosEnStorage = JSON.parse(localStorage.getItem("favs"))
                if(this.stockProductosEnStorage){
                    this.storageCarrito = this.stockProductosEnStorage
                }
                
                this.filtro()
                console.log(this.productos)
                this.medFiltrados = this.medicamentos
                this.juguetesFiltrados = this.juguetes
            })
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
        totalDEtotales(){
            for(key in this.storageCarrito){
                suma = suma + (this.storageCarrito[key].cantidad * this.storageCarrito[key].precio)
                console.log(suma)
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
        alerta() {
            this.productos.forEach(producto => {
                if (producto.stock < 5) {
                }
            });
        },
        agregarCarrito(producto) {
            this.productosID = this.storageCarrito.map(producto => producto._id)

            if (!this.productosID.includes(producto._id)) {
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

            if (input.value < med.stock) {
                input.value++
            }

            console.log(input.value)
        },
        restarProductoCarrito(med){
            let input = document.getElementById(`${med._id}`)

            if (input.value > 0) {
                input.value--
            }
            console.log(input.value)
        },
        total(med){
            let input = document.getElementById(`${med._id}`)
            let parrafo = document.getElementById(`${med.imagen}`)
            let total = input.value * med.precio
            parrafo.innerHTML=`Precio total $${total}`
            console.log(parrafo)
        },
    },

}).mount("#app")