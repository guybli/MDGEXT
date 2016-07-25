/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.Material.Material");
jQuery.sap.require("fcg.mdg.approvecrv2.util.DataAccess");
/*
 * This method takes care of initializing Forms, forming queries to fetch newly created Sales Material and displaying
 * */
fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialSalesCreate = {
	oMaterialCreateForm: "",
	oMaterialPlantTable: "",
	oMaterialPlantForm: "",
	oMaterialSalesForm: "",
	flag: 0,
	oSalesTableForm: "",
	aSales: "",
	aSalesDetailData: "",
	i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),
	oSalesTableS4Details: "",
	oS3View: "",
	oSalesOrgView:"",
	aSalesdata: "",
	SalesOrgHeaderTxt: "",
	aSalesTaxTextData: "",
	vNoDataTxt:"",
	SalesOrg:"",
	DChannel:"",

	initialize_SalesForms: function(oS3Controller) {
		//Initialize the Material SalesCreate fragment and load it into the create layout of S3 screen
		this.oS3Controller = oS3Controller;
		this.vNoDataTxt = this.i18n.getText("NodataCreate");
		if (this.oMaterialSalesForm === "") {
			this.oMaterialSalesForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialSalesCreate', fcg.mdg.approvecrv2.util.Formatter);
		} else {
			this.oMaterialSalesForm.destroy();
			this.oMaterialSalesForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MaterialSalesCreate', fcg.mdg.approvecrv2.util.Formatter);
		}
		sap.ui.getCore().byId("matCreateSalesDataLayout").removeAllContent();
		sap.ui.getCore().byId("matCreateSalesDataLayout").addContent(this.oMaterialSalesForm);
			if(sap.ui.getCore().byId("matChangeSalesDataLayout")!==undefined){
					sap.ui.getCore().byId("matChangeSalesDataLayout").destroy();
			}
	},

	//******************************************************************************************************************
	
	displaySalesFormData: function(aResult) {
		//Create Json Model and set the control to Json model
		var vCrossDisDate = aResult.MSTDV;
		aResult.MSTDV = fcg.mdg.approvecrv2.util.Formatter.matDateFormat(vCrossDisDate);
		var oDetailModel = new sap.ui.model.json.JSONModel();
		oDetailModel.setData(aResult);
		sap.ui.getCore().byId("matSalesDataForm").setModel(oDetailModel);

	},

	//******************************************************************************************************************

	bindSalesTableData: function(aResult, oView) { //bind Sales data for Sales Org and  Distribution Channel
        this.flag =0;
		var oTable = sap.ui.getCore().byId("MatSalesDistChainTable");
		var oItem = "/results";
		this.aSalesdata = aResult.data.MATERIAL2MVKESALESRel;
		
		if (this.aSalesdata.results.length > 1) {
			//if lenth>1,create a table
			
			    this.flag=1;
			    var oDisModel = new sap.ui.model.json.JSONModel();
			    oDisModel.setData(this.aSalesdata);
			    // Table Personalization for Ditribution Chain table
			    // get the table control and the button control
				var oDisbChainPersButton = sap.ui.getCore().byId("DisbChainpersIcon");
				fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setTablePersonalization(oItem, oTable, oDisbChainPersButton);
			    var oItemTemp = this.createSalesDisTemplate(oDisModel);
		    	oItemTemp.attachPress({
				     Entity: aResult,
				     name: 'matSalesDataDetail'
			     }, oView.navtoSubDetail, oView); // Get the item template

			     oTable.setModel(oDisModel);
			     oTable.bindItems('/results', oItemTemp, '', '');
		      } 
		
		else if (this.aSalesdata.results.length === 1) {//else display the Data is S3 screen
			    this.flag =2;
			    if (oTable !== undefined) {
				     oTable.destroy();
		        	}
		    	this.loadSalesOrgForm();   //Load SalesOrgForm
		    	  // Table Personalization for Sales Tax table
			    // get the table control and the button control
			    var oSalesTaxTable = sap.ui.getCore().byId("MatSalestaxTable");
				var oSalesTaxPersButton = sap.ui.getCore().byId("SalesTaxpersIcon");
				fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.setTablePersonalization(oItem, oSalesTaxTable, oSalesTaxPersButton);
				// End of Table Personalization
			    this.getSalesDetailData(0);
			    var vSalesHeader= this.setGetSalesObjHeader(0);
			    sap.ui.getCore().byId("Txt_SALESORG").setText(this.SalesOrg); 
			     sap.ui.getCore().byId("Txt_DISTCHANNEL").setText(this.DChannel); 
			    this.bindSalesOrgData();
			    this.hideSalesOrgDetailSection();
			    sap.ui.getCore().byId("matSalesCreateLayout").addContent(this.oSalesTableForm);

		} 
		else {
			  if (oTable !== undefined) {
				    oTable.destroy();
				    //sap.ui.getCore().byId("MatSalesDisChainLayout").destroy();//destroy the table if SalesOrg data is not available
			      
			  	
			  }
	    	}
	     this.hideSalesSection();   //hide the sections if data is not there
	    	 
	},

	//******************************************************************************************************************
	loadSalesOrgForm: function() { //load Sales Org Form 
		
		if (this.oSalesTableForm === "") {
			  if (this.oSalesTableS4Details !== "") {
				    this.oSalesTableS4Details.destroy(); //destroy the oSalesTableS4Details instance else duplicate id
			      }
			   this.oSalesTableForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatSalesOrgDetails', fcg.mdg.approvecrv2.util.Formatter);
		     }
		else {

			   if (this.oSalesTableForm !== undefined) {
				      this.oSalesTableForm.destroy();
			    }
			   if (this.oSalesTableS4Details !== "") {
				      this.oSalesTableS4Details.destroy();
			   }
			   this.oSalesTableForm = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.Material.MatSalesOrgDetails', fcg.mdg.approvecrv2.util.Formatter);
		}
		sap.ui.getCore().byId("matSalesCreateLayout").removeContent(this.oSalesTableForm);
		sap.ui.getCore().byId("matSalesCreateLayout").addContent(this.oSalesTableForm);
	},
	//******************************************************************************************************************
	bindSalesOrgData: function() { 	//bind the data to the model
	
		var oDetailModel = new sap.ui.model.json.JSONModel();
		var vVMSTD = this.aSalesDetailData.VMSTD;
		this.aSalesDetailData.VMSTD = fcg.mdg.approvecrv2.util.Formatter.matDateFormat(vVMSTD);
		oDetailModel.setData(this.aSalesDetailData);
		var vElement = sap.ui.getCore().byId("matSalesCreateLayout");
		this.bindSalesTaxTextData(this.aSalesTaxTextData);
		vElement.setModel(oDetailModel);

	},
	//******************************************************************************************************************
	getSalesDetailData: function(sRowId) { //get the detailed data for Sales including tax and text data
		
		fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getSalesTableData(sRowId);
		this.aSalesDetailData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getSalesDetailData();
		this.aSalesTaxTextData = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getSalesTaxData();
	    if (this.aSalesDetailData.data.MATERIAL === undefined) {
			    this.aSalesDetailData = this.aSalesDetailData.data.__batchResponses[0].data;
		} 
		else{
			   this.aSalesDetailData = this.aSalesDetailData.data;
		}
		return this.aSalesDetailData;
	},
	
	//******************************************************************************************************************

	bindSalesTaxTextData: function(aResult) { 	//bind data for Tax and Text Table of Sales Detail screen.
	

		this.data = aResult.data.MVKESALES2MLANSALESRel;
		this.textData = aResult.data.MVKESALES2SALESTXTRel;
		var oSalesTaxTable = sap.ui.getCore().byId("MatSalestaxTable");
		var oSalesTextTable = sap.ui.getCore().byId("MatSalestextTable");
		
		if (this.data.results.length >= 1) {
			   var oDisModel = new sap.ui.model.json.JSONModel();
			   oDisModel.setData(this.data);
			   var oItemTemp = this.createSalesTaxTemplate(oDisModel);
			   oSalesTaxTable.setModel(oDisModel);
			   oSalesTaxTable.bindItems('/results', oItemTemp, '', '');

		} 
		else{
			    oSalesTaxTable.destroy();
		}
		if (this.textData.results.length >= 1) {
	
			   this.oS3View = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
			   for(var i=0; i < this.textData.results.length; i++) 
                 {
                      for(var j=0; j < this.textData.results.length; )
                        {
                           if(this.textData.results[j].TXTSALES === "")
                              {
                                  for(var k=j; k < this.textData.results.length-1;k++) 
                                       {
                                         this.textData.results[k].TXTSALES = 	this.textData.results[k+1].TXTSALES;
			   	   	                     this.textData.results[k].LANGUCODE =  	this.textData.results[k+1].LANGUCODE;
			   	   	                     this.textData.results[k].LANGUCODE__TXT =	this.textData.results[k+1].LANGUCODE__TXT;
                                      }
                                               this.textData.results.length = this.textData.results.length -1 ;
                                      }
                                  else {
                                    j++;
                            }
                               }
                        }
			   
		
		
			   var oTextModel = new sap.ui.model.json.JSONModel();
			   oTextModel.setData(this.textData);
			   var otextTemp = this.createSalesTextTemplate(oTextModel);
			    this.oSalesOrgView = fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getMatSalesOrgInstance();
			   if(this.aSalesdata.results.length > 1){
			   	 otextTemp.attachPress({
				   Entity: aResult,
				   name: 'matSalesTextDetail'
			     }, this.oSalesOrgView.navtoSubDetail, this.oSalesOrgView);
			   oSalesTextTable.setModel(oTextModel);
			   oSalesTextTable.bindItems('/results', otextTemp, '', '');
			  	
			   }
			   else{
			   otextTemp.attachPress({
				   Entity: aResult,
				   name: 'matSalesTextDetail'
			     }, this.oS3View.navtoSubDetail, this.oS3View);
			   oSalesTextTable.setModel(oTextModel);
			   oSalesTextTable.bindItems('/results', otextTemp, '', '');
		} 
		}
		else {
			   oSalesTextTable.destroy();
			   
		}

	},
	//******************************************************************************************************************
	createSalesTaxTemplate: function(oDisModel) {
		//create Sales Tax Template 
		var oItemTemp = new sap.m.ColumnListItem({
			cells: [
	new sap.m.Text({
					text: {
						path: 'ALAND',
						formatter: function() {
							var desc = oDisModel.getProperty("ALAND__TXT", this.getBindingContext());
							var key = oDisModel.getProperty("ALAND", this.getBindingContext());
							if (key === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
							}
						}
					}
				}),
	new sap.m.Text({
					text: {
						path: 'TATYP',
						formatter: function() {
							var desc = oDisModel.getProperty("TATYP__TXT", this.getBindingContext());
							var key = oDisModel.getProperty("TATYP", this.getBindingContext());
							if (key === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
							}
						}
					}
				}),
	new sap.m.Text({
					text: {
						path: 'TAXSALTAX',
						formatter: function() {
							var desc = oDisModel.getProperty("TAXSALTAX__TXT", this.getBindingContext());
							var key = oDisModel.getProperty("TAXSALTAX", this.getBindingContext());
							if (key === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
							}
						}
					}
				})

                ]
		});
			var extoItemTemp = this.oS3Controller.matHookgetSalesTaxTemplate(oItemTemp);
			if(extoItemTemp !== undefined){
				oItemTemp = extoItemTemp;
		}
		return oItemTemp;

	},
	//******************************************************************************************************************
	createSalesTextTemplate: function(oTextModel) { //create Sales Text Template
	    
		var otextTemp = new sap.m.ColumnListItem({
				
			type: "Navigation",
			cells: [
				
								
								
           new sap.m.Text({
					text: {
						path: 'LANGUCODE',
						formatter: function() {
							var desc = oTextModel.getProperty("LANGUCODE__TXT", this.getBindingContext());
							var key = oTextModel.getProperty("LANGUCODE", this.getBindingContext());
							if (key === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
							}
						}
					}
				}),

                new sap.m.Text({
					text: {
						path: "TXTSALES",
						formatter: function() {
							var desc = oTextModel.getProperty("TXTSALES", this.getBindingContext());
							return fcg.mdg.approvecrv2.util.Formatter.Truncate(desc);
						}
					}
				})
									

                ]
		});
			var extoItemTemp = this.oS3Controller.matHookgetSalesTextTemplate(otextTemp);
			if(extoItemTemp !== undefined){
				otextTemp = extoItemTemp;
		}
	
		return otextTemp;
	    		
	    

	},
	//******************************************************************************************************************
	createSalesDisTemplate: function(oDisModel) {//create distribution channel template
		var oItemTemp = new sap.m.ColumnListItem({
			type: "Navigation",
			cells: [
 new sap.m.Text({
					text: {
						path: 'VKORG',
						formatter: function() {
							var desc = oDisModel.getProperty("VKORG__TXT", this.getBindingContext());
							var key = oDisModel.getProperty("VKORG", this.getBindingContext());
							if (key === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
							}
						}
					}
				}),
 new sap.m.Text({
					text: {
						path: 'VTWEG',
						formatter: function() {
							var desc = oDisModel.getProperty("VTWEG__TXT", this.getBindingContext());
							var key = oDisModel.getProperty("VTWEG", this.getBindingContext());
							if (key === "") {
								return fcg.mdg.approvecrv2.util.Formatter.noValue(key);
							} else {
								return fcg.mdg.approvecrv2.util.Formatter.getKeyDesc(key, desc);
							}
						}
					}
				})
                ]
		});
			var extoItemTemp = this.oS3Controller.matHookgetSalesDistChainsTemplate(oItemTemp);
			if(extoItemTemp !== undefined){
				oItemTemp = extoItemTemp;
		}
		return oItemTemp;
	
	},
	//******************************************************************************************************************
	setGetSalesObjHeader: function(RowId) { //get SalesObjHeader for displaying Sales Org and Distribution Channel
	
		var vDIST = this.i18n.getText("SL_DIST_CHN");
		var vSOrg = this.i18n.getText("Sl_Org");
		var vDChannel = this.i18n.getText("Distribution");
		if(this.aSalesdata.results.length===1){
			RowId=0;
		}
		this.SalesOrg= vSOrg+": "+ this.aSalesdata.results[RowId].VKORG__TXT + " (" + this.aSalesdata.results[RowId].VKORG + ")";
		
		this.DChannel = vDChannel+": "+this.aSalesdata.results[RowId].VTWEG__TXT + " (" + this.aSalesdata.results[RowId].VTWEG + ")";
		this.SalesOrgHeaderTxt = vDIST+ ": " + this.aSalesdata.results[RowId].VKORG__TXT + " (" + this.aSalesdata.results[RowId].VKORG + ")/" + this.aSalesdata.results[
			RowId].VTWEG__TXT + " (" + this.aSalesdata.results[RowId].VTWEG + ")";
		return this.SalesOrgHeaderTxt;

	},
	//******************************************************************************************************************
	getSalesDataLen: function() { 	//get SalesDataLen
	
		return this.aSalesdata.results.length;

	},
	//******************************************************************************************************************
	hideSalesSection: function() { 	//hide sections for General Sales data 
	//controller hook
		if (sap.ui.getCore().byId("Txt_TRAGR").getVisible() === false &&
			sap.ui.getCore().byId("MatSalesShip") !== undefined
		)       {
			    sap.ui.getCore().byId("MatSalesShip").destroy();//Destroy Shipping Section
		        }

	this.oS3Controller=fcg.mdg.approvecrv2.DomainSpecParts.Material.Material.getS3Instance();
	if(!this.oS3Controller.matHookHideSalesPackagingSection()){
		if (sap.ui.getCore().byId("Txt_ERGEW").getVisible() === false &&
			sap.ui.getCore().byId("Txt_GEWTO").getVisible() === false &&
			sap.ui.getCore().byId("Txt_ERVOL").getVisible() === false &&
			sap.ui.getCore().byId("Txt_VOLTO").getVisible() === false &&
			sap.ui.getCore().byId("Txt_KZGVH").getVisible() === false &&
			sap.ui.getCore().byId("Txt_VHART").getVisible() === false &&
			sap.ui.getCore().byId("Txt_STFAK").getVisible() === false &&
			sap.ui.getCore().byId("MatSalesPackMtr") !== undefined
		)      {
			      sap.ui.getCore().byId("MatSalesPackMtr").destroy();//destroy Packaging Section
		       }
	}
		   if (sap.ui.getCore().byId("MatSalesShip") === undefined &&
			sap.ui.getCore().byId("MatSalesPackMtr") === undefined )
			{
				
			 if( sap.ui.getCore().byId("matSalesDataForm") !== undefined){
				  sap.ui.getCore().byId("matSalesDataForm").destroy();
			}
			}
		if ( sap.ui.getCore().byId("matSalesDataForm") === undefined &&
			sap.ui.getCore().byId("MatSalesDistChainTable") === undefined)
			{
			     var noSalesData = sap.ui.getCore().byId("matSalesCreateLayout");//Display "No data " if none of the sections are there
			    fcg.mdg.approvecrv2.DomainSpecParts.Material.MaterialCreate.setNoDataText(noSalesData,this.vNoDataTxt);
			}
		   //   else{
		   //   	 if( sap.ui.getCore().byId("matSalesDataForm") !== undefined && this.flag === 2){
				 // sap.ui.getCore().byId("matSalesDataForm").destroy();
				 //}
		      	
		      	
		      	
		   //   }
			
			
		
	},
	//******************************************************************************************************************

	hideSalesOrgDetailSection: function() {
	//controller hook
		if (sap.ui.getCore().byId("Txt_VRKME").getText() === "" &&
			sap.ui.getCore().byId("Txt_MEGSALES").getText() === "" &&
			sap.ui.getCore().byId("Txt_VMSTA").getText() === "" &&
			sap.ui.getCore().byId("Txt_WRKSALES").getText() === "" &&
			sap.ui.getCore().byId("Txt_SKTOF").getText() === "" &&
			sap.ui.getCore().byId("MatSalesGenData") !== undefined
		)    {
			   sap.ui.getCore().byId("MatSalesGenData").destroy();	//destroy Material General Data Section
		      }
		if (sap.ui.getCore().byId("Txt_AUMNG").getText() === "0.000" &&
			sap.ui.getCore().byId("Txt_LFMNG").getText() === "0.000" &&
			sap.ui.getCore().byId("Txt_EFMNG").getText() === "0.000" &&
			sap.ui.getCore().byId("Txt_SCMNG").getText() === "0.000 " &&
			sap.ui.getCore().byId("Txt_RDPSALES").getText() === "" &&
			sap.ui.getCore().byId("MatSalesQnty") !== undefined
		)    {
			sap.ui.getCore().byId("MatSalesQnty").destroy();//destroy Quantity Stipulations section
		    }
		if (sap.ui.getCore().byId("Txt_PRAT1").getText() === "" &&
			sap.ui.getCore().byId("Txt_PRAT1").getText() === "" &&
			sap.ui.getCore().byId("Txt_PRAT2").getText() === "" &&
			sap.ui.getCore().byId("Txt_PRAT3").getText() === "" &&
			sap.ui.getCore().byId("Txt_PRAT4").getText() === "" &&
			
			sap.ui.getCore().byId("Txt_PRAT5").getText() === "" &&
			sap.ui.getCore().byId("Txt_PRAT6").getText() === "" &&
			sap.ui.getCore().byId("Txt_PRAT7").getText() === "" &&
			sap.ui.getCore().byId("Txt_PRAT8").getText() === "" &&
			sap.ui.getCore().byId("Txt_PRAT9").getText() === "" &&
			sap.ui.getCore().byId("Txt_PRATA").getText() === "" &&
			sap.ui.getCore().byId("MatSalesProdAttr") !== undefined
		)   {
			sap.ui.getCore().byId("MatSalesProdAttr").destroy();//destroy product attrubute section
		    }
		if (sap.ui.getCore().byId("Txt_VAVME").getVisible() === false &&
			sap.ui.getCore().byId("matSalesSubSection") !== undefined
		)  {
			sap.ui.getCore().byId("matSalesSubSection").destroy();//destroy sales section
		   }
		   
		   
		   if (sap.ui.getCore().byId("MatSalesGenData") === undefined &&
			sap.ui.getCore().byId("MatSalesQnty") === undefined &&
			sap.ui.getCore().byId("MatSalesProdAttr") === undefined &&
		    sap.ui.getCore().byId("matSalesSubSection") === undefined)
			{
				 if( sap.ui.getCore().byId("matSalesMainSection") !== undefined){
				  sap.ui.getCore().byId("matSalesMainSection").destroy();
				 }
			}
			 if( sap.ui.getCore().byId("matSalesMainSection") === undefined){
			 	
			 	 if( sap.ui.getCore().byId("matSalesTableS4Form") !== undefined){
				  sap.ui.getCore().byId("matSalesTableS4Form").destroy();
				 }
			 	
			 }
			
			
		   
		if (sap.ui.getCore().byId("Txt_VERSG").getText() === "" &&
			sap.ui.getCore().byId("Txt_BONUS").getText() === "" &&
			sap.ui.getCore().byId("Txt_PROVG").getText() === "" &&
			sap.ui.getCore().byId("Txt_PMATN").getText() === "" &&
			sap.ui.getCore().byId("Txt_KONDM").getText() === "" &&
			sap.ui.getCore().byId("Txt_PRODH").getText() === "" &&
			sap.ui.getCore().byId("Txt_KTGRM").getText() === "" &&
			sap.ui.getCore().byId("Txt_MTPOS").getText() === "" &&
			sap.ui.getCore().byId("matSalesGrouping") !== undefined
		)   {
			sap.ui.getCore().byId("matSalesGrouping").destroy();//destroy sales section
		    }
		if (sap.ui.getCore().byId("Txt_MVGR1").getText() === "" &&
			sap.ui.getCore().byId("Txt_MVGR2").getText() === "" &&
			sap.ui.getCore().byId("Txt_MVGR3").getText() === "" &&
			sap.ui.getCore().byId("Txt_MVGR4").getText() === "" &&
			sap.ui.getCore().byId("Txt_MVGR5").getText() === "" &&
			sap.ui.getCore().byId("Mat") !== undefined
		) {
			sap.ui.getCore().byId("Mat").destroy();//destroy material section
		}
		
		if (sap.ui.getCore().byId("matSalesGrouping") === undefined &&
			sap.ui.getCore().byId("Mat") === undefined)
			{
				 if( sap.ui.getCore().byId("grp") !== undefined){
				  sap.ui.getCore().byId("grp").destroy();
				 }
			}
		
		if( sap.ui.getCore().byId("grp") === undefined){
				 if( sap.ui.getCore().byId("matSalesTableS4Form2") !== undefined){
				  sap.ui.getCore().byId("matSalesTableS4Form2").destroy();
				 }
			
				 }
				 
		  
		  
	


	},
	//******************************************************************************************************************
	setNoDataText: function(vId) {	//method to display no data maintained text
		var olist = new sap.m.List();
		olist.setNoDataText(sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText("NodataCreate"));
		vId.destroyContent();
		vId.addContent(olist);
	}
	//******************************************************************************************************************
	//******************************************************************************************************************
};