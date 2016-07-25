jQuery.sap.declare("fcg.mdg.approvecrv2.MDG_APPROVE_CR2Extension.Component");
// use the load function for getting the optimized preload file if present
sap.ui.component.load({
	name: "fcg.mdg.approvecrv2",
	// Use the below URL to run the extended application when SAP-delivered application is deployed on SAPUI5 ABAP Repository
	url: "/sap/bc/ui5_ui5/sap/MDG_APPROVE_CR2" // we use a URL relative to our own component
		// extension application is deployed with customer namespace
});
this.fcg.mdg.approvecrv2.Component.extend("fcg.mdg.approvecrv2.MDG_APPROVE_CR2Extension.Component", {
	metadata: {
		version: "1.0",
		config: {},
		customizing: {
			"sap.ui.viewExtensions": {
				"fcg.mdg.approvecrv2.view.Address": {
					"extaddrAttrHeader": {
						"className": "sap.ui.core.Fragment",
						"fragmentName": "fcg.mdg.approvecrv2.MDG_APPROVE_CR2Extension.view.Address_extaddrAttrHeaderCustom",
						"type": "XML"
					}
				}
			}
		}
	}
});