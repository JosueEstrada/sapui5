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
            // Agregar propiedades para Pokemon al modelo local
            const oCurrentData = this.localModel.getData();
            oCurrentData.pokemonSearch = "";
            oCurrentData.pokemonData = {};
            this.localModel.setData(oCurrentData);
        },

        /* =======================================================
         * NAVEGACIÓN
         * ======================================================= */
        onNavBack() {
            this.getOwnerComponent().getRouter().navTo("RouteMain");
        },

        /* =======================================================
         * ODATA V2 - BUSINESS PARTNER OPERATIONS
         * ======================================================= */
        onLoadODataV2Data() {
            MessageToast.show("Cargando datos de BusinessPartner desde OData V2...");
            
            // Nota: En un ambiente real, esto cargaría datos del servicio ES5
            // Para demostración, mostramos la estructura y método
            
            if (this.oDataModelV2) {
                // Ejemplo de lectura de BusinessPartnerSet
                this.oDataModelV2.read("/BusinessPartnerSet", {
                    success: (oData) => {
                        MessageToast.show(`Datos cargados: ${oData.results.length} Business Partners`);
                        console.log("OData V2 Success:", oData);
                    },
                    error: (oError) => {
                        // En desarrollo sin conexión real al servicio
                        console.log("OData V2 Error (esperado en desarrollo):", oError);
                        this.showODataV2MockData();
                    }
                });
            } else {
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
                "Crear Business Partner\n\n" +
                "En OData V2 se usa el método CREATE:\n" +
                "- this.oDataModelV2.create('/BusinessPartnerSet', oNewData)\n" +
                "- Automáticamente envía POST al servicio\n" +
                "- Maneja validaciones del servidor\n" +
                "- Actualiza el modelo tras éxito",
                {
                    title: "OData V2 - CREATE Operation"
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
         * ======================================================= */
        onLoadODataV4Data() {
            MessageToast.show("Cargando datos de SalesOrder desde OData V4...");
            
            // En un ambiente real, esto cargaría datos del servicio V4
            // Para demostración, mostramos la estructura y método
            
            if (this.oDataModelV4) {
                // Ejemplo de binding con OData V4
                const oBinding = this.oDataModelV4.bindList("/SalesOrder");
                oBinding.attachEventOnce("dataReceived", (oEvent) => {
                    const aData = oEvent.getParameter("data");
                    MessageToast.show(`Datos cargados: ${aData.length} Sales Orders`);
                });
                
                // En caso de error (desarrollo sin servicio real)
                oBinding.attachEvent("dataRequestFailed", () => {
                    this.showODataV4MockData();
                });

                // Solicitar datos
                oBinding.getContexts(0, 10);
            } else {
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
                "Crear Sales Order\n\n" +
                "En OData V4 las operaciones son más simples:\n" +
                "- const oBinding = oModel.bindList('/SalesOrder')\n" +
                "- const oContext = oBinding.create(oNewData)\n" +
                "- Automático two-way binding\n" +
                "- Mejor manejo de transacciones",
                {
                    title: "OData V4 - CREATE Operation"
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
         * ======================================================= */
        onLoadPokemonData() {
            // Cargar los primeros Pokemon como ejemplo
            this.searchPokemon("1"); // Buscar Bulbasaur
        },

        onSearchPokemon() {
            const sSearch = this.localModel.getProperty("/pokemonSearch");
            if (!sSearch) {
                MessageBox.warning("Por favor, ingrese el nombre o ID del Pokemon a buscar.");
                return;
            }
            this.searchPokemon(sSearch.toLowerCase());
        },

        searchPokemon(sPokemon) {
            MessageToast.show(`Buscando Pokemon: ${sPokemon}...`);

            // Usar jQuery para realizar la llamada REST
            $.ajax({
                url: `https://pokeapi.co/api/v2/pokemon/${sPokemon}`,
                method: "GET",
                success: (oData) => {
                    // Actualizar modelo local con datos del Pokemon
                    this.localModel.setProperty("/pokemonData", oData);
                    MessageToast.show(`Pokemon encontrado: ${oData.name}`);
                    console.log("Pokemon data:", oData);
                },
                error: (jqXHR, textStatus, errorThrown) => {
                    console.error("Error al buscar Pokemon:", errorThrown);
                    MessageBox.error(`No se pudo encontrar el Pokemon: ${sPokemon}\n\nVerifique el nombre o ID e intente nuevamente.`);
                    
                    // Limpiar datos anteriores
                    this.localModel.setProperty("/pokemonData", {});
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