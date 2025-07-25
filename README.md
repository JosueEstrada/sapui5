# Consumo de Servicios OData y REST en SAPUI5

## Descripción

Esta aplicación demuestra el consumo de diferentes tipos de servicios de datos en SAPUI5, incluyendo:

- **JSON Model**: Gestión local de usuarios (ejemplo base)
- **OData V2 Model**: BusinessPartner desde SAP Gateway ES5
- **OData V4 Model**: SalesOrder desde SAP S/4HANA
- **REST Model**: Pokemon API externa

## Estructura del Proyecto

```
webapp/
├── controller/
│   ├── BaseController.js         # Controlador base
│   ├── Main.controller.js        # Gestión de usuarios (JSON Model)
│   ├── Detail.controller.js      # Vista detalle de usuario
│   ├── ODataExamples.controller.js # Ejemplos OData y REST
│   └── App.controller.js         # Controlador principal
├── view/
│   ├── Main.view.xml             # Vista principal con JSON Model
│   ├── Detail.view.xml           # Vista detalle de usuario
│   ├── ODataExamples.view.xml    # Vista de ejemplos OData/REST
│   └── App.view.xml              # Vista contenedora
├── model/
│   ├── localModel.json           # Datos locales JSON
│   ├── models.js                 # Configuración de modelos
│   └── Formatter.js              # Formateadores
├── manifest.json                 # Descriptor de aplicación
└── xs-app.json                   # Configuración de rutas BTP
```

## Modelos Implementados

### 1. JSON Model (localModel)
- **Propósito**: Datos locales y gestión client-side
- **Uso**: Gestión de usuarios, configuraciones locales
- **Ventajas**: Rápido, no requiere conexión
- **Desventajas**: Solo local, no persiste

```javascript
// Configuración en manifest.json
"localModel": {
  "type": "sap.ui.model.json.JSONModel",
  "uri": "model/localModel.json"
}
```

### 2. OData V2 Model (oDataModelV2)
- **Servicio**: https://sapes5.sapdevcenter.com/sap/opu/odata/iwbep/GWSAMPLE_BASIC/
- **Entidad Principal**: BusinessPartnerSet
- **Operaciones**: CREATE, READ, UPDATE, DELETE
- **Características**: Server-side filtering, automático CRUD

```javascript
// Configuración en manifest.json
"oDataModelV2": {
  "dataSource": "mainService",
  "type": "sap.ui.model.odata.v2.ODataModel",
  "settings": {
    "defaultOperationMode": "Server",
    "defaultBindingMode": "OneWay",
    "defaultCountMode": "Request"
  }
}
```

#### Operaciones CRUD OData V2:
```javascript
// CREATE
this.oDataModelV2.create("/BusinessPartnerSet", oNewData, {
  success: (oData) => { /* éxito */ },
  error: (oError) => { /* error */ }
});

// READ
this.oDataModelV2.read("/BusinessPartnerSet", {
  success: (oData) => { /* procesar datos */ }
});

// UPDATE
this.oDataModelV2.update("/BusinessPartnerSet('ID')", oUpdatedData);

// DELETE
this.oDataModelV2.remove("/BusinessPartnerSet('ID')");
```

### 3. OData V4 Model (oDataModelV4)
- **Servicio**: https://sapes5.sapdevcenter.com/sap/opu/odata4/sap/ze2e001/default/sap/ze2e001_salesorder/0001/
- **Entidad Principal**: SalesOrder
- **Mejoras V4**: Mejor binding, transacciones, batch operations
- **Características**: Two-way binding automático, mejor performance

```javascript
// Configuración en manifest.json
"oDataModelV4": {
  "dataSource": "salesOrderService", 
  "type": "sap.ui.model.odata.v4.ODataModel",
  "settings": {
    "synchronizationMode": "None",
    "operationMode": "Server",
    "autoExpandSelect": true,
    "earlyRequests": true
  }
}
```

#### Operaciones CRUD OData V4:
```javascript
// CREATE
const oBinding = this.oDataModelV4.bindList("/SalesOrder");
const oContext = oBinding.create(oNewData);

// READ
const oBinding = this.oDataModelV4.bindList("/SalesOrder");
oBinding.getContexts(0, 10);

// UPDATE (automático con two-way binding)
oContext.setProperty("Customer", "New Customer");
this.oDataModelV4.submitBatch();

// DELETE
oContext.delete();
```

### 4. REST Model - Pokemon API (restModelPokeApi)
- **API**: https://pokeapi.co/api/v2/pokemon/
- **Método**: GET con JSONModel
- **Uso**: Demostración de APIs REST externas
- **Implementación**: jQuery AJAX + JSONModel

```javascript
// Implementación REST con jQuery
$.ajax({
  url: `https://pokeapi.co/api/v2/pokemon/${sPokemon}`,
  method: "GET",
  success: (oData) => {
    this.localModel.setProperty("/pokemonData", oData);
  },
  error: (error) => {
    console.error("Error:", error);
  }
});
```

## Configuración SAP BTP

### Destino ES5 en SAP BTP Cockpit

1. **Crear Destino ES5**:
   - Nombre: `ES5`
   - Tipo: `HTTP`
   - URL: `https://sapes5.sapdevcenter.com`
   - Proxy Type: `Internet`
   - Authentication: `BasicAuthentication`

2. **Propiedades Adicionales**:
   ```
   HTML5.DynamicDestination: true
   HTML5.Timeout: 60000
   sap-client: 002
   WebIDEEnabled: true
   WebIDEUsage: odata_abap,dev_abap
   ```

3. **Credenciales**:
   - Usuario: [Su usuario ES5]
   - Contraseña: [Su contraseña ES5]

### Configuración xs-app.json

El archivo `xs-app.json` incluye el enrutamiento para los servicios OData:

```json
{
  "routes": [
    {
      "source": "^/sap/opu/odata/iwbep/GWSAMPLE_BASIC/(.*)$",
      "target": "/sap/opu/odata/iwbep/GWSAMPLE_BASIC/$1",
      "destination": "ES5",
      "authenticationType": "BasicAuthentication",
      "csrfProtection": false
    },
    {
      "source": "^/sap/opu/odata4/sap/ze2e001/(.*)$", 
      "target": "/sap/opu/odata4/sap/ze2e001/$1",
      "destination": "ES5",
      "authenticationType": "BasicAuthentication",
      "csrfProtection": false
    }
  ]
}
```

## Instalación y Ejecución

### Prerrequisitos

1. **Node.js**: Versión LTS activa
2. **NPM**: Versión compatible con Node.js
3. **Acceso a Internet**: Para UI5 CDN y Pokemon API
4. **Credenciales ES5**: Para servicios OData (opcional para desarrollo)

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/JosueEstrada/sapui5.git
cd sapui5

# 2. Cambiar a la rama odata-rest
git checkout odata-rest

# 3. Instalar dependencias
npm install

# 4. Construir la aplicación
npm run build

# 5. Ejecutar en desarrollo
npm start
# o alternativamente
npm run start-noflp
```

### URLs de Acceso

- **Desarrollo**: http://localhost:8080
- **Con FLP**: http://localhost:8080/test/flp.html#app-preview
- **Directo**: http://localhost:8080/index.html

## Navegación de la Aplicación

### Página Principal (Main)
- Gestión de usuarios con JSON Model
- Panel informativo sobre tipos de modelos
- Botón "Ver Ejemplos OData y REST" para navegar a ejemplos

### Página de Ejemplos OData/REST
- **Sección OData V2**: BusinessPartner con operaciones CRUD
- **Sección OData V4**: SalesOrder con operaciones mejoradas
- **Sección REST**: Pokemon API con búsqueda interactiva
- **Sección Comparativa**: Tabla comparando los diferentes modelos

## Diferencias Entre Modelos

| Característica | JSON Model | OData V2 | OData V4 |
|---------------|------------|----------|----------|
| Tipo de datos | JSON/REST APIs | OData v2.0 | OData v4.0 |
| Binding | Client-side | Server-side | Server-side |
| Filtros | Cliente (JS) | Servidor ($filter) | Servidor ($filter) |
| CRUD | Manual via AJAX | Automático | Automático mejorado |
| Performance | Limitado por cliente | Bueno | Excelente |
| Two-way binding | Manual | Limitado | Automático |
| Batch operations | No | Sí | Mejorado |
| Error handling | Manual | Automático | Mejorado |

## Características Técnicas

### Buenas Prácticas Implementadas

1. **Separación de Responsabilidades**:
   - Controladores específicos por funcionalidad
   - Modelos separados por tipo de datos
   - Vistas modulares y reutilizables

2. **Manejo de Errores**:
   - Try-catch en operaciones críticas
   - Mensajes informativos al usuario
   - Logging para debugging

3. **UI/UX Consistente**:
   - Mantiene el estilo de la aplicación base
   - Mensajes Toast para feedback inmediato
   - Botones con iconos descriptivos

4. **Comentarios Explicativos**:
   - Código documentado en español
   - Explicación de diferencias entre modelos
   - Ejemplos de uso en controladores

### Seguridad

- **CORS**: Configurado para APIs externas
- **Autenticación**: BasicAuth para servicios SAP
- **CSRF**: Protección configurada en xs-app.json
- **Validación**: Datos validados antes de procesamiento

## Testing y Desarrollo

### Comandos Disponibles

```bash
# Desarrollo
npm start                    # Con FLP Sandbox
npm run start-noflp         # Sin FLP
npm run start-local         # Configuración local

# Testing
npm run unit-test           # Tests unitarios
npm run int-test           # Tests de integración

# Build y Deploy
npm run build              # Construir para producción
npm run build:mta         # Build MTA
npm run deploy            # Deploy a CF
```

### Estructura de Testing

- **Unit Tests**: `/webapp/test/unit/`
- **Integration Tests**: `/webapp/test/integration/`
- **QUnit**: Framework de testing configurado

## Contribución

### Directrices de Desarrollo

1. **Mantener Estilo**: Seguir las convenciones existentes
2. **Documentar Cambios**: Actualizar README y comentarios
3. **Testing**: Agregar tests para nuevas funcionalidades
4. **Commits**: Mensajes descriptivos en español

### Estructura de Commits

```
tipo: descripción breve

Descripción detallada del cambio realizado,
incluyendo el contexto y la justificación.

- Cambio específico 1
- Cambio específico 2
```

## Solución de Problemas

### Problemas Comunes

1. **Error 500 en recursos UI5**:
   - Verificar conexión a Internet
   - Comprobar configuración de proxy
   - Usar `npm run start-local` como alternativa

2. **Servicios OData no disponibles**:
   - Verificar credenciales ES5
   - Comprobar configuración de destino BTP
   - Los ejemplos incluyen datos mock para desarrollo

3. **Pokemon API no responde**:
   - Verificar conectividad externa
   - API pública puede tener limitaciones de rate

### Logs y Debugging

- **Console del navegador**: Errores de JavaScript
- **Network tab**: Verificar llamadas HTTP
- **UI5 Inspector**: Extensión de Chrome recomendada

## Licencia

Este proyecto es parte de una capacitación y está disponible bajo los términos establecidos por ADMOSA.

## Contacto

Para preguntas o soporte técnico, contactar al equipo de desarrollo de ADMOSA.
