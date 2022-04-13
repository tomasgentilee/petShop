Vue.createApp({

    data() {
        return {
            URLAPI: "",
            init: {
                method: "GET",
                headers: {
                    "X-API-Key": "GU2JQsNXZER2jsjiqsV0sW7TgEEp3iN7Aop5IGRP"
                }
            },

        }
    },

    created() {
        this.URLAPI = ""
        fetch(this.URLAPI, this.init)
            .then(response => response.json())
            .then(data => {
                
            })
    },

    computed: {  
    },

    methods: {
    },
    
}).mount("#app")