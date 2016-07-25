/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
//Controller for the companyCode detail page. The respective CompanyCode detail page will be loaded when the user clicks on the CompanyCode in the detail page.

jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.model.type.DateTime");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.GLAccount");
jQuery.sap.require("fcg.mdg.approvecrv2.DomainSpecParts.GLAccountCreate");

sap.ca.scfld.md.controller.BaseDetailController
	.extend(
		"fcg.mdg.approvecrv2.view.GLAccCostElDetail", {
			compCode: "",
			oItemTemp: "",
			oCompCodeDetails: "",
			bindingContext: "",
			sPath: "",
			oS3Instance: "",
			extHooknavtoDetail: null,
			extHookModifyStyleClass: null,
			extHookWithhldTable: null,
			extHookDunningTable: null,
			extHookdisplayCompCodedata: null,
			changerequestId: "",
			oGlCostElDetails: "",
			extHookglHookgetCEDescTemplate: null,
			i18n: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle(),
		
			onInit: function() {
				// Setting the navigate back visible true for moving
				// back to S3 controller.
				this.getView().byId("glCostElPage").setShowNavButton(
					true);

				this.oRouter
					.attachRouteMatched(
						function(oEvent) {

							if (oEvent.getParameter("name") === "GLCostEl") {

								// This code will be executed
								// when the user navigates to
								// Detail's screen.
								// Initialize the gl comp code
								// fragment
								// variables
								var vCOAREA = oEvent
									.getParameter('arguments').GLAccCOA;
									
							    var oS3Instance = fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.getS3Instance();
                                var aDecisions = oS3Instance.getDecisions();
				                oS3Instance.createDecisionButtons(aDecisions, this, 'navFromDetail');
								if (vCOAREA !== "") {
									var oGLACostElResult = "";
									var oGLACostElresults = fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oCEData.ACCOUNT.ACCOUNT2CELEMRel;
									for (var i = 0; i < oGLACostElresults.results.length; i++) {
										if (oGLACostElresults.results[i].COAREA === vCOAREA || vCOAREA.indexOf(oGLACostElresults.results[i].COAREA) > -1){
											oGLACostElResult = oGLACostElresults.results[i];
								}

									}
								}
								if (oS3Instance.oGlAccountCelemForm === "") {
									oS3Instance.oGlAccountCelemForm = sap.ui
										.xmlfragment(
											'fcg.mdg.approvecrv2.frag.GLAccCostElDetails',
											fcg.mdg.approvecrv2.util.Formatter);
								} else {
									// If already defined,
									// remove it from detail
									// page and instantiate it
									// again
									this
										.getView()
										.byId(
											"glCostElPage")
										.removeContent(
											oS3Instance.oGlAccountCelemForm);
									if (oS3Instance.oGlAccountCelemForm !== undefined) {
										oS3Instance.oGlAccountCelemForm
											.destroy();
									}
									oS3Instance.oGlAccountCelemForm = sap.ui
										.xmlfragment(
											'fcg.mdg.approvecrv2.frag.GLAccCostElDetails',
											fcg.mdg.approvecrv2.util.Formatter);
								} 
								this
									.getView()
									.byId("glCostElPage")
									.addContent(
										oS3Instance.oGlAccountCelemForm);

							}
							if (oGLACostElResult !== undefined) {
							    
								this.displaydata(oGLACostElResult, oS3Instance);
								var vAction = fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oVAction;
			                	if (vAction === "CHANGE"){
			                	   /* for (var j = 0; j < oGLACostElResult.ChangeData.results.length; j++)
			                	      {
			                	          if(oGLACostElResult.ChangeData.results[j].EntityAction !== "C")*/			                	      
				              fcg.mdg.approvecrv2.DomainSpecParts.GLAccountChange.setBoldCEData(oGLACostElResult);
				//}
			                	}
							}
						}, this);
			},

			displaydata: function(result, oS3Instance) {
				this.setHeader(result);
				var oCEModel = new sap.ui.model.json.JSONModel();

				oCEModel.setData(result);
				sap.ui.getCore().byId("glCEDetails").setModel(oCEModel);

				var oCEAttach = result.CELEM2AtthCELEMRel;
				if (!oS3Instance.oApplicationFacade.isMock()){
					var classText;
					if(fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(result.CELEM2ACCOUNTRel.ACCOUNT) === fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(result.CELEM)){
						classText = this.i18n.getText("GL_TXT_CLAS");
					}
					else{
						classText = this.i18n.getText("GL_TXT_CLAS_SEC");
					}
					sap.ui.getCore().byId("TXT_DET_CLASSIFICATION").setText(classText);
				}
				
				if ( result.CELEM2DTxtCELEMRel.results.length > 0 ){
		         var oTable = sap.ui.getCore().byId("glCostElDescTab");
		         
                  this.setStyleForCELEMTable(result, oTable);
                 }
                
            else{
                	sap.ui.getCore().byId('glCostElTab').destroy();
                 }
	
				if(oCEAttach !== undefined){
				if (oCEAttach.results.length > 0) {
				var vattachFlag = false;
				var vdelFlag = false;
				var done = false;
				var aDone = {results:[]};
					   
				if(result.ChangeData !== undefined && fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oVAction === 'CHANGE'){
					for(var i = 0; i < result.ChangeData.results.length ; i++){
						if(result.ChangeData.results[i].EntityAction !== 'C')
							vattachFlag = true;
					   	break;
				   	}
				   	if(vattachFlag){
				   		for(var i = 0; i < oCEAttach.results.length; i++){
                            aDone.results[i] = false;
				   			if(oCEAttach.results[i].ChangeData.length !== 0 || oCEAttach.results[i].ChangeData !== undefined){
				   				for(var j = 0; j < oCEAttach.results[i].ChangeData.results.length; j++){
				   					vdelFlag = false;
				   					vattachFlag = false;
				   					if(oCEAttach.results[i].ChangeData.results[j].EntityAction === 'C')
				   					  vattachFlag = true;
				   					else if(oCEAttach.results[i].ChangeData.results[j].EntityAction === 'D')
				   					  vdelFlag = true;
				   					  
				   					 var result = oCEAttach.results[i];
				   					 this.getglCEAttachmentList_2(result,vattachFlag, vdelFlag); 
				   				     aDone.results[i] = true;
				   				     done = true;
				   				}
				   				if(!aDone.results[i]){
				   					var result = oCEAttach.results[i];
				   				   this.getglCEAttachmentList_2(result,false, false); 
				   				   done = true;
				   				}
				   			}
				   		}
				      }	
				   	}

			   	//}
				   
				   if(!done)
				     this.getglCEAttachmentList(oCEAttach, vattachFlag, vdelFlag);
				}
				else 
					sap.ui.getCore().byId('glCostElAttach').destroy();
				
					
				}
				else
                 sap.ui.getCore().byId('glCostElAttach').destroy();
		     	 
		     	 fcg.mdg.approvecrv2.DomainSpecParts.GLAccountCreate.hideCEsection();
				
					
				},

          // Build CELEM change table
	setStyleForCELEMTable:function(aResult, oTable){ 
			var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
            var vdelFlag = false;
			oModel.setData(aResult.CELEM2DTxtCELEMRel); 
			oTable.setVisible(true);
			oTable.setModel(oModel);
			for(var j = 0; j < aResult.CELEM2DTxtCELEMRel.results.length; j++){
                    if(fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oVAction === 'CHANGE' && aResult.CELEM2DTxtCELEMRel.results[j].ChangeData !== undefined){
                    	for(var k = 0; k < aResult.CELEM2DTxtCELEMRel.results[j].ChangeData.results.length; k++ ){
                    		if(aResult.CELEM2DTxtCELEMRel.results[j].ChangeData.results[k].EntityAction === 'D'){
                                  					vdelFlag = true;
                                  				}
                                  				break;
                                  			}
                                  			break;
                                  		}
                                  	}       
			var oItemCELEMTemp = this.getCEDescTemplate(oModel, aResult, vdelFlag);
			oTable.bindItems("/results", oItemCELEMTemp);
	},
	
getCEDescTemplate: function(oModel, aResult, vdelFlag){
		var oItemDescTemp = new sap.m.ColumnListItem({
			//type:"Navigation",
			cells: [	      
			        new sap.m.Text({
			        	text:{
			        		path:"LANGU__TXT",
			        		formatter: function() {
			        			var desc = oModel.getProperty("LANGU__TXT", this.getBindingContext());
			        			var done = false;
			     
			                if(fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oVAction == 'CHANGE'){
                                if(vdelFlag)
                                  {
                                  	fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "LANGU" );
                                    done = true;
                                  }
                                 else { 
                                 if(aResult.ChangeData !== undefined && aResult.ChangeData.results.length !==0){
                                for(var i = 0; i < aResult.ChangeData.results.length; i++)
                                {
                                  
                                  if(aResult.ChangeData.results[i].EntityAction !== "C"){
                                   	fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "LANGU" );
                                    done = true;
                                }
                                break;
                                } 
                                }    
                                

                                 }
                                 if(!done){
                                 	if(aResult.CELEM2DTxtCELEMRel !== undefined && aResult.CELEM2DTxtCELEMRel.results.length !== 0){
                                 		for(var j = 0; j < aResult.CELEM2DTxtCELEMRel.results.length; j++){
                                 			if(aResult.CELEM2DTxtCELEMRel.results[j].ChangeData !== undefined && aResult.CELEM2DTxtCELEMRel.results[j].ChangeData.results.length !== 0){
                                 				for(var k = 0 ; k < aResult.CELEM2DTxtCELEMRel.results[j].ChangeData.results.length; k++){
                                 					if(aResult.CELEM2DTxtCELEMRel.results[j].ChangeData.results[k].EntityAction === 'D'){
                                 					 fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "LANGU" );	
                                 					}
                                 				}
                                 			}
                                 		}
                                 	}
                                 }
                                         
                                }
                                

			        			return fcg.mdg.approvecrv2.util.Formatter.noValue(desc);
			        		}			        		
			        	}
			        }),
			        new sap.m.Text({
			        	text:{
			        		path:"TXTSH",
			        		formatter: function() {
			        		var done = false;
			     
			                if(fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oVAction == 'CHANGE'){
                                if(vdelFlag)
                                  {
                                  	fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "TXTSH" );
                                    done = true;
                                  }
                                 else { 
                                 if(aResult.ChangeData !== undefined && aResult.ChangeData.results.length !==0){
                                for(var i = 0; i < aResult.ChangeData.results.length; i++)
                                {
                                  
                                  if(aResult.ChangeData.results[i].EntityAction !== "C"){
                                   	fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "TXTSH" );
                                    done = true;
                                }
                                break;
                                } 
                                }    
                                

                                 }
                                 if(!done){
                                 	if(aResult.CELEM2DTxtCELEMRel !== undefined && aResult.CELEM2DTxtCELEMRel.results.length !== 0){
                                 		for(var j = 0; j < aResult.CELEM2DTxtCELEMRel.results.length; j++){
                                 			if(aResult.CELEM2DTxtCELEMRel.results[j].ChangeData !== undefined && aResult.CELEM2DTxtCELEMRel.results[j].ChangeData.results.length !== 0){
                                 				for(var k = 0 ; k < aResult.CELEM2DTxtCELEMRel.results[j].ChangeData.results.length; k++){
                                 					if(aResult.CELEM2DTxtCELEMRel.results[j].ChangeData.results[k].EntityAction === 'D'){
                                 					 fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "TXTSH" );	
                                 					}
                                 				}
                                 			}
                                 		}
                                 	}
                                 }
                                         
                                }
                                

			        			return fcg.mdg.approvecrv2.util.Formatter.noValue(oModel.getProperty('TXTSH', this.getBindingContext()));
			        		}			        		
			        	}
			        }),
			        new sap.m.Text({
			        	text:{
			        		path:"TXTMI",
			        		formatter: function(){
			        		var done = false;
			     
			                if(fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oVAction == 'CHANGE'){
                                if(vdelFlag)
                                  {
                                  	fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "TXTMI" );
                                    done = true;
                                  }
                                 else { 
                                 if(aResult.ChangeData !== undefined && aResult.ChangeData.results.length !==0){
                                for(var i = 0; i < aResult.ChangeData.results.length; i++)
                                {
                                  
                                  if(aResult.ChangeData.results[i].EntityAction !== "C"){
                                   	fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "TXTMI" );
                                    done = true;
                                }
                                break;
                                } 
                                }    
                                

                                 }
                                 if(!done){
                                 	if(aResult.CELEM2DTxtCELEMRel !== undefined && aResult.CELEM2DTxtCELEMRel.results.length !== 0){
                                 		for(var j = 0; j < aResult.CELEM2DTxtCELEMRel.results.length; j++){
                                 			if(aResult.CELEM2DTxtCELEMRel.results[j].ChangeData !== undefined && aResult.CELEM2DTxtCELEMRel.results[j].ChangeData.results.length !== 0){
                                 				for(var k = 0 ; k < aResult.CELEM2DTxtCELEMRel.results[j].ChangeData.results.length; k++){
                                 					if(aResult.CELEM2DTxtCELEMRel.results[j].ChangeData.results[k].EntityAction === 'D'){
                                 					 fcg.mdg.approvecrv2.util.Formatter.handleCellBolding(this, oModel, "TXTMI" );	
                                 					}
                                 				}
                                 			}
                                 		}
                                 	}
                                 }
                                         
                                }
                                

			        			return fcg.mdg.approvecrv2.util.Formatter.noValue(oModel.getProperty('TXTMI', this.getBindingContext()));
			        		}			        		
			        	}
			        })
			    ]
		});  
		
		/**
		 * @ControllerHook To modify the data of the form if it is not done via direct binding
		 * Customer can modify the data as per his requirements before binding it to a form
		 * @callback fcg.mdg.approvecrv2.view.GLAccCostElDetails~extHookglHookgetCEDescTemplate
		 * @param {object} result Holds data
		 * @return {object} result Modified Data
		 */
		if (this.extHookglHookgetCEDescTemplate) {
			var extModifiedData = this.extHookglHookgetCEDescTemplate(oItemDescTemp);
			oItemDescTemp = extModifiedData;
		}
	return oItemDescTemp;		
	},


			setHeader: function(result) {

				var ceHeader =result.CELEM__TXT + "(" + result.COAREA + 
					"/" + fcg.mdg.approvecrv2.util.Formatter.removeLeadingZeros(result.CELEM) + ")";

				var glCEHeader = this.getView().byId("glCEObjHeaderDet");
				glCEHeader.setTitle(ceHeader);

				var glCCAttribute = fcg.mdg.approvecrv2.util.DataAccess.getObjectKey();
				this.getView().byId("glCE").setText(glCCAttribute);

				var oEditionData = fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oCEData.Edition;
				var glvalidity = fcg.mdg.approvecrv2.util.Formatter.validityFormatter(oEditionData.UsmdVdateFrom, oEditionData.UsmdVdateTo);

				this.getView().byId("glVal").setText(glvalidity);
			},


			getglCEAttachmentList: function(aResult, vattachFlag, vdelFlag) {

				var oglCEAttachList = sap.ui.getCore().byId("glCostElAttach");
				var oCustomListItem = new sap.m.CustomListItem({});
				var oContributor;
            	var vLinkemphasized;
				for (var i = 0; i < aResult.results.length; i++) {
					var vLink = "";
					if (aResult.results[i].USMD_LINK !== "") {
						vLink = aResult.results[i].USMD_LINK;
					} else
						vLink = aResult.results[i].__metadata.media_src;

					var vForamtdate = fcg.mdg.approvecrv2.util.Formatter.dateFormatter(aResult.results[i].USMD_ACREATED_AT) + " " + this.i18n.getText(
						'AttachBy') + " ";

					//directly fetching the name from the general data

				var vContributor = " " + aResult.results[i].USMD_ACREATED_BY__TXT + "(" + aResult.results[i].USMD_ACREATED_BY + ")";

				if(fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oVAction === 'CHANGE' && aResult.results[i].ChangeData.results.length !== 0 && vattachFlag )				
			{   
			
			    		oContributor = new sap.m.Text({text:vForamtdate + " " + vContributor }).addStyleClass("text_bold");//concatenate the date created at and the contributor name and set it to bold
			    	    vLinkemphasized = true;//Emphasize the link if attachment has been changed
			}
			
			else {
				 oContributor = new sap.m.Text({text:vForamtdate + " " + vContributor });
				 vLinkemphasized = false;	
			}
               
        			

					var oAttach = new sap.m.Link({
						text: aResult.results[i].USMD_TITLE,
						target: "_blank",
						href: vLink,
						wrapping: true,
						subtle: false,
						emphasized: vLinkemphasized
					}).addStyleClass("padding_bottom");
					
					if(fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oVAction === 'CHANGE' && aResult.results[i].ChangeData !== undefined && aResult.results[i].ChangeData.results.length !== 0){
				for(var j = 0; j < aResult.results[i].ChangeData.results.length; j++){
					if(aResult.results[i].ChangeData.results[j].EntityAction === 'D'){
						oContributor.addStyleClass('sapThemeText').addStyleClass('text_bold');
						oAttach.setHref("");
						oAttach.addStyleClass('sapThemeText').addStyleClass('text_bold');
					}

				}
			}
			

					var vl = new sap.m.VBox({
						items: [oAttach, oContributor]
					}).addStyleClass("padding_left");

					var oIcon = fcg.mdg.approvecrv2.util.Formatter.mimeTypeFormatter(aResult.results[i].USMD_FILE_TYPE);
					oIcon = new sap.ui.core.Icon({
						src: oIcon,
						size: "3.0em"
					});

					var h1 = new sap.m.HBox({
						items: [oIcon, vl]
					}).addStyleClass("Hbox_padding");

					oCustomListItem.addContent(h1);
					oglCEAttachList.addItem(oCustomListItem);
				}

				if (oglCEAttachList.getItems().length === 0) {
					sap.ui.getCore().byId("glCostElAttach").destroy();
				}

			},
			
			getglCEAttachmentList_2: function(aResult, vattachFlag, vdelFlag) {

				var oglCEAttachList = sap.ui.getCore().byId("glCostElAttach");
				var oCustomListItem = new sap.m.CustomListItem({});
				var oContributor;
            	var vLinkemphasized;
				//for (var i = 0; i < aResult.results.length; i++) {
					var vLink = "";
					if (aResult.USMD_LINK !== "") {
						vLink = aResult.USMD_LINK;
					} else
						vLink = aResult.__metadata.media_src;

					var vForamtdate = fcg.mdg.approvecrv2.util.Formatter.dateFormatter(aResult.USMD_ACREATED_AT) + " " + this.i18n.getText(
						'AttachBy') + " ";

					//directly fetching the name from the general data

				var vContributor = " " + aResult.USMD_ACREATED_BY__TXT + "(" + aResult.USMD_ACREATED_BY + ")";

		
				if(vdelFlag)// && fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oVAction === 'CHANGE' && aResult.ChangeData.results.length !== 0 )				
			{
				 oContributor = new sap.m.Text({text:vForamtdate + " " + vContributor }).addStyleClass("sapThemeText");//concatenate the date created at and the contributor name and set it to bold
				 vLinkemphasized = true;//Emphasize the link if attachment has been changed
			}
			else if( vattachFlag)// && fcg.mdg.approvecrv2.DomainSpecParts.GLAccount.oVAction === 'CHANGE' && aResult.results[i].ChangeData.results.length !== 0  )				
			{   
			
			    		oContributor = new sap.m.Text({text:vForamtdate + " " + vContributor }).addStyleClass("text_bold");//concatenate the date created at and the contributor name and set it to bold
			    	    vLinkemphasized = true;//Emphasize the link if attachment has been changed
			    		
			  
			}
		
			else {
				 oContributor = new sap.m.Text({text:vForamtdate + " " + vContributor });
				 vLinkemphasized = false;	
			}
   
         
        			

					var oAttach = new sap.m.Link({
						text: aResult.USMD_TITLE,
						target: "_blank",
						href: vLink,
						wrapping: true,
						subtle: false,
						emphasized: vLinkemphasized
					}).addStyleClass("padding_bottom");
					
					if(vdelFlag){
			           oAttach.setHref("");
			           oAttach.addStyleClass("sapThemeText");
					}
					var vl = new sap.m.VBox({
						items: [oAttach, oContributor]
					}).addStyleClass("padding_left");

					var oIcon = fcg.mdg.approvecrv2.util.Formatter.mimeTypeFormatter(aResult.USMD_FILE_TYPE);
					oIcon = new sap.ui.core.Icon({
						src: oIcon,
						size: "3.0em"
					});

					var h1 = new sap.m.HBox({
						items: [oIcon, vl]
					}).addStyleClass("Hbox_padding");

					oCustomListItem.addContent(h1);
					oglCEAttachList.addItem(oCustomListItem);
				//}

				if (oglCEAttachList.getItems().length === 0) {
					sap.ui.getCore().byId("glCostElAttach").destroy();
				}

			}

		});