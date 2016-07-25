/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("fcg.mdg.approvecrv2.DomainSpecParts.CustomerDelete");

fcg.mdg.approvecrv2.DomainSpecParts.CustomerDelete = {
		oS3Controller:'',
		displayObsoleteData: function(result, s3Controller, vTableId){
			// Begin of General Section Obsolete Data
			sap.ui.getCore().byId(vTableId).removeAllContent();
			s3Controller.oObsoleteDataTable = "";
			if(result.results !== undefined && result.results.length !== 0)
			{      
					this.oS3Controller = s3Controller;
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(result);

					s3Controller.oObsoleteDataTable = sap.ui.xmlfragment('fcg.mdg.approvecrv2.frag.ObsoleteDataTable',s3Controller);
					sap.ui.getCore().byId(vTableId).setVisible(true);
					sap.ui.getCore().byId(vTableId).addContent(s3Controller.oObsoleteDataTable);
					s3Controller.oObsoleteDataTable.setGrowing(true);	
					s3Controller.oObsoleteDataTable.setModel(oModel);    
					var oObsDataItemTemp = this.getObsoleteTableTemplate(oModel);	
					s3Controller.custHookDeleteData(oObsDataItemTemp,this,result);
				
					var oSorterContx = new sap.ui.model.Sorter("Entity", false, true);
					var aSorter = [];
					aSorter.push(oSorterContx);
					s3Controller.oObsoleteDataTable.bindItems('/results', oObsDataItemTemp, aSorter, '');
			}else{
				this.validateText(vTableId);
			}
			
		},

		getObsoleteTableTemplate: function(){
			var oItemTemp = new sap.m.ColumnListItem({
				cells: [
				        new sap.ui.layout.VerticalLayout({
				        	content:[
				        	         new sap.m.ObjectIdentifier({
				        	        	 text: {
				        	        		 path: "ParentEntity"          
				        	        	 },
				        	        	 title: {
				        	        		 path: "ParentEntityDescription"          
				        	        	 }
				        	         }), 
				        	         new sap.m.ObjectIdentifier({
				        	        	 text: {
				        	        		 path: "ParentOfParentEntity"          
				        	        	 },

				        	        	 title: {
				        	        		 path: "ParentOfParentEntityDescription"          
				        	        	 }
				        	         })				        	         
				        	         ]
				        }),
				        new sap.m.Text({
				        	text:{
				        		path:"EntityDesciption"
				        	}
				        })                        
				        ]});
			
			var extoItemTemp = this.oS3Controller.custHookgetObsoleteTableTemplate(oItemTemp);
			if(extoItemTemp !== undefined){
				oItemTemp = extoItemTemp;
			}
			return oItemTemp;
		},

		validateText : function(layoutId) {
			
			if(layoutId === "panel"){
				if (this.obsText)
					this.obsText.destroy();
				this.obsText = new sap.m.Text("obsTxt");
				this.showNoDataObsoleteMsg(layoutId, this.obsText);
			} else if(layoutId === "panelCC"){
				if (this.obsCCText)
					this.obsCCText.destroy();
				this.obsCCText = new sap.m.Text("obsCCTxt");
				this.showNoDataObsoleteMsg(layoutId, this.obsCCText);
			} else if(layoutId === "paneSales"){
				if (this.obsSalText)
					this.obsSalText.destroy();
				this.obsSalText = new sap.m.Text("obsSalText");
				this.showNoDataObsoleteMsg(layoutId, this.obsSalText);
			} else if(layoutId === "suppPanel"){
				if (this.obsSuppText)
					this.obsSuppText.destroy();
				this.obsSuppText = new sap.m.Text("obsSuppText");
				this.showNoDataObsoleteMsg(layoutId, this.obsSuppText);
			} else if(layoutId === "suppPanelCC"){
				if (this.obsSuppCCText)
					this.obsSuppCCText.destroy();
				this.obsSuppCCText = new sap.m.Text("obsSuppCCText");
				this.showNoDataObsoleteMsg(layoutId, this.obsSuppCCText);
			} else if(layoutId === "suppPanelPurchase"){
				if (this.obsPurchText)
					this.obsPurchText.destroy();
				this.obsPurchText = new sap.m.Text("obsPurchText");
				this.showNoDataObsoleteMsg(layoutId, this.obsPurchText);
			}
		},
		
		showNoDataObsoleteMsg : function(layoutId, txtVal) {
			txtVal.setText(sap.ca.scfld.md.app.Application.getImpl()
					.getResourceBundle().getText("NoDeleteDdata"));
			sap.ui.getCore().byId(layoutId).removeAllContent();
			sap.ui.getCore().byId(layoutId).setVisible(true);
			sap.ui.getCore().byId(layoutId).addContent(txtVal);
		}
};