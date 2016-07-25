/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
//EXC_ALL_JSHINT_047
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenterChange");

fcg.mdg.approvecrv2.DomainSpecParts.ProfitCenterChange = {
		//Declare global variables
		oGeneralTable : "",
		oAddressTable : "",
		oCommTable : "",
		nodata:"",
		oProfitCenterIndTable : "",
		oProfitCenterDescTable: "",
		oCompCodeTable: "",
		oAttachment:"",
		i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),
		vLinkPressed: "",
		oS3Controller:"",

		// Initializing tables and adding them to layouts 
		initialize_Tables : function(oS3Controller) {

			this.oS3Controller = oS3Controller;
			//delete all UI contents if present for create layout
			sap.ui.getCore().byId("pcCreateDataLayout").removeAllContent();	
			var oHeaderLabel = new sap.m.Label({text:this.i18n.getText("PC_DESCRIPTION")});//Table first column header text for General, Communication, Address and Indicators Section 

			//initialize general section table and load the fragment into appropriate layout
			sap.ui.getCore().byId("pcGeneralDataLayout").removeAllContent();	
			this.oGeneralTable = "";
			this.oGeneralTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse', this);
			sap.ui.getCore().byId("pcGeneralDataLayout").removeAllContent();
			sap.ui.getCore().byId("pcGeneralDataLayout").addContent(this.oGeneralTable);
			var aGeneralColumns = this.oGeneralTable.getColumns();	
			var oGenlLabel = new sap.m.Label({text:this.i18n.getText("PC_DESCRIPTION")});
			aGeneralColumns[0].setHeader(oGenlLabel);
			this.oGeneralTable.setGrowing(true);
			//this.oGeneralTable.setHeaderText(this.i18n.getText("PC_TIT_GEN"));

			//initialize Address section table and load the fragment into appropriate layout
			sap.ui.getCore().byId("pcAddressLayout").removeAllContent();
			this.oAddressTable = "";
			this.oAddressTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse', this);
			sap.ui.getCore().byId("pcAddressLayout").addContent(this.oAddressTable);
			var aAddressColumns = this.oAddressTable.getColumns();	
			var oAddrLabel = new sap.m.Label({text:this.i18n.getText("PC_DESCRIPTION")});
			aAddressColumns[0].setHeader(oAddrLabel);
			this.oAddressTable.setGrowing(true);
			this.oAddressTable.setHeaderText(this.i18n.getText("PC_TIT_ADDRESS"));

			//initialize Communication section table and load the fragment into appropriate layout
			sap.ui.getCore().byId("pcCommLayout").removeAllContent();
			this.oCommTable = "";
			this.oCommTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse', this);
			sap.ui.getCore().byId("pcCommLayout").addContent(this.oCommTable);
			var aCommColumns = this.oCommTable.getColumns();			
			var oCommLabel = new sap.m.Label({text:this.i18n.getText("PC_DESCRIPTION")});
			aCommColumns[0].setHeader(oCommLabel);
			this.oCommTable.setGrowing(true);
			this.oCommTable.setHeaderText(this.i18n.getText("PC_TIT_COMM"));

			//initialize Indicators section table and load the fragment into appropriate layout
			sap.ui.getCore().byId("pcIndLayout").removeAllContent();
			this.oProfitCenterIndTable = "";
			this.oProfitCenterIndTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse', this);
			sap.ui.getCore().byId("pcIndLayout").addContent(this.oProfitCenterIndTable);
			var aIndColumns = this.oProfitCenterIndTable.getColumns();		
			var oIndLabel = new sap.m.Label({text:this.i18n.getText("PC_DESCRIPTION")});
			aIndColumns[0].setHeader(oIndLabel);
			this.oProfitCenterIndTable.setGrowing(true);
			this.oProfitCenterIndTable.setHeaderText(this.i18n.getText("PC_TIT_IND"));

			//initialize file upload and load the fragment into appropriate layout
			sap.ui.getCore().byId("pcAttachmentLayout").removeAllContent();
			this.oAttachment = "";
			this.oAttachment = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse', this);
			sap.ui.getCore().byId("pcAttachmentLayout").addContent(this.oAttachment);
			var aAttachColumns = this.oAttachment.getColumns();			
			aAttachColumns[0].setHeader(oHeaderLabel);
			var oAttachHeaderLabel = new sap.m.Label({text:this.i18n.getText("PC_ATTACHMENT")});
			aAttachColumns[0].setHeader(oAttachHeaderLabel);
			this.oAttachment.setGrowing(true);
			this.oAttachment.setHeaderText(this.i18n.getText("PC_TIT_ATTACH"));

			//initialize company code table and load the fragment into appropriate layout
			sap.ui.getCore().byId("pcCompCodeLayout").removeAllContent();
			this.oCompCodeTable = "";
			this.oCompCodeTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse', this);
			sap.ui.getCore().byId("pcCompCodeLayout").addContent(this.oCompCodeTable);
			var aCompCodeColumns = this.oCompCodeTable.getColumns();	
			var oCompHeaderLabel = new sap.m.Label({text:this.i18n.getText("CompCode")});
			aCompCodeColumns[0].setHeader(oCompHeaderLabel);
			this.oCompCodeTable.setGrowing(true);
			this.oCompCodeTable.setHeaderText(this.i18n.getText("PC_TIT_CC_ASGN"));

			//initialize description table and load the fragment into appropriate layout
			sap.ui.getCore().byId("pcDescriptionLayout").removeAllContent();
			this.oProfitCenterDescTable = "";
			this.oProfitCenterDescTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Tablereuse', this);
			sap.ui.getCore().byId("pcDescriptionLayout").addContent(this.oProfitCenterDescTable);
			var aDescColumns = this.oProfitCenterDescTable.getColumns();	
			var oDescHeaderLabel = new sap.m.Label({text:this.i18n.getText("PC_DESC_COL_NAME")});
			aDescColumns[0].setHeader(oDescHeaderLabel);
			this.oProfitCenterDescTable.setGrowing(true);
			this.oProfitCenterDescTable.setHeaderText(this.i18n.getText("PC_DESC_TAB"));	
			this.oS3Controller.pcHookPCChangeLayout();
		},

		// To return CHANGE data and ACTUAL data to details screen(S4)
		getDetailData:function(){
			return this.aDetailData;
		},

		//query for change data and code descriptions
		getQueries:function(sServiceUrl,sPath,s3Controller){
			this.oS3Controller = s3Controller;
			//var aQuery = [];//sServiceUrl +
			var sQuery =  sPath +  "?$expand=PCTR/ChangeData,PCTR/PCTR2DTxtPCTRRel/ChangeData,PCTR/PCTR2PCCCASSRel/ChangeData,PCTR/PCTR2AtthPCTRRel/ChangeData," +
			"PCTR/CD_PCTRPCTRN,PCTR/CD_PCTRRESPU,PCTR/CD_COAREA,PCTR/CD_PC_LAND1,PCTR/CD_PC_REGION,PCTR/CD_PC_SPRAS,PCTR/CD_PCTRTXJCD,PCTR/CD_PCTRSEG,PCTR/PCTR2PCCCASSRel/CD_COMPCODE,PCTR/PCTR2DTxtPCTRRel/CD_LANGU,PCTR/PCTR2AtthPCTRRel/CD_USMD_ACREATED_BY";
			//aQuery.push(Query);
			var extQuery = this.oS3Controller.pcHookPCChangeQuery(sQuery);
			if(extQuery !== undefined){
				sQuery = extQuery;
			}
			return sQuery;
		},

		//Function to map the table data on S3 and display it accordingly
		displayTableData : function(result, oInstance, oView) {	// EXC_JSHINT_047
			this.aDetailData = result;
			var oItemTemp = this.createTableTemplate(); // Get the item template
			oItemTemp.attachPress({Entity: result, name:'pcItemDetail' },oView.navtoSubDetail, oView);

			//create array for each section so that Json model can be created and tables can be bound to corresponding model
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

			var vNotMaint =  "(" + this.i18n.getText("PC_NOT_MAIN") + ")";
			var vDeleted =  this.i18n.getText("PC_DELETED");

			this.handleNodata(result);//Handler for no data changed

			// If any entity data has been changed, the changed data will be contained in ChangeData entity of that particular entity
			for ( var i = 0; i < result.PCTR.ChangeData.results.length; i++) {
				result.PCTR.ChangeData.results[i].EntityDesc = result.PCTR.TXTSH + " (" + result.PCTR.COAREA + "/" + result.PCTR.PCTR + ")";
				var sAttr = result.PCTR.ChangeData.results[i].Attribute;
				// General Data
				if (sAttr === 'PCTR' || sAttr === 'COAREA' || sAttr === 'PCTRDEPT'
					|| sAttr === 'PCTRSEG' || sAttr === 'PCTRDEPT'
						|| sAttr === 'PCTRCCTR' || sAttr === 'PCTRLSYS'
							|| sAttr === 'PCTRPCTRN' || sAttr === 'PCTRRESPU'
								|| sAttr === 'PCTRRESPP') {

					if(result.PCTR.ChangeData.results[i].OldValue === "")
						result.PCTR.ChangeData.results[i].OldValue = vNotMaint;//if nothing is maintained in the field when it was initially created
					//To show the description of value and new value together in a single row, concatenate the values
					if(result.PCTR.ChangeData.results[i].OldValueText !== "")
						result.PCTR.ChangeData.results[i].OldValue = result.PCTR.ChangeData.results[i].OldValueText + " (" + result.PCTR.ChangeData.results[i].OldValue + ")";
					//To show the description of value and old value together in a single row, concatenate the values
					if(result.PCTR.ChangeData.results[i].NewValueText !== "")
						result.PCTR.ChangeData.results[i].NewValue = result.PCTR.ChangeData.results[i].NewValueText + " (" + result.PCTR.ChangeData.results[i].NewValue + ")";
					//If the attribute contained some values earlier and is now cleared/deleted, then the new value should be set to "Deleted"
					if(result.PCTR.ChangeData.results[i].NewValue === "" && result.PCTR.ChangeData.results[i].OldValue !== "")
						result.PCTR.ChangeData.results[i].NewValue = vDeleted;
					aGenData.results.push(result.PCTR.ChangeData.results[i]);
				}
				// Address
				if (sAttr === 'PC_ANRED' || sAttr === 'PC_NAME1'
					|| sAttr === 'PC_NAME2' || sAttr === 'PC_NAME3'
						|| sAttr === 'PC_NAME4' || sAttr === 'PC_STRAS'
							|| sAttr === 'PC_PSTLZ' || sAttr === 'PC_ORT01'
								|| sAttr === 'PC_ORT02' || sAttr === 'PC_LAND1'
									|| sAttr === 'PC_REGION' || sAttr === 'PC_PSTL2'
										|| sAttr === 'PC_PFACH' || sAttr === 'PCTRTXJCD') {
					// Overwrite the attribute name coming from odata(changed
					// from NAME to NAME1)
					if(sAttr === 'PC_NAME1'){
						result.PCTR.ChangeData.results[i].AttributeDesc = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("CC_NAME1");
					}
					if(result.PCTR.ChangeData.results[i].OldValue === "")
						// if nothing is maintained in the field when it was
						// initially created
						result.PCTR.ChangeData.results[i].OldValue = vNotMaint;
					//To show the description of value and new value together in a single row, concatenate the values
					if(result.PCTR.ChangeData.results[i].OldValueText !== "")
						result.PCTR.ChangeData.results[i].OldValue = result.PCTR.ChangeData.results[i].OldValueText + " (" + result.PCTR.ChangeData.results[i].OldValue + ")";
					//To show the description of value and old value together in a single row, concatenate the values
					if(result.PCTR.ChangeData.results[i].NewValueText !== "")
						result.PCTR.ChangeData.results[i].NewValue = result.PCTR.ChangeData.results[i].NewValueText + " (" + result.PCTR.ChangeData.results[i].NewValue + ")";
					//If the attribute contained some values earlier and is now cleared/deleted, then the new value should be set to "Deleted"
					if(result.PCTR.ChangeData.results[i].NewValue === "" && result.PCTR.ChangeData.results[i].OldValue !== "")
						result.PCTR.ChangeData.results[i].NewValue = vDeleted;
					aAddress.results.push(result.PCTR.ChangeData.results[i]);
				}

				// Communication
				if (sAttr === 'PC_SPRAS' || sAttr === 'PC_TELF1'
					|| sAttr === 'PC_TELF2' || sAttr === 'PC_TELFX'
						|| sAttr === 'PC_TELBX' || sAttr === 'PC_TELX1'
							|| sAttr === 'PC_TELTX' || sAttr === 'PC_DRNAM'
								|| sAttr === 'PC_DATLT') {
					if(result.PCTR.ChangeData.results[i].OldValue === "")
						//if nothing is maintained in the field when it was initially created
						result.PCTR.ChangeData.results[i].OldValue = vNotMaint;
					//To show the description of value and new value together in a single row, concatenate the values
					if(result.PCTR.ChangeData.results[i].OldValueText !== "")
						result.PCTR.ChangeData.results[i].OldValue = result.PCTR.ChangeData.results[i].OldValueText + " (" + result.PCTR.ChangeData.results[i].OldValue + ")";
					//To show the description of value and old value together in a single row, concatenate the values
					if(result.PCTR.ChangeData.results[i].NewValueText !== "")
						result.PCTR.ChangeData.results[i].NewValue = result.PCTR.ChangeData.results[i].NewValueText + " (" + result.PCTR.ChangeData.results[i].NewValue + ")";
					//If the attribute contained some values earlier and is now cleared/deleted, then the new value should be set to "Deleted"
					if(result.PCTR.ChangeData.results[i].NewValue === "" && result.PCTR.ChangeData.results[i].OldValue !== "")
						result.PCTR.ChangeData.results[i].NewValue = vDeleted;
					aCommData.results.push(result.PCTR.ChangeData.results[i]);
				}

				// Indicators
				if (sAttr === 'PCTRLKIND') {
					if(result.PCTR.ChangeData.results[i].NewValue === 'X')
						result.PCTR.ChangeData.results[i].NewValue = this.i18n.getText("PC_YES");//To display X as Yes on the UI for indicator
					else if(result.PCTR.ChangeData.results[i].NewValue === "")
						result.PCTR.ChangeData.results[i].NewValue = this.i18n.getText("PC_NO");//To display blank as No on the UI for indicator

					if(result.PCTR.ChangeData.results[i].OldValue === 'X')
						result.PCTR.ChangeData.results[i].OldValue = this.i18n.getText("PC_YES");//To display X as Yes on the UI for indicator
					else if(result.PCTR.ChangeData.results[i].OldValue === "")
						result.PCTR.ChangeData.results[i].OldValue = this.i18n.getText("PC_NO");//To display blank as No on the UI for indicator
					aIndicators.results.push(result.PCTR.ChangeData.results[i]);
				}
			}
			//Bind description data to description table
			this.bindDescriptionTable(result, oView, oItemTemp);
			//Bind company code data to table
			this.bindCompanyCodeTable(result,oItemTemp);
			this.createAttachmentTable(result, oView);//Create attachment table
			this.oS3Controller.pcHookFillDataForChangeLayout(result);
			var aModifiedData = this.oS3Controller.pcHookModifyChangeData(aGenData,aAddress,aCommData,aIndicators,result);
			if(aModifiedData !== undefined){
				aGenData = aModifiedData.aGenData;
				aAddress = aModifiedData.aAddress;
				aCommData = aModifiedData.aCommData;
				aIndicators = aModifiedData.aIndicators;
			}
			//Bind general data to Form
			this.bindFormData(aGenData,aAddress,aCommData,aIndicators,oItemTemp);
		},	

		//Bind data to general form
		bindFormData:function(aGenData,aAddress,aCommData,aIndicators,oItemTemp){
			//general data
			if(aGenData.results.length === 0)
			{
				//If no data has been changed in General section, remove the layout content from the page else it will occupy space
				sap.ui.getCore().byId("pcGeneralDataLayout").removeAllContent();
				//Handling of No data if the user has not changed anything in the CR
				if (this.nodata === 'X' )
				{
					var text = new sap.m.Text("pcTxt");
					text.setText(this.i18n.getText("Nodata"));
					sap.ui.getCore().byId("pcGeneralDataLayout").addContent(text);
					this.nodata = "";
				}
			}
			else{
				var oGenDataModel = new sap.ui.model.json.JSONModel();
				oGenDataModel.setData(aGenData);
				this.oGeneralTable.setModel(oGenDataModel);			 
				this.oGeneralTable.bindItems('/results', oItemTemp, '', '');}

			//address data
			if(aAddress.results.length === 0)
			{
				//If no data has been changed in Address section, remove the layout from the page else it will occupy space
				sap.ui.getCore().byId("pcAddressLayout").removeAllContent();
				sap.ui.getCore().byId("pcAddressLayout").destroy();
			}
			else{
				var oAddressModel = new sap.ui.model.json.JSONModel();
				oAddressModel.setData(aAddress);
				this.oAddressTable.setModel(oAddressModel);
				this.oAddressTable.bindItems('/results', oItemTemp, '', '');}

			//communication data
			if(aCommData.results.length === 0)
			{
				//If no data has been changed in Communication section, remove the layout from the page else it will occupy space
				sap.ui.getCore().byId("pcCommLayout").removeAllContent();
				sap.ui.getCore().byId("pcCommLayout").destroy();
			}
			else{
				var oCommModel = new sap.ui.model.json.JSONModel();
				oCommModel.setData(aCommData);
				this.oCommTable.setModel(oCommModel);
				this.oCommTable.bindItems('/results', oItemTemp, '', '');}

			//indicators data
			if(aIndicators.results.length === 0)
			{
				//If no data has been changed in Indicators section, remove the layout from the page else it will occupy space
				sap.ui.getCore().byId("pcIndLayout").removeAllContent();
				sap.ui.getCore().byId("pcIndLayout").destroy();
			}
			else{
				var oIndicatorModel = new sap.ui.model.json.JSONModel();
				oIndicatorModel.setData(aIndicators);
				this.oProfitCenterIndTable.setModel(oIndicatorModel);
				this.oProfitCenterIndTable.bindItems('/results', oItemTemp, '', '');}			
		},

		//Bind data to description table
		bindDescriptionTable:function(result,oView, oItemTemp){
			//description table
			var vDeleted =  this.i18n.getText("PC_DELETED");
			var strResults = {results:[]};		
			var vNotMaint =  "(" + this.i18n.getText("PC_NOT_MAIN") + ")";
			for ( var i = 0; i < result.PCTR.PCTR2DTxtPCTRRel.results.length; i++) {	
				for(var j = 0; j < result.PCTR.PCTR2DTxtPCTRRel.results[i].ChangeData.results.length;j++){
					var oDataItems = {
							EntityDesc:"",
							AttributeDesc:"",
							NewValue:"",
							OldValue:""		
					};
					if(result.PCTR.PCTR2DTxtPCTRRel.results[i].ChangeData.results[j].Attribute !== 'PCTR' && 
							result.PCTR.PCTR2DTxtPCTRRel.results[i].ChangeData.results[j].Attribute !== 'COAREA' && 
							result.PCTR.PCTR2DTxtPCTRRel.results[i].ChangeData.results[j].Attribute !== 'LANGU'){
					//oDataItems.Lang = result.PCTR.PCTR2DTxtPCTRRel.results[i].CD_LANGU.Code;
					oDataItems.EntityDesc = result.PCTR.PCTR2DTxtPCTRRel.results[i].TXTSH + " (" + 
					result.PCTR.PCTR2DTxtPCTRRel.results[i].CD_LANGU.Description + ")";
					//oDataItems.LangDesc = result.PCTR.PCTR2DTxtPCTRRel.results[i].CD_LANGU.Description;

					if(result.PCTR.PCTR2DTxtPCTRRel.results[i].ChangeData.results[j].EntityAction === 'C' ){
						oDataItems.NewValue = this.i18n.getText("PC_ADDED");
						strResults.results.push(oDataItems);
						break;
					}
					
					else if(result.PCTR.PCTR2DTxtPCTRRel.results[i].ChangeData.results[j].EntityAction === 'D' ){
						oDataItems.NewValue = this.i18n.getText("PC_DELETED");
						strResults.results.push(oDataItems);
						break;
					}
					
					else{
						if(result.PCTR.PCTR2DTxtPCTRRel.results[i].ChangeData.results[j].Attribute === 'TXTSH'){
							oDataItems.AttributeDesc = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("FIN_SHORT_TEXT");
						}
						else if(result.PCTR.PCTR2DTxtPCTRRel.results[i].ChangeData.results[j].Attribute === 'TXTMI'){
							oDataItems.AttributeDesc = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("FIN_MED_TEXT");
						}
						else
						{
							oDataItems.AttributeDesc = result.PCTR.PCTR2DTxtPCTRRel.results[i].ChangeData.results[j].AttributeDesc;
						}	
						if(result.PCTR.PCTR2DTxtPCTRRel.results[i].ChangeData.results[j].OldValue === ""){
							oDataItems.OldValue = vNotMaint;//If the attribute did not contain any value earlier and now some value has been entered, then old value should be "Not maintained"
						}
						else{
							oDataItems.OldValue = result.PCTR.PCTR2DTxtPCTRRel.results[i].ChangeData.results[j].OldValue;
						}
						//If the attribute contained some values earlier and is now cleared/deleted, then the new value should be set to "Deleted"
						if(result.PCTR.PCTR2DTxtPCTRRel.results[i].ChangeData.results[j].NewValue === "" && result.PCTR.PCTR2DTxtPCTRRel.results[i].ChangeData.results[j].OldValue !== "")
							oDataItems.NewValue = vDeleted;
						else if(result.PCTR.PCTR2DTxtPCTRRel.results[i].ChangeData.results[j].NewValue !== "")
							oDataItems.NewValue = result.PCTR.PCTR2DTxtPCTRRel.results[i].ChangeData.results[j].NewValue;
						strResults.results.push(oDataItems);
					}	
				}
				}
			}
			//Bind description data to the model and to the table
			if(strResults.results.length === 0)//If no data has been changed in Description section, remove the layout from the page else it will occupy space
			{
				sap.ui.getCore().byId("pcDescriptionLayout").removeAllContent();
				sap.ui.getCore().byId("pcDescriptionLayout").destroy();
			}
			else{
				var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
				oModel.setData(strResults); 
				///var oItemDescTemp = this.descrValueTemplate();  //Get the template 
				var extOItemTemp = this.oS3Controller.pcHookPCChangeDescTemplate(oItemTemp);
				if(extOItemTemp !== undefined){
					oItemTemp = extOItemTemp;
				}	    
				this.oProfitCenterDescTable.setModel(oModel);
				//oItemTemp.attachPress({Entity: result, name:'pcItemDetail'},oView.navtoSubDetail, oView);
				this.oProfitCenterDescTable.bindItems('/results', oItemTemp, '', ''); 
			}			
		},

		//Bind data to company code table
		bindCompanyCodeTable:function(result,oItemTemp){
			var aCompCodeData = {
					results : []
			};
			//company code
			for ( var i = 0; i < result.PCTR.PCTR2PCCCASSRel.results.length; i++) {
				for(var j = 0; j < result.PCTR.PCTR2PCCCASSRel.results[i].ChangeData.results.length;j++){
					var oDataItems = {
							EntityDesc:"",
							AttributeDesc:"",
							NewValue:"",
							OldValue:""				

					};
					if(result.PCTR.PCTR2PCCCASSRel.results[i].ChangeData.results[j].Attribute !== 'PCTR' && 
							result.PCTR.PCTR2PCCCASSRel.results[i].ChangeData.results[j].Attribute !== 'COAREA' && 
							result.PCTR.PCTR2PCCCASSRel.results[i].ChangeData.results[j].Attribute !== 'COMPCODE'){
					oDataItems.EntityDesc = result.PCTR.PCTR2PCCCASSRel.results[i].CD_COMPCODE.Description + " (" + 
					result.PCTR.PCTR2PCCCASSRel.results[i].CD_COMPCODE.Code + ")";
					//Show the new value as added if a new company code has been added in change of profit center and continue to next company code changes
					if(result.PCTR.PCTR2PCCCASSRel.results[i].ChangeData.results[j].EntityAction === 'C'){
						oDataItems.NewValue = this.i18n.getText("PC_ADDED");
						aCompCodeData.results.push(oDataItems);
						break;
					}
					
					if(result.PCTR.PCTR2PCCCASSRel.results[i].ChangeData.results[j].EntityAction === 'D'){
						oDataItems.NewValue = this.i18n.getText("PC_DELETED");
						aCompCodeData.results.push(oDataItems);
						break;
					}
					
					else{
						oDataItems.AttributeDesc = result.PCTR.PCTR2PCCCASSRel.results[i].ChangeData.results[j].AttributeDesc;
						if(result.PCTR.PCTR2PCCCASSRel.results[i].ChangeData.results[j].NewValue === "X")
							oDataItems.NewValue = this.i18n.getText("PC_YES");//To display X as Yes on the UI for indicator
						else
							oDataItems.NewValue = this.i18n.getText("PC_NO");//To display blank as No on the UI for indicator

						if(result.PCTR.PCTR2PCCCASSRel.results[i].ChangeData.results[j].OldValue === "X")
							oDataItems.OldValue = this.i18n.getText("PC_YES"); //To display X as Yes on the UI for indicator
						else
							oDataItems.OldValue = this.i18n.getText("PC_NO"); //To display blank as No on the UI for indicator
						aCompCodeData.results.push(oDataItems);
					}

				}
				}
			}
			//company code data
			if(aCompCodeData.results.length === 0)
			{
				//If no data has been changed in Company Code section, remove the layout from the page else it will occupy space
				sap.ui.getCore().byId("pcCompCodeLayout").removeAllContent();
				sap.ui.getCore().byId("pcCompCodeLayout").destroy();
			}
			else{
				var oCompCodeModel = new sap.ui.model.json.JSONModel();
				oCompCodeModel.setData(aCompCodeData);
				var extOItemTemp = this.oS3Controller.pcHookPCChangeCompCodeTemplate(oItemTemp);
				if(extOItemTemp !== undefined){
					oItemTemp = extOItemTemp;
				}	 
				this.oCompCodeTable.setModel(oCompCodeModel);			 
				this.oCompCodeTable.bindItems('/results', oItemTemp, '', '');
			}			
		},

		//General  and Company Code table template
		createTableTemplate: function(){		
			var oItemTemp = new sap.m.ColumnListItem({
				type : "Navigation",
				cells : [ 
				         new sap.m.Text({//Column which identifies each record with Language code and Description
				        	 text : "{EntityDesc}"
				         }).addStyleClass("text_bold"), 
				         new sap.m.ObjectIdentifier({
				        	 text : {
				        		 path : "AttributeDesc" //Attribute Description"
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

		//Description table template
		/*descrValueTemplate: function(){
			var oItemDescrTemp = new sap.m.ColumnListItem({
				type:"Navigation",
				cells: [
				        new sap.m.Text({//Column which identifies each record with Language code and Description
				        	text : "{EntityDesc}"
				        	//class:"text_bold"
				        }).addStyleClass("text_bold"), 	                          
				        new sap.m.ObjectIdentifier({
				        	text : {
				        		path : "AttributeDesc" // Attribute Description
				        	},
				        	title : {
				        		path : "NewValue" 
				        	}
				        }),                          
				        new sap.m.Text({
				        	text: "{OldValue}"

				        }),	                         
				        ]});
			return oItemDescrTemp;
		},*/

		//Check if there is no data for a given section so that this layout will not be shown
		handleNodata : function(result)
		{
			var noGenData="X",noAttachData="X",noDesc="X",noCompCode="X";
			//if no general data
			if (result.PCTR.ChangeData.results.length !== 0)
			{
				noGenData = "";
			}
			//If No Attachments
			for(var i=0;i<result.PCTR.PCTR2AtthPCTRRel.results.length;i++)
			{      
				if(result.PCTR.PCTR2AtthPCTRRel.results[i].ChangeData.results.length !== 0)
				{
					noAttachData = "";
					break;
				}
			}
			//If no Descriptions
			for(var j=0;j<result.PCTR.PCTR2DTxtPCTRRel.results.length;j++)
			{
				if(result.PCTR.PCTR2DTxtPCTRRel.results[j].ChangeData.results.length !== 0)
				{
					noDesc = "";
					break;
				}
			}
			//If No CompCode
			for(var k=0;k<result.PCTR.PCTR2PCCCASSRel.results.length;k++)
			{
				if(result.PCTR.PCTR2PCCCASSRel.results[k].ChangeData.results.length !== 0)
				{
					noCompCode = "";
					break;
				}
			}
			if (noGenData === 'X' && noAttachData === 'X' && noDesc === 'X' && noCompCode === 'X' )
			{
				this.nodata = 'X';
			}
		},

		//This function deals with attachment handling
		//if its a link USMD_LINK will be filled else __metadata.media_src field will have the value. 
		//if the file has __metadata.media_src as the link, it will call the Odata method GET_STREAM() to get the file content and download it to the desktop
		//if the file has web url as the link, it will not trigger the Odata and will simply open the link in new tab
		createAttachmentTable:function(aResult,oView){
			//Add navigation handler for list item of the attachment table
			var vOldValue = "";
			var vNewValue = "";
			var vAttrDesc = "";
			var oOldValue = "";
			var oNewValue = "";
			var oListItem = "";
			this.oAttachment.attachItemPress({Entity: aResult, name:'pcItemDetail' },oView.navtoSubDetail, oView);
			for(var i=0;i<aResult.PCTR.PCTR2AtthPCTRRel.results.length;i++ )
			{
				for(var j=0;j<aResult.PCTR.PCTR2AtthPCTRRel.results[i].ChangeData.results.length;j++ ){
					var oGlobal = this;
					var vLink = "";
					if(aResult.PCTR.PCTR2AtthPCTRRel.results[i].ChangeData.results[j].EntityAction !== 'D'){
					if(aResult.PCTR.PCTR2AtthPCTRRel.results[i].USMD_LINK !== "")
						vLink = aResult.PCTR.PCTR2AtthPCTRRel.results[i].USMD_LINK;
					else
						vLink = aResult.PCTR.PCTR2AtthPCTRRel.results[i].__metadata.media_src;
					}
					var oAttach = new sap.m.Link({
						text : aResult.PCTR.PCTR2AtthPCTRRel.results[i].USMD_TITLE,
						target : "_blank",
						href : vLink,
						wrapping : true,
						subtle : false,
						emphasized : false,
						press: function(){
							oGlobal.setLinkPress('X');
						}
					}).addStyleClass("padding_bottom");//add style class to get space in the bottom
					
				var vForamtdate = fcg.mdg.approvecrv2.util.Formatter.dateFormatter(aResult.PCTR.PCTR2AtthPCTRRel.results[i].USMD_ACREATED_AT) + " " 
					+ this.i18n.getText('AttachBy') + " ";
					var vContributor = " " + aResult.PCTR.PCTR2AtthPCTRRel.results[i].CD_USMD_ACREATED_BY.Description + "(" + aResult.PCTR.PCTR2AtthPCTRRel.results[i].CD_USMD_ACREATED_BY.Code + ")";
					var oContributor = new sap.m.Text({text:vForamtdate + " " + vContributor }); //concatenate the date created at and the contributor name

					//Create a vertical box in which Link and Contributor text is added
					var vl = new sap.ui.layout.VerticalLayout({
						content:[oAttach,oContributor]}).addStyleClass("padding_left");//added style class to get space on the left hand side

					var vIcon = fcg.mdg.approvecrv2.util.Formatter.mimeTypeFormatter(aResult.PCTR.PCTR2AtthPCTRRel.results[i].USMD_FILE_TYPE);//formatter class to get the icon type based on file type
					//Create an icon for the file with the size 3.0 so that it covers the Vertical box on the right hand side
					var oIcon = new sap.ui.core.Icon({
						src: vIcon,
						size: "3.0em"});

					//Create a horizontal box and insert icon and vertical box side by side
					var h1 = new sap.m.HBox({
						items:
							[oIcon,vl]});

					//If a new attachment has been added, then new value is shown as "Added"
					if(aResult.PCTR.PCTR2AtthPCTRRel.results[i].ChangeData.results[j].EntityAction === 'C' ){
						oNewValue = new sap.m.ObjectIdentifier({
							text : " ",
							title : this.i18n.getText("PC_ADDED")		
						});

						oOldValue = new sap.m.Text({text : ""}); 					 
						 oListItem = new sap.m.ColumnListItem({//create an item for the table
							type:"Navigation",
							mergeDuplicates:true,
							cells: [h1,
							        oNewValue,
							        oOldValue
							        ]
						});

						this.oAttachment.addItem(oListItem);//Add the list item to the table
						break;
					}
					
					else if(aResult.PCTR.PCTR2AtthPCTRRel.results[i].ChangeData.results[j].EntityAction === 'D' ){
						oNewValue = new sap.m.ObjectIdentifier({
							text : " ",
							title : this.i18n.getText("PC_DELETED")		
						});

						oOldValue = new sap.m.Text({text : ""}); 					 
						 oListItem = new sap.m.ColumnListItem({//create an item for the table
							type:"Navigation",
							mergeDuplicates:true,
							cells: [h1,
							        oNewValue,
							        oOldValue
							        ]
						});

						this.oAttachment.addItem(oListItem);//Add the list item to the table
						break;
					}
					
					else{
						//Check if comment or language of the attachment has been changed
						if(aResult.PCTR.PCTR2AtthPCTRRel.results[i].ChangeData.results[j].Attribute === 'USMD_EXPL' || 
								aResult.PCTR.PCTR2AtthPCTRRel.results[i].ChangeData.results[j].Attribute === 'USMD_LANG')
						{
				
							if(aResult.PCTR.PCTR2AtthPCTRRel.results[i].ChangeData.results[j].OldValue === ""){
								vOldValue = "(" + this.i18n.getText("PC_NOT_MAIN") + ")";//Old value as "Not maintained" in case of the earlier value was empty for this field
							}
							else{
								vOldValue = aResult.PCTR.PCTR2AtthPCTRRel.results[i].ChangeData.results[j].OldValue;
							}
							if(aResult.PCTR.PCTR2AtthPCTRRel.results[i].ChangeData.results[j].NewValue === "" && aResult.PCTR.PCTR2AtthPCTRRel.results[i].ChangeData.results[j].OldValue !== "")
								vNewValue = this.i18n.getText("PC_DELETED"); //Display New value as "Deleted" in case no value is contained now for thsi field
							else if(aResult.PCTR.PCTR2AtthPCTRRel.results[i].ChangeData.results[j].NewValue !== "")
								vNewValue = aResult.PCTR.PCTR2AtthPCTRRel.results[i].ChangeData.results[j].NewValue;

							if(aResult.PCTR.PCTR2AtthPCTRRel.results[i].ChangeData.results[j].Attribute === 'USMD_EXPL')
								vAttrDesc = this.i18n.getText("ATTACH_COMMENT");//Get the attribute name for comment
							else
								vAttrDesc = this.i18n.getText("Language");//Get the attribute name for Language
							oNewValue = new sap.m.ObjectIdentifier({
								text : vAttrDesc,
								title : vNewValue		
							});
							oOldValue = new sap.m.Text({text : vOldValue}); 

							 oListItem = new sap.m.ColumnListItem({ //create a an item for the table
								type:"Navigation",
								mergeDuplicates:true,
								cells: [h1,
								        oNewValue,
								        oOldValue
								        ]
							});

							this.oAttachment.addItem(oListItem);//Add the list item to the table
						}

					}
				}
			}

			if(this.oAttachment.getItems().length === 0){//Remove the table if no data has been changed in attachment section
				sap.ui.getCore().byId("pcAttachmentLayout").removeAllContent();
				sap.ui.getCore().byId("pcAttachmentLayout").destroy();
			}

		},

		setLinkPress:function(value){//Set the value to identify Link has been pressed
			this.vLinkPressed = value;
		},

		getLinkPress:function(){//Get the value to identify Link has been pressed
			return this.vLinkPressed;
		}

};