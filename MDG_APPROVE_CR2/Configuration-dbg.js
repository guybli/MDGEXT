/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");


sap.ca.scfld.md.ConfigurationBase.extend("fcg.mdg.approvecrv2.Configuration", {

	oServiceParams: {
		serviceList: []
	},

	getServiceParams: function () {
		return this.oServiceParams;
	},

	getServiceList: function () {
	var activeFunctions = [];
		
		// Here we put all the services into a map 
		var configmap = {};
		configmap['MDG_APPROVE_CR'] = {name:"MDG_APPROVE_CR",masterCollection:"ChangeRequestCollection",
		serviceUrl:"/sap/opu/odata/sap/MDG_APPROVE_CR/",isDefault:true,
		mockedDataSource:"/fcg.mdg.approvecrv2/model/Financial/metadata.xml"};
		
		configmap['MDG_FINANCIALS'] = {name:"MDG_FINANCIALS",masterCollection:"ChangeRequestCollection",
		serviceUrl:"/sap/opu/odata/sap/MDG_FINANCIALS/",isDefault:false,
		mockedDataSource:"/fcg.mdg.approvecrv2/model/Financial/financial_metadata.xml"};
		
		configmap['MDG_GL_ACCOUNT'] = {name:"MDG_GL_ACCOUNT",masterCollection:"ChangeRequestCollection",
		serviceUrl:"/sap/opu/odata/sap/MDG_GL_ACCOUNT",isDefault:false,
		mockedDataSource:"/fcg.mdg.approvecrv2/model/GLAccount/GLAccount_metadata.xml"};
		
		configmap['MDG_SUPPLIER'] = {name:"MDG_SUPPLIER",masterCollection:"ChangeRequestCollection",
		serviceUrl:"/sap/opu/odata/sap/MDG_SUPPLIER_GENIL_SRV/",isDefault:false,
		mockedDataSource:"/fcg.mdg.approvecrv2/model/Supplier/Supplier_metadata.xml"};
		
		configmap['MDG_CUSTOMER'] = {name:"MDG_CUSTOMER",masterCollection:"ChangeRequestCollection",
		serviceUrl:"/sap/opu/odata/sap/MDG_CUSTOMER_GENIL_SRV/",isDefault:false,
		mockedDataSource:"/fcg.mdg.approvecrv2/model/Customer/Customer_metadata.xml"};
		
		configmap['MDG_MATERIAL'] = {name:"MDG_MATERIAL",masterCollection:"ChangeRequestCollection",
		serviceUrl:"/sap/opu/odata/sap/MDG_MATERIAL_APPROVE_CR_SRV/",isDefault:false,
		mockedDataSource:"/fcg.mdg.approvecrv2/model/Material/material_metadata.xml"};
		
		// Here we are building the URL for firing the oData Call
		var serviceURL = "";
        var host = $(location).attr("host");
        var url_root = "https://"+host+"/sap/opu/odata/sap/";
      
        serviceURL = url_root + "MDG_APPROVE_CR";
        var readRequestURL="/$metadata";
        serviceURL = serviceURL + readRequestURL;
       
		//This is for making a httpRequest Call
		var xml = jQuery.ajax({type:"get", url:serviceURL,async:false}).responseText;
       
        // Here we are parisng the xml to javascript Object
    	var $obj = $(xml);
    
		// Now we parse the xml for the enitity having "name=ChangeRequest"	
		var entity = $obj.find('entitytype[name="ChangeRequest"]')[0];
		
		// then get its attribute value
		var list = entity.getAttribute('sap:availabledomains');

		if(list!== null){
		this.oServiceParams.serviceList = [];
		list = list.trim();
		list = list.split(',');
		for(var i = 0; i<list.length;i++){
			switch(list[i]){
				case '159':activeFunctions.push('MDG_CUSTOMER'); break;
				case '266':activeFunctions.push('MDG_SUPPLIER'); break;
				case '194':activeFunctions.push('MDG_MATERIAL'); break;
				case '892':activeFunctions.push('MDG_FINANCIALS');activeFunctions.push('MDG_GL_ACCOUNT'); break;
			}
		}
		this.oServiceParams.serviceList.push(configmap['MDG_APPROVE_CR']);
	    for (i = 0; i < activeFunctions.length; i++) {
            this.oServiceParams.serviceList.push(configmap[activeFunctions[i]]);
        }
	   	return this.oServiceParams.serviceList;
		}
		return this.oServiceParams.serviceList;
	},

	getMasterKeyAttributes : function() {
		return ["Id"];
	}

});