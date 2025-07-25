sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], (BaseController, MessageBox, MessageToast, JSONModel) => {
    "use strict";

    return BaseController.extend("zplusap.sapui5.controller.ODataExamples", {

        /* =======================================================
         * INICIALIZACIÓN DEL CONTROLADOR
         * ======================================================= */
        onInit() {
            // Obtener referencias a los modelos
            this.oDataModelV2 = this.getOwnerComponent().getModel("oDataModelV2");
            this.oDataModelV4 = this.getOwnerComponent().getModel("oDataModelV4");
            this.localModel = this.getOwnerComponent().getModel("localModel");
            
            // Configurar modelo local para datos de Pokemon
            this.initializePokemonModel();
        },

        initializePokemonModel() {
            // Agregar propiedades para Pokemon al modelo local existente
            const oCurrentData = this.localModel.getData();
            
            // Extender datos existentes sin sobrescribir
            Object.assign(oCurrentData, {
                pokemonSearch: "",
                pokemonData: {},
                pokemonLoading: false,
                // Configuraciones para debugging
                debugMode: false,
                apiCallCount: 0
            });
            
            this.localModel.setData(oCurrentData);
            console.log("Pokemon model initialized with data:", oCurrentData);
        },

        /* =======================================================
         * NAVEGACIÓN
         * ======================================================= */
        onNavBack() {
            this.getOwnerComponent().getRouter().navTo("RouteMain");
        },

        /* =======================================================
         * ODATA V2 - BUSINESS PARTNER OPERATIONS
         * 
         * OData V2 es el estándar anterior de SAP para servicios web.
         * Características principales:
         * - Usa callbacks para operaciones asíncronas
         * - Binding principalmente OneWay
         * - Manejo manual de batch operations
         * - CRUD operations: create(), read(), update(), remove()
         * ======================================================= */
        onLoadODataV2Data() {
            MessageToast.show("Cargando datos de BusinessPartner desde OData V2...");
            
            // Ejemplo real de implementación con OData V2
            if (this.oDataModelV2) {
                // Configurar parámetros de consulta
                const aFilters = [];
                const aSorters = [];
                
                // Leer datos del BusinessPartnerSet
                this.oDataModelV2.read("/BusinessPartnerSet", {
                    filters: aFilters,
                    sorters: aSorters,
                    urlParameters: {
                        "$top": 10,
                        "$skip": 0
                    },
                    success: (oData) => {
                        MessageToast.show(`Datos cargados: ${oData.results.length} Business Partners`);
                        console.log("OData V2 Success:", oData);
                        
                        // En un caso real, los datos se bindarían automáticamente
                        // a través del modelo en la vista
                    },
                    error: (oError) => {
                        console.log("OData V2 Error (esperado en desarrollo sin ES5):", oError);
                        this.showODataV2MockData();
                    }
                });
            } else {
                console.log("Modelo OData V2 no inicializado, mostrando datos mock");
                this.showODataV2MockData();
            }
        },

        showODataV2MockData() {
            // Datos de demostración para OData V2
            const mockData = {
                results: [
                    {
                        BusinessPartnerID: "100000001",
                        FirstName: "John",
                        LastName: "Doe",
                        CompanyName: "SAP SE",
                        City: "Walldorf"
                    },
                    {
                        BusinessPartnerID: "100000002", 
                        FirstName: "Jane",
                        LastName: "Smith",
                        CompanyName: "Microsoft",
                        City: "Seattle"
                    },
                    {
                        BusinessPartnerID: "100000003",
                        FirstName: "Carlos",
                        LastName: "García",
                        CompanyName: "IBM",
                        City: "Madrid"
                    }
                ]
            };

            // Crear modelo temporal para mostrar datos
            const oMockModel = new JSONModel(mockData);
            this.getView().setModel(oMockModel, "businessPartnerMock");
            
            // Actualizar binding de la tabla
            const oTable = this.byId("businessPartnerTable");
            oTable.bindItems({
                path: "businessPartnerMock>/results",
                template: oTable.getBindingInfo("items").template
            });

            MessageToast.show("Datos de demostración cargados (OData V2)");
        },

        onCreateBusinessPartner() {
            MessageBox.information(
                "Crear Business Partner - OData V2\n\n" +
                "Método: this.oDataModelV2.create()\n" +
                "Estructura:\n" +
                "```javascript\n" +
                "const oNewData = {\n" +
                "  FirstName: 'Juan',\n" +
                "  LastName: 'Pérez',\n" +
                "  CompanyName: 'Mi Empresa',\n" +
                "  City: 'Madrid'\n" +
                "};\n\n" +
                "this.oDataModelV2.create('/BusinessPartnerSet', oNewData, {\n" +
                "  success: (oData) => {\n" +
                "    MessageToast.show('BP creado: ' + oData.BusinessPartnerID);\n" +
                "  },\n" +
                "  error: (oError) => {\n" +
                "    MessageBox.error('Error: ' + oError.message);\n" +
                "  }\n" +
                "});\n" +
                "```\n\n" +
                "Ventajas OData V2:\n" +
                "- Validación automática del servidor\n" +
                "- Generación automática de IDs\n" +
                "- Actualización automática del modelo\n" +
                "- Manejo de errores estructurado",
                {
                    title: "OData V2 - CREATE Operation",
                    icon: MessageBox.Icon.INFORMATION
                }
            );
        },

        onEditBusinessPartner(oEvent) {
            const oItem = oEvent.getSource().getParent().getParent();
            const oContext = oItem.getBindingContext("businessPartnerMock");
            const oData = oContext.getObject();

            MessageBox.information(
                `Editar Business Partner: ${oData.BusinessPartnerID}\n\n` +
                "En OData V2 se usa el método UPDATE:\n" +
                "- this.oDataModelV2.update(sPath, oUpdatedData)\n" +
                "- Envía PATCH/PUT al servicio\n" +
                "- Validación automática\n" +
                "- Refresh automático del modelo",
                {
                    title: "OData V2 - UPDATE Operation"
                }
            );
        },

        onDeleteBusinessPartner(oEvent) {
            const oItem = oEvent.getSource().getParent().getParent();
            const oContext = oItem.getBindingContext("businessPartnerMock");
            const oData = oContext.getObject();

            MessageBox.confirm(
                `¿Eliminar Business Partner ${oData.BusinessPartnerID}?\n\n` +
                "En OData V2 se usa el método REMOVE:\n" +
                "- this.oDataModelV2.remove(sPath)\n" +
                "- Envía DELETE al servicio\n" +
                "- Eliminación automática del modelo",
                {
                    title: "OData V2 - DELETE Operation",
                    onClose: (oAction) => {
                        if (oAction === MessageBox.Action.OK) {
                            MessageToast.show(`Business Partner ${oData.BusinessPartnerID} eliminado (simulado)`);
                        }
                    }
                }
            );
        },

        /* =======================================================
         * ODATA V4 - SALES ORDER OPERATIONS  
         * 
         * OData V4 es la versión más reciente y mejorada:
         * - Better binding y two-way data binding automático
         * - Operaciones más simples y intuitivas
         * - Mejor manejo de batch operations
         * - Context-based operations
         * - Mejor performance y menos llamadas al servidor
         * ======================================================= */
        onLoadODataV4Data() {
            MessageToast.show("Cargando datos de SalesOrder desde OData V4...");
            
            // Ejemplo real de implementación con OData V4
            if (this.oDataModelV4) {
                try {
                    // En OData V4, usamos binding contexts
                    const oListBinding = this.oDataModelV4.bindList("/SalesOrder", null, null, null, {
                        "$top": 10,
                        "$skip": 0,
                        "$orderby": "CreatedAt desc"
                    });
                    
                    // Manejar eventos de datos
                    oListBinding.attachEventOnce("dataReceived", (oEvent) => {
                        const aContexts = oListBinding.getContexts();
                        MessageToast.show(`Datos cargados: ${aContexts.length} Sales Orders`);
                        console.log("OData V4 Success:", aContexts);
                    });
                    
                    oListBinding.attachEvent("dataRequestFailed", (oEvent) => {
                        console.log("OData V4 Error (esperado en desarrollo):", oEvent.getParameter("error"));
                        this.showODataV4MockData();
                    });

                    // Solicitar los primeros 10 contextos
                    oListBinding.getContexts(0, 10);
                    
                } catch (error) {
                    console.log("Error al configurar OData V4 binding:", error);
                    this.showODataV4MockData();
                }
            } else {
                console.log("Modelo OData V4 no inicializado, mostrando datos mock");
                this.showODataV4MockData();
            }
        },

        showODataV4MockData() {
            // Datos de demostración para OData V4
            const mockData = [
                {
                    SalesOrderID: "5000000001",
                    Customer: "Customer A",
                    CreatedAt: "2024-01-15",
                    TotalAmount: "1,250.00 EUR"
                },
                {
                    SalesOrderID: "5000000002",
                    Customer: "Customer B", 
                    CreatedAt: "2024-01-16",
                    TotalAmount: "2,750.50 EUR"
                },
                {
                    SalesOrderID: "5000000003",
                    Customer: "Customer C",
                    CreatedAt: "2024-01-17", 
                    TotalAmount: "980.75 EUR"
                }
            ];

            // Crear modelo temporal
            const oMockModel = new JSONModel(mockData);
            this.getView().setModel(oMockModel, "salesOrderMock");
            
            // Actualizar binding de la tabla
            const oTable = this.byId("salesOrderTable");
            oTable.bindItems({
                path: "salesOrderMock>/",
                template: oTable.getBindingInfo("items").template
            });

            MessageToast.show("Datos de demostración cargados (OData V4)");
        },

        onCreateSalesOrder() {
            MessageBox.information(
                "Crear Sales Order - OData V4\n\n" +
                "Método: Binding Context + create()\n" +
                "Estructura:\n" +
                "```javascript\n" +
                "// 1. Obtener list binding\n" +
                "const oListBinding = this.oDataModelV4.bindList('/SalesOrder');\n\n" +
                "// 2. Crear nuevo context\n" +
                "const oNewData = {\n" +
                "  CustomerID: '100001',\n" +
                "  CustomerName: 'Cliente Demo',\n" +
                "  TotalAmount: 1500.00,\n" +
                "  Currency: 'EUR'\n" +
                "};\n\n" +
                "const oContext = oListBinding.create(oNewData);\n\n" +
                "// 3. El nuevo registro aparece inmediatamente en la UI\n" +
                "// 4. Para confirmar en el servidor:\n" +
                "this.oDataModelV4.submitBatch().then(() => {\n" +
                "  MessageToast.show('Sales Order creada');\n" +
                "});\n" +
                "```\n\n" +
                "Ventajas OData V4:\n" +
                "- Two-way binding automático\n" +
                "- Creación inmediata en UI (pending changes)\n" +
                "- Mejor control de transacciones\n" +
                "- API más simple y consistente",
                {
                    title: "OData V4 - CREATE Operation",
                    icon: MessageBox.Icon.INFORMATION
                }
            );
        },

        onEditSalesOrder(oEvent) {
            const oItem = oEvent.getSource().getParent().getParent();
            const oContext = oItem.getBindingContext("salesOrderMock");
            const oData = oContext.getObject();

            MessageBox.information(
                `Editar Sales Order: ${oData.SalesOrderID}\n\n` +
                "En OData V4 la edición es automática:\n" +
                "- Two-way binding directo\n" +
                "- oContext.setProperty('field', newValue)\n" +
                "- oModel.submitBatch() para confirmar\n" +
                "- Mejor control de cambios pendientes",
                {
                    title: "OData V4 - UPDATE Operation"
                }
            );
        },

        onDeleteSalesOrder(oEvent) {
            const oItem = oEvent.getSource().getParent().getParent();
            const oContext = oItem.getBindingContext("salesOrderMock");
            const oData = oContext.getObject();

            MessageBox.confirm(
                `¿Eliminar Sales Order ${oData.SalesOrderID}?\n\n` +
                "En OData V4 la eliminación es:\n" +
                "- oContext.delete()\n" +
                "- Manejo automático de dependencias\n" +
                "- Mejor control de errores",
                {
                    title: "OData V4 - DELETE Operation",
                    onClose: (oAction) => {
                        if (oAction === MessageBox.Action.OK) {
                            MessageToast.show(`Sales Order ${oData.SalesOrderID} eliminado (simulado)`);
                        }
                    }
                }
            );
        },

        /* =======================================================
         * REST API - POKEMON OPERATIONS
         * 
         * Para APIs REST externas, usamos JSONModel con jQuery AJAX:
         * - No hay metadatos estructurados como OData
         * - Manejo manual de CRUD operations
         * - Perfecto para APIs públicas y microservicios
         * - Flexibilidad total en el manejo de datos
         * ======================================================= */
        onLoadPokemonData() {
            // Cargar algunos Pokemon como ejemplo
            this.searchPokemon("1"); // Buscar Bulbasaur (#001)
        },

        onSearchPokemon() {
            const sSearch = this.localModel.getProperty("/pokemonSearch");
            if (!sSearch) {
                MessageBox.warning("Por favor, ingrese el nombre o ID del Pokemon a buscar.\n\nEjemplos válidos:\n- Nombres: pikachu, charizard, bulbasaur\n- IDs: 1, 25, 150");
                return;
            }
            this.searchPokemon(sSearch.toLowerCase().trim());
        },

        searchPokemon(sPokemon) {
            MessageToast.show(`Buscando Pokemon: ${sPokemon}...`);

            // Ejemplo de implementación REST con jQuery
            $.ajax({
                url: `https://pokeapi.co/api/v2/pokemon/${sPokemon}`,
                method: "GET",
                timeout: 10000, // 10 segundos de timeout
                beforeSend: () => {
                    // Mostrar indicador de carga
                    this.localModel.setProperty("/pokemonLoading", true);
                },
                success: (oData) => {
                    // Procesar datos recibidos
                    console.log("Pokemon data received:", oData);
                    
                    // Actualizar modelo local con datos estructurados
                    this.localModel.setProperty("/pokemonData", {
                        id: oData.id,
                        name: oData.name,
                        height: oData.height,
                        weight: oData.weight,
                        base_experience: oData.base_experience,
                        sprites: oData.sprites,
                        abilities: oData.abilities,
                        types: oData.types,
                        stats: oData.stats
                    });
                    
                    MessageToast.show(`Pokemon encontrado: ${oData.name.charAt(0).toUpperCase() + oData.name.slice(1)}`);
                },
                error: (jqXHR, textStatus, errorThrown) => {
                    console.error("Error al buscar Pokemon:", {
                        status: jqXHR.status,
                        statusText: textStatus,
                        error: errorThrown
                    });
                    
                    let sErrorMessage = `No se pudo encontrar el Pokemon: "${sPokemon}"`;
                    
                    if (textStatus === "timeout") {
                        sErrorMessage += "\n\nError: Tiempo de espera agotado.";
                    } else if (jqXHR.status === 404) {
                        sErrorMessage += "\n\nVerifique que el nombre o ID sea correcto.";
                    }
                    
                    MessageBox.error(sErrorMessage + "\n\nEjemplos válidos:\n- pikachu, charizard, bulbasaur\n- 1, 25, 150");
                    
                    // Limpiar datos anteriores
                    this.localModel.setProperty("/pokemonData", {});
                },
                complete: () => {
                    // Ocultar indicador de carga
                    this.localModel.setProperty("/pokemonLoading", false);
                }
            });
        },

        /* =======================================================
         * HELPER METHODS
         * ======================================================= */
        setUserID(aUsers) {
            // Método heredado del controlador Main para generar IDs
            let iMaxID = 0;
            aUsers.forEach(user => {
                const iCurrentID = parseInt(user.UserID.replace("USR", ""));
                if (iCurrentID > iMaxID) iMaxID = iCurrentID;
            });
            return `USR${String(iMaxID + 1).padStart(3, "0")}`;
        }

    });
});