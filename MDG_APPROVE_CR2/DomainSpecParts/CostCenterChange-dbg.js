/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// EXC_ALL_JSHINT_047
//jQuery.sap.require("fcg.mdg.approvemasterdata.view.Utility");
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.CostCenterChange");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.CostCenter");

/*
 * This method takes care of initializing tables, forming queries and displaying data for change scenarios of Cost center
* */

fcg.mdg.approvecrv2.DomainSpecParts.CostCenterChange = {
		//Declaring global variables for this class
		oCostCenterGeneralTable : "",
		oCostCenterAddressTable : "",
		oCostCenterCommTable : "",
		oCostCenterIndTable : "",
		oCostCenterDescTable: "",
		aDetailData:"",
		nodata:"",
		oAttachment:"",
		vLinkPressed: "",
		oS3Controller:"",

		// Initializing tables and adding them to layouts 
		initialize_Tables : function(oS3Controller) {
			this.oS3Controller = oS3Controller;
			//delete all UI contents if present for create layout
			sap.ui.getCore().byId("ccCreateDataLayout").removeAllContent();
			//initialize general section table and load the fragment into appropriate layout
			sap.ui.getCore().byId("ccGeneralDataLayout").removeAllContent();
			this.oCostCenterGeneralTable = "";
			this.oCostCenterGeneralTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse', this);
			sap.ui.getCore().byId("ccGeneralDataLayout").addContent(
					this.oCostCenterGeneralTable);
			// Fetch the columns to set the header text for context
			var aGeneralColumns = this.oCostCenterGeneralTable.getColumns();	
			var oGenlLabel = new sap.m.Label({text:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_DESCRIPTION")});
			aGeneralColumns[0].setHeader(oGenlLabel);
			this.oCostCenterGeneralTable.setGrowing(true);
			//this.oCostCenterGeneralTable.setHeaderText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_TIT_GEN"));

			//initialize Address section table and load the fragment into appropriate layout
			sap.ui.getCore().byId("ccAddressLayout").removeAllContent();
			this.oCostCenterAddressTable = "";
			this.oCostCenterAddressTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse', this);
			sap.ui.getCore().byId("ccAddressLayout").addContent(
					this.oCostCenterAddressTable);
			var aAddressColumns = this.oCostCenterAddressTable.getColumns();	
			var oAddrLabel = new sap.m.Label({text:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_DESCRIPTION")});
			aAddressColumns[0].setHeader(oAddrLabel);
			this.oCostCenterAddressTable.setGrowing(true);
			this.oCostCenterAddressTable.setHeaderText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_TIT_ADDRESS"));


			//initialize Communication section table and load the fragment into appropriate layout
			sap.ui.getCore().byId("ccCommLayout").removeAllContent();
			this.oCostCenterCommTable = "";
			this.oCostCenterCommTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse', this);
			sap.ui.getCore().byId("ccCommLayout").addContent(this.oCostCenterCommTable);
			var aCommColumns = this.oCostCenterCommTable.getColumns();			
			var oCommLabel = new sap.m.Label({text:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_DESCRIPTION")});
			aCommColumns[0].setHeader(oCommLabel);
			this.oCostCenterCommTable.setGrowing(true);
			this.oCostCenterCommTable.setHeaderText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_TIT_COMM"));

			//initialize Indicators section table and load the fragment into appropriate layout
			sap.ui.getCore().byId("ccIndLayout").removeAllContent();
			this.oCostCenterIndTable = "";
			this.oCostCenterIndTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse', this);
			sap.ui.getCore().byId("ccIndLayout").addContent(this.oCostCenterIndTable);
			var aIndColumns = this.oCostCenterIndTable.getColumns();		
			var oIndLabel = new sap.m.Label({text:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_DESCRIPTION")});
			aIndColumns[0].setHeader(oIndLabel);
			this.oCostCenterIndTable.setGrowing(true);
			this.oCostCenterIndTable.setHeaderText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_TIT_IND"));

			//initialize description table and load the fragment into appropriate layout
			sap.ui.getCore().byId("ccDescLayout").removeAllContent();
			this.oCostCenterDescTable = "";
			this.oCostCenterDescTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse', this);
			sap.ui.getCore().byId("ccDescLayout").addContent(this.oCostCenterDescTable);
			var aDescColumns = this.oCostCenterDescTable.getColumns();	
			var oDescHeaderLabel = new sap.m.Label({text:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_DESC_COL_NAME")});
			aDescColumns[0].setHeader(oDescHeaderLabel);
			this.oCostCenterDescTable.setGrowing(true);
			this.oCostCenterDescTable.setHeaderText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_TIT_DES"));
			
			this.oS3Controller.ccHookChangeLayout();
			
			//initialize attachment layout and load the content into appropriate layout
			sap.ui.getCore().byId("ccAttachmentLayout").removeAllContent();	
			this.oAttachment = "";
			this.oAttachment = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse', this);
			sap.ui.getCore().byId("ccAttachmentLayout").addContent(this.oAttachment);
			var aAttachColumns = this.oAttachment.getColumns();			
			//aAttachColumns[0].setHeader(oHeaderLabel);
			var oAttachHeaderLabel = new sap.m.Label({text:sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_ATTACHMENT")});
			aAttachColumns[0].setHeader(oAttachHeaderLabel);
			this.oAttachment.setGrowing(true);
			this.oAttachment.setHeaderText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("PC_TIT_ATTACH"));
		},

		// To return CHANGE data and ACTUAL data to details screen(S4)
		getDetailData:function(){			
			return this.aDetailData;
		},

		//Query for change data and code descriptions
		getQueries:function(sServiceUrl,sPath,s3Controller){
			this.oS3Controller = s3Controller;
			//var aQuery = [];//sServiceUrl + 
			var sQuery = sPath + "?$expand=CCTR/ChangeData,CCTR/CCTR2DTxtCCTRRel/ChangeData,CCTR/CCTR2AtthCCTRRel/ChangeData,CCTR/CD_CCTRRESPU,CCTR/CD_COAREA,CCTR/CD_CCTRCGY,CCTR/CD_CCODECCTR,CCTR/CD_CCTRBAREA,CCTR/CD_FUNCCCTR,CCTR/CD_CURRCCTR,"
			+"CCTR/CD_CC_LAND1,CCTR/CD_CC_REGION,CCTR/CD_CC_SPRAS,CCTR/CCTR2DTxtCCTRRel/CD_LANGU,CCTR/CCTR2AtthCCTRRel/CD_USMD_ACREATED_BY," + 
			"CCTR/CCTR2PCTRCCTRRel,CCTR/CCTR2NEWCCTRRel";
			var extQuery = this.oS3Controller.ccHookChangeQuery(sQuery);
			if(extQuery !== undefined){
				sQuery = extQuery;
			}
			return sQuery;
		},
		
		//Function to map the table data on S3 and display it accordingly
		displayTableData : function(result, oInstance, oView) { // EXC_JSHINT_047
			this.aDetailData = result;
			// Create an item template
			var oItemTemp = this.createTableTemplate(); 
			// Event handler on click of an item in the change tables
			oItemTemp.attachPress({Entity: result, name:'ccItemDetail' },oView.navtoSubDetail, oView);
			//Initialize arrays
			var aGenData = {
					results : []
			};
			var aAddress = {
					results : []
			};
			var aCommData = {
					results : []
			};
			var aIndicators = {
					results : []
			};
			var sEmptyValue = "(" + sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_NOT_MAIN") + ")";
			var vDeleted = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_DELETED");

			//Handling of No data in case user has not changed anything in the CR
			this.handleNodata(result,oView);
			// Segregate the data into different sections
			for ( var i = 0; i < result.CCTR.ChangeData.results.length; i++) {
				result.CCTR.ChangeData.results[i].EntityDesc = result.CCTR.TXTSH + " (" + result.CCTR.COAREA + "/" + result.CCTR.CCTR + ")";
				var sAttr = result.CCTR.ChangeData.results[i].Attribute;
			// General Data
			if (sAttr === 'CCTR' || sAttr === 'COAREA' || sAttr === 'CCTRDEPT'
					|| sAttr === 'CCTRCGY' || sAttr === 'CCODECCTR'
					|| sAttr === 'CCTRBAREA' || sAttr === 'FUNCCCTR'
					|| sAttr === 'CURRCCTR' || sAttr === 'PCTRCCTR'
					|| sAttr === 'CCTRLSYS' || sAttr === 'CCTRCCTRN'
					|| sAttr === 'CCTRRESPU' || sAttr === 'CCTRRESPP')
				{
					if (result.CCTR.ChangeData.results[i].NewValue !== result.CCTR.ChangeData.results[i].OldValue) {
						if(result.CCTR.ChangeData.results[i].OldValue === ""){
							result.CCTR.ChangeData.results[i].OldValue = sEmptyValue;//if nothing is maintained in the field when it was initially created
						}
						//To show the description of value and code together in a single row, concatenate the values
						if(result.CCTR.ChangeData.results[i].OldValueText !== ""){
							result.CCTR.ChangeData.results[i].OldValue = result.CCTR.ChangeData.results[i].OldValueText + " (" + result.CCTR.ChangeData.results[i].OldValue + ")";
						}
						//To show the description of value and code together in a single row, concatenate the values
						if(result.CCTR.ChangeData.results[i].NewValueText !== ""){
							result.CCTR.ChangeData.results[i].NewValue = result.CCTR.ChangeData.results[i].NewValueText + " (" + result.CCTR.ChangeData.results[i].NewValue + ")";
						}
						// If a new value is empty but old value is not empty, set the text to 'DELETED'
						if(result.CCTR.ChangeData.results[i].NewValue === "" && result.CCTR.ChangeData.results[i].OldValue !== "")
							result.CCTR.ChangeData.results[i].NewValue = vDeleted;
						aGenData.results
						.push(result.CCTR.ChangeData.results[i]);
					}
				}
				// Address Data
				if (sAttr === 'CC_STRAS' || sAttr === 'CC_PSTLZ'
					|| sAttr === 'CC_ORT01' || sAttr === 'CC_REGION'
					|| sAttr === 'CC_ORT02' || sAttr === 'CC_LAND1'
					|| sAttr === 'CC_PSTL2' || sAttr === 'CC_PFACH'
					|| sAttr === 'CCTRTXJCD' || sAttr === 'CC_NAME1'
					|| sAttr === 'CC_NAME2' || sAttr === 'CC_NAME3'
					|| sAttr === 'CC_NAME4' || sAttr === 'CC_ANRED') {
					// Overwrite the attribute name coming from odata(changed
					// from NAME to NAME1)
					if(sAttr === 'CC_NAME1'){
						result.CCTR.ChangeData.results[i].AttributeDesc = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_NAME1");
					}
					if(result.CCTR.ChangeData.results[i].OldValue === ""){
						result.CCTR.ChangeData.results[i].OldValue = sEmptyValue;//if nothing is maintained in the field when it was initially created
					}
					//To show the description of value and code together in a single row, concatenate the values
					if(result.CCTR.ChangeData.results[i].OldValueText !== ""){
						result.CCTR.ChangeData.results[i].OldValue = result.CCTR.ChangeData.results[i].OldValueText + " (" + result.CCTR.ChangeData.results[i].OldValue + ")";
					}
					//To show the description of value and code together in a single row, concatenate the values
					if(result.CCTR.ChangeData.results[i].NewValueText !== ""){
						result.CCTR.ChangeData.results[i].NewValue = result.CCTR.ChangeData.results[i].NewValueText + " (" + result.CCTR.ChangeData.results[i].NewValue + ")";
					}	
					// If a new value is empty but old value is not empty, set the text to 'DELETED'
					if(result.CCTR.ChangeData.results[i].NewValue === "" && result.CCTR.ChangeData.results[i].OldValue !== "")
						result.CCTR.ChangeData.results[i].NewValue = vDeleted;
					aAddress.results.push(result.CCTR.ChangeData.results[i]);
				}
				// Communication
				if (sAttr === 'CC_SPRAS' || sAttr === 'CC_TELF1'
					|| sAttr === 'CC_TELF2' || sAttr === 'CC_TELFX'
					|| sAttr === 'CC_TELBX' || sAttr === 'CC_TELX1'
					|| sAttr === 'CC_TELTX' || sAttr === 'CC_DRNAM'
					|| sAttr === 'CC_DATLT') {
					if(result.CCTR.ChangeData.results[i].OldValue === ""){
						result.CCTR.ChangeData.results[i].OldValue = sEmptyValue;
					}
					//To show the description of value and code together in a single row, concatenate the values
					if(result.CCTR.ChangeData.results[i].OldValueText !== ""){
						result.CCTR.ChangeData.results[i].OldValue = result.CCTR.ChangeData.results[i].OldValueText + " (" + result.CCTR.ChangeData.results[i].OldValue + ")";
					}
					//To show the description of value and code together in a single row, concatenate the values
					if(result.CCTR.ChangeData.results[i].NewValueText !== ""){
						result.CCTR.ChangeData.results[i].NewValue = result.CCTR.ChangeData.results[i].NewValueText + " (" + result.CCTR.ChangeData.results[i].NewValue + ")";
					}	
					// If a new value is empty but old value is not empty, set the text to 'DELETED'
					if(result.CCTR.ChangeData.results[i].NewValue === "" && result.CCTR.ChangeData.results[i].OldValue !== "")
						result.CCTR.ChangeData.results[i].NewValue = vDeleted;
					aCommData.results.push(result.CCTR.ChangeData.results[i]);
				}
				// Indicators
				if (sAttr === 'CCTRQTYRQ' || sAttr === 'CCTRLKAPP'
					|| sAttr === 'CCTRLKASC' || sAttr === 'CCTRLKPPC'
					|| sAttr === 'CCTRLKPSC' || sAttr === 'CCTRLKARP'
					|| sAttr === 'CCTRLKPRV' || sAttr === 'CCTRLKCUP') {
					result.CCTR.ChangeData.results[i] = result.CCTR.ChangeData.results[i];
					if (result.CCTR.ChangeData.results[i].NewValue === 'X')						
						result.CCTR.ChangeData.results[i].NewValue = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_YES");//To display X as Yes on the UI for indicator
					else if (result.CCTR.ChangeData.results[i].NewValue === "")
						result.CCTR.ChangeData.results[i].NewValue = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_NO");//To display blank as No on the UI for indicator

					if (result.CCTR.ChangeData.results[i].OldValue === 'X')
						result.CCTR.ChangeData.results[i].OldValue = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_YES");//To display X as Yes on the UI for indicator
					else if (result.CCTR.ChangeData.results[i].OldValue === "")
						result.CCTR.ChangeData.results[i].OldValue = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_NO");//To display blank as No on the UI for indicator

					aIndicators.results.push(result.CCTR.ChangeData.results[i]);
				}
			}
			// Bind data to a description table
			this.bindDescriptionTable(result,oView,oItemTemp);
			this.oS3Controller.ccHookFillDataForChangeLayout(result,oView);			
			var aModifiedData = this.oS3Controller.ccHookModifyChangeData(aGenData,aAddress,aCommData,aIndicators,result);
			if(aModifiedData !== undefined){
				aGenData = aModifiedData.aGenData;
				aAddress = aModifiedData.aAddress;
				aCommData = aModifiedData.aCommData;
				aIndicators = aModifiedData.aIndicators;
			}
			//Bind data to a general form
			this.bindFormData(aGenData,aAddress,aCommData,aIndicators,oItemTemp);
			//Bind data to attachment table
			this.createCctrAttachmentTable(result, oView);
		},	
		
		//Bind data to general form
		bindFormData:function(aGenData,aAddress,aCommData,aIndicators,oItemTemp){
			if(aGenData.results.length === 0){
				sap.ui.getCore().byId("ccGeneralDataLayout").removeAllContent();
				//	Handling of No data if the user has not changed anything in the CR
				if (this.nodata === 'X' )
				{
				var text = new sap.m.Text("ccTxt");
				text.setText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Nodata"));
				sap.ui.getCore().byId("ccGeneralDataLayout").addContent(text);
				this.nodata = "";
				}
			}
			else{
				var oGenDataModel = new sap.ui.model.json.JSONModel();
				oGenDataModel.setData(aGenData);
				this.oCostCenterGeneralTable.setModel(oGenDataModel);
				this.oCostCenterGeneralTable.bindItems('/results', oItemTemp, '', '');}

			if(aAddress.results.length === 0){
				sap.ui.getCore().byId("ccAddressLayout").removeAllContent();
				sap.ui.getCore().byId("ccAddressLayout").destroy();}
			else{
				var oAddressModel = new sap.ui.model.json.JSONModel();
				oAddressModel.setData(aAddress);
				this.oCostCenterAddressTable.setModel(oAddressModel);
				this.oCostCenterAddressTable.bindItems('/results', oItemTemp, '', '');}

			if(aCommData.results.length === 0){
				sap.ui.getCore().byId("ccCommLayout").removeAllContent();
				sap.ui.getCore().byId("ccCommLayout").destroy();}
			else{
				var oCommModel = new sap.ui.model.json.JSONModel();
				oCommModel.setData(aCommData);
				this.oCostCenterCommTable.setModel(oCommModel);
				this.oCostCenterCommTable.bindItems('/results', oItemTemp, '', '');}

			if(aIndicators.results.length === 0){
				sap.ui.getCore().byId("ccIndLayout").removeAllContent();
				sap.ui.getCore().byId("ccIndLayout").destroy();}
			else{
				var oIndicatorModel = new sap.ui.model.json.JSONModel();		
				oIndicatorModel.setData(aIndicators);
				this.oCostCenterIndTable.setModel(oIndicatorModel);
				this.oCostCenterIndTable.bindItems('/results', oItemTemp, '', '');}			
		},
		
		//Bind data to description table
		bindDescriptionTable:function(result,oView,oItemTemp){
			var strResults = {results:[]};	
			var vDeleted = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_DELETED");
			var sEmptyValue = "(" + sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_NOT_MAIN") + ")";
			// Loop at description changes
			for ( var i = 0; i < result.CCTR.CCTR2DTxtCCTRRel.results.length; i++) {
				if(result.CCTR.CCTR2DTxtCCTRRel.results[i].ChangeData.results.length > 0){	
					for(var j = 0; j < result.CCTR.CCTR2DTxtCCTRRel.results[i].ChangeData.results.length;j++){
						var oDataItems = {
								EntityDesc:"",
								AttributeDesc:"",
								NewValue:"",
								OldValue:""	
						};
						if(result.CCTR.CCTR2DTxtCCTRRel.results[i].ChangeData.results[j].Attribute !== 'CCTR' && 
								result.CCTR.CCTR2DTxtCCTRRel.results[i].ChangeData.results[j].Attribute !== 'COAREA' && 
								result.CCTR.CCTR2DTxtCCTRRel.results[i].ChangeData.results[j].Attribute !== 'LANGU')
						{
							//oDataItems.Lang = result.CCTR.CCTR2DTxtCCTRRel.results[i].CD_LANGU.Code;
							//oDataItems.LangDesc = result.CCTR.CCTR2DTxtCCTRRel.results[i].CD_LANGU.Description;
							oDataItems.EntityDesc = result.CCTR.CCTR2DTxtCCTRRel.results[i].TXTSH + " (" + 
							result.CCTR.CCTR2DTxtCCTRRel.results[i].CD_LANGU.Description + ")";
							if(result.CCTR.CCTR2DTxtCCTRRel.results[i].ChangeData.results[j].EntityAction === 'C'){
								oDataItems.NewValue = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_ADDED");
								strResults.results.push(oDataItems);
								break;
							}
							
							else if(result.CCTR.CCTR2DTxtCCTRRel.results[i].ChangeData.results[j].EntityAction === 'D'){
								oDataItems.NewValue = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_DELETED");
								strResults.results.push(oDataItems);
								break;
							}
							
							else{
								if(result.CCTR.CCTR2DTxtCCTRRel.results[i].ChangeData.results[j].Attribute === 'TXTSH'){
									oDataItems.AttributeDesc = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("FIN_SHORT_TEXT");
								}
								else if(result.CCTR.CCTR2DTxtCCTRRel.results[i].ChangeData.results[j].Attribute === 'TXTMI'){
									oDataItems.AttributeDesc = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_MED_TEXT");
								}
								else
								{
									oDataItems.AttributeDesc = result.CCTR.CCTR2DTxtCCTRRel.results[i].ChangeData.results[j].AttributeDesc;
								}								
								oDataItems.NewValue = result.CCTR.CCTR2DTxtCCTRRel.results[i].ChangeData.results[j].NewValue;
								if(result.CCTR.CCTR2DTxtCCTRRel.results[i].ChangeData.results[j].OldValue === ""){
									oDataItems.OldValue = sEmptyValue;
								}
								else{
									oDataItems.OldValue = result.CCTR.CCTR2DTxtCCTRRel.results[i].ChangeData.results[j].OldValue;
								}
								//if new value is empty and earlier it had values, then new value should display "Deleted"
								if(result.CCTR.CCTR2DTxtCCTRRel.results[i].ChangeData.results[j].NewValue === "" && result.CCTR.CCTR2DTxtCCTRRel.results[i].ChangeData.results[j].OldValue !== "")
									oDataItems.NewValue = vDeleted;
								else if(result.CCTR.CCTR2DTxtCCTRRel.results[i].ChangeData.results[j].NewValue !== "")
									oDataItems.NewValue = result.CCTR.CCTR2DTxtCCTRRel.results[i].ChangeData.results[j].NewValue;
								strResults.results.push(oDataItems);

							}

						}
					}
				}
			}
			//var oItemDescTemp = this.descrValueTemplate();
			var oExtItemDescTemp = this.oS3Controller.ccHookDecTempForChange(oItemTemp);
			if(oExtItemDescTemp !== undefined){
				oItemTemp = oExtItemDescTemp;
			}	        
			//oItemTemp.attachPress({Entity: result, name:'ccItemDetail' },oView.navtoSubDetail, oView);

			if(strResults.results.length === 0){
				sap.ui.getCore().byId("ccDescLayout").removeAllContent();
				sap.ui.getCore().byId("ccDescLayout").destroy();}
			else{
				var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
				oModel.setData(strResults); 
				this.oCostCenterDescTable.setModel(oModel);
				this.oCostCenterDescTable.bindItems('/results', oItemTemp, '', '');}			
		},
		
		//Create generic table template 
		createTableTemplate: function(){		
			var oItemTemp = new sap.m.ColumnListItem({
				type : "Navigation",
				cells : [ 
				         new sap.m.Text({//Column which identifies each record with Language code and Description
				        	 text : "{EntityDesc}"
				         }).addStyleClass("text_bold"), 
				          new sap.m.ObjectIdentifier({
				        	 text : {
				        		 path : "AttributeDesc" 
				        	 },
				        	 title : {
				        		 path : "NewValue" 
				        	 }
				         }), new sap.m.Text({
				        	 text : {
				        		 path : "OldValue"
				        	 }
				         }) ]
			});

			return oItemTemp;
		},
		//Create description table template
		/*descrValueTemplate: function(){
			var oItemDescrTemp = new sap.m.ColumnListItem({
				type:"Navigation",
				cells: [
				        new sap.m.ObjectIdentifier({
				        	text : {
				        		path : "Lang" 
				        	},
				        	title : {
				        		path : "LangDesc" 
				        	} 				        	
				        }), 	                          
				        new sap.m.ObjectIdentifier({
				        	text : {
				        		path : "AttrDesc" // "Description"
				        	},
				        	title : {
				        		path : "NewValue" // "CostCenterId"
				        	}
				        }),                          
				        new sap.m.Text({
				        	text:"{OldValue}"
				        }),	                         
				        ]});
			return oItemDescrTemp;
		},*/

		//Identify if there is no data changed for each section
		handleNodata : function(result)
        {
               var noGenData="X",noAttachData="X",noDesc="X";
        //if no general data
               if (result.CCTR.ChangeData.results.length !== 0)
                     {
                     noGenData = "";
                     }
        //If No Attachments
               for(var i=0;i<result.CCTR.CCTR2AtthCCTRRel.results.length;i++)
                     {
                     
                     if(result.CCTR.CCTR2AtthCCTRRel.results[i].ChangeData.results.length !== 0)
                            {
                            noAttachData="";
                            break;
                            }
                     }
               //If no Descriptions
               for(var j=0;j<result.CCTR.CCTR2DTxtCCTRRel.results.length;j++)
               {
               if(result.CCTR.CCTR2DTxtCCTRRel.results[j].ChangeData.results.length !== 0)
                     {
                     noDesc = "";
                     break;
                     }
               }      
               if (noGenData === 'X' && noAttachData === 'X' && noDesc === 'X')
                     {
                     this.nodata = 'X';
                     }
        },
		
        // Create attachment table
        createCctrAttachmentTable:function(aResult,oView){
        	//var vAttrDesc = "";
        	var vOldValue = "";
			var vNewValue = "";
			var oNewValue = "";
			//var oOldValue = "";
			//var oListItem = "";
			this.oAttachment.attachItemPress({Entity: aResult, name:'ccItemDetail' },oView.navtoSubDetail, oView);
			for(var i=0;i<aResult.CCTR.CCTR2AtthCCTRRel.results.length;i++ )
			{
				for(var j=0;j<aResult.CCTR.CCTR2AtthCCTRRel.results[i].ChangeData.results.length;j++ ){
					var oGlobal = 	this;
					var vLink = "";
					if(aResult.CCTR.CCTR2AtthCCTRRel.results[i].ChangeData.results[j].EntityAction !== 'D'){
					if(aResult.CCTR.CCTR2AtthCCTRRel.results[i].USMD_LINK !== "")
						vLink = aResult.CCTR.CCTR2AtthCCTRRel.results[i].USMD_LINK;
					else
						vLink = aResult.CCTR.CCTR2AtthCCTRRel.results[i].__metadata.media_src;
					}
					var oAttach = new sap.m.Link({
						text : aResult.CCTR.CCTR2AtthCCTRRel.results[i].USMD_TITLE,
						target : "_blank",
						href : vLink,
						wrapping : true,
						subtle : false,
						emphasized : false,
						press: function(){
							oGlobal.setLinkPress('X');
						}
					}).addStyleClass("padding_bottom");

					//oAttach.attachPress(aResult,this.handleLinkPress(),' ');
					var vForamtdate = fcg.mdg.approvecrv2.util.Formatter.dateFormatter(aResult.CCTR.CCTR2AtthCCTRRel.results[i].USMD_ACREATED_AT) + " " 
					+ sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('AttachBy') + " ";
					var vContributor = " " + aResult.CCTR.CCTR2AtthCCTRRel.results[i].CD_USMD_ACREATED_BY.Description + "(" + aResult.CCTR.CCTR2AtthCCTRRel.results[i].CD_USMD_ACREATED_BY.Code + ")";
					var oContributor = new sap.m.Text({text:vForamtdate + " " + vContributor });
					//var oContributor1 = new sap.m.Text({text:aResult.CCTR.CCTR2AtthCCTRRel.results[i].USMD_ACREATED_AT, visible:false});

					var oIcon = fcg.mdg.approvecrv2.util.Formatter.mimeTypeFormatter(aResult.CCTR.CCTR2AtthCCTRRel.results[i].USMD_FILE_TYPE);
					var vl = new sap.ui.layout.VerticalLayout({
						content:[oAttach,oContributor]}).addStyleClass("padding_left");

					 oIcon = new sap.ui.core.Icon({
						src: oIcon,
						size: "3.0em"});

					var h1 = new sap.m.HBox({
						items:
							[oIcon,vl]});

					if(aResult.CCTR.CCTR2AtthCCTRRel.results[i].ChangeData.results[j].EntityAction === 'C' ){

						 oNewValue = new sap.m.ObjectIdentifier({
							text : " ",
							title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_ADDED")		
						});

						var oOldValue = new sap.m.Text({text : ""}); 					 
						var oListItem = new sap.m.ColumnListItem({
							type:"Navigation",
							mergeDuplicates:true,
							cells: [h1,
							        oNewValue,
							        oOldValue
							        ]
						});

						this.oAttachment.addItem(oListItem);
						break;
					}
					
					else if(aResult.CCTR.CCTR2AtthCCTRRel.results[i].ChangeData.results[j].EntityAction === 'D' ){

						 oNewValue = new sap.m.ObjectIdentifier({
							text : " ",
							title : sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_DELETED")		
						});

						var oOldValue = new sap.m.Text({text : ""}); 					 
						var oListItem = new sap.m.ColumnListItem({
							type:"Navigation",
							mergeDuplicates:true,
							cells: [h1,
							        oNewValue,
							        oOldValue
							        ]
						});

						this.oAttachment.addItem(oListItem);
						break;
					}
					
					else{
						

						if(aResult.CCTR.CCTR2AtthCCTRRel.results[i].ChangeData.results[j].Attribute === 'USMD_EXPL' || 
								aResult.CCTR.CCTR2AtthCCTRRel.results[i].ChangeData.results[j].Attribute === 'USMD_LANG')
						{
							
							if(aResult.CCTR.CCTR2AtthCCTRRel.results[i].ChangeData.results[j].OldValue === ""){
								vOldValue = "(" + sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_NOT_MAIN") + ")";
							}
							else{
								vOldValue = aResult.CCTR.CCTR2AtthCCTRRel.results[i].ChangeData.results[j].OldValue;
							}
							if(aResult.CCTR.CCTR2AtthCCTRRel.results[i].ChangeData.results[j].NewValue === "" && aResult.CCTR.CCTR2AtthCCTRRel.results[i].ChangeData.results[j].OldValue !== "")
								vNewValue = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_DELETED");
							else if(aResult.CCTR.CCTR2AtthCCTRRel.results[i].ChangeData.results[j].NewValue !== "")
								vNewValue = aResult.CCTR.CCTR2AtthCCTRRel.results[i].ChangeData.results[j].NewValue;

							if(aResult.CCTR.CCTR2AtthCCTRRel.results[i].ChangeData.results[j].Attribute === 'USMD_EXPL')
								var vAttrDesc = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("ATTACH_COMMENT");
							else
								 vAttrDesc = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("Language");
							 oNewValue = new sap.m.ObjectIdentifier({
								text : vAttrDesc,
								title : vNewValue		
							});
							 oOldValue = new sap.m.Text({text : vOldValue}); 

							 oListItem = new sap.m.ColumnListItem({
								type:"Navigation",
								mergeDuplicates:true,
								cells: [h1,
								        oNewValue,
								        oOldValue
								        ]
							});

							this.oAttachment.addItem(oListItem);
						}

					}
				}
			}

			if(this.oAttachment.getItems().length === 0){
				sap.ui.getCore().byId("ccAttachmentLayout").removeAllContent();
				sap.ui.getCore().byId("ccAttachmentLayout").destroy();
			}

		},

		setLinkPress:function(value){//Set the value to identify Link has been pressed
			this.vLinkPressed = value;
		},
		
		getLinkPress:function(){//Get the value to identify Link has been pressed
			return this.vLinkPressed;
		}
};