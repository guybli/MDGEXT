/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
//Here all the BP related queries are included which are used to fetch the created and Changed data.
jQuery.sap.declare("fcg.mdg.approvecrv2.util.BPQuery");

fcg.mdg.approvecrv2.util.BPQuery = {		
		getBPQuery: function(vCompletePath,vCommaSeperator,vBasePath,vChangeData,vOTC){	
			//	oOtc: "",
			this.oOtc=vOTC;
			var vChangeRequest = "";
			try{
				vChangeRequest= vCompletePath.split("('")[1].split("')");
			}catch(err){}

			if(vChangeData === "")
			{		
				//BP_Root 
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_Root' ) === true ){
					vCompletePath = vCompletePath + vBasePath;
				}

				//BP_OrganizationRel
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_Organization' ) === true ){
					vCompletePath = vCompletePath + 'BP_OrganizationRel';
				}

				//BP_PersonRel
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_Person' ) === true ){
					vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_PersonRel';
				}

				//BP_GroupRel
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_Group' ) === true ){
					vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_GroupRel';
				}

				//BP_AddressesRel
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_Address' ) === true ){
					vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_AddressesRel';
				}

				//BP_AddressUsagesRel
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_AddressUsage' ) === true ){
					vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_AddressUsagesRel';
				}

				//Role details
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_Role' ) === true ){
					vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_RolesRel';
				}

				//bank details
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_BankAccount' ) === true ){
					vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_BankAccountsRel';
				}

				//Identification
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_IdentificationNumber' ) === true ){
					vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_IdentificationNumbersRel';
				}

				//Tax Details
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_TaxNumber' ) === true ){
					vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_TaxNumbersRel';
				}

				//Industries
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_Industry' ) === true ){
					vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_IndustryRel';
				}
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_MultipleAssignment' ) === true ){
					if(this.oOtc=== "159" ){
						//ERP Customer							
						vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'CU_MultipleAssignmentsRel';
						vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'CU_MultipleAssignmentsRel/CU_AssignedCustomerRel';
					}
					if(this.oOtc=== "266" ){

						//ERP Supplier
						vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'SP_MultipleAssignmentsRel';
						vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'SP_MultipleAssignmentsRel/SP_AssignedSupplierRel';
						vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'SP_MultipleAssignmentsRel/SP_AssignedSubrangesRel';
					}
				}
			}

			else if (vChangeData !== "" || vChangeData!== null || vChangeData !== undefined)
			{
				//BP_Root
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_Root' ) === true ){
					vCompletePath = vCompletePath + vBasePath + 'ChangeData';
				}

				//BP_OrganizationRel
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_Organization' ) === true ){
					vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'BP_OrganizationRel' + vChangeData;
				}

				//BP_PersonRel
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_Person' ) === true ){
					vCompletePath = vCompletePath + vCommaSeperator + vBasePath  + 'BP_PersonRel' + vChangeData;
				}

				//BP_GroupRel
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_Group' ) === true ){
					vCompletePath = vCompletePath + vCommaSeperator + vBasePath  + 'BP_GroupRel' + vChangeData;
				}

				//BP_AddressesRel 
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_Address' ) === true ){
					vCompletePath = vCompletePath + vCommaSeperator + vBasePath  + 'BP_AddressesRel' + vChangeData;
				}

				//BP_AddressUsagesRel
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_AddressUsage' ) === true ){
					vCompletePath = vCompletePath + vCommaSeperator + vBasePath  + 'BP_AddressUsagesRel' + vChangeData;
				}

				//Role details
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_Role' ) === true ){
					vCompletePath = vCompletePath + vCommaSeperator + vBasePath  + 'BP_RolesRel' + vChangeData;//4
				}

				//bank details
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_BankAccount' ) === true ){
					vCompletePath = vCompletePath + vCommaSeperator + vBasePath  + 'BP_BankAccountsRel' + vChangeData;//5
				}

				//Identification
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_IdentificationNumber' ) === true ){
					vCompletePath = vCompletePath + vCommaSeperator + vBasePath  + 'BP_IdentificationNumbersRel'+ vChangeData;//6 
				}

				//Tax Details
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_TaxNumber' ) === true ){
					vCompletePath = vCompletePath + vCommaSeperator + vBasePath  + 'BP_TaxNumbersRel' + vChangeData;//7
				}

				//Industries
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_Industry' ) === true ){
					vCompletePath = vCompletePath + vCommaSeperator + vBasePath  + 'BP_IndustryRel' + vChangeData;//8
				}								
				
				//ERP customer
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_MultipleAssignment' ) === true ){
					if(this.oOtc=== "159" ){
						vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'CU_MultipleAssignmentsRel' + vChangeData;
						vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'CU_MultipleAssignmentsRel/CU_AssignedCustomerRel' + vChangeData;
					}
					//ERP supplier
					if(this.oOtc=== "266" ){
						vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'SP_MultipleAssignmentsRel'+ vChangeData;
						vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'SP_MultipleAssignmentsRel/SP_AssignedSupplierRel' + vChangeData;
						vCompletePath = vCompletePath + vCommaSeperator + vBasePath + 'SP_MultipleAssignmentsRel/SP_AssignedSubrangesRel' + vChangeData;

					}
				}
			}
			return  vCompletePath;
		},
		
		getBPRelationshipQuery : function(vCompletePath, vCommaSeperator, vBasePath, vChangeData, s3Controller)
		{
			var vChangeRequest = "";
			try{
				vChangeRequest= vCompletePath.split("('")[1].split("')");
			}catch(err){}

			if(vChangeData === "")
			{	
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_Relation' ) === true ){
					//Relationships
					vCompletePath = vCompletePath + vBasePath + 'BP_RelationsRel';
					vCompletePath = vCompletePath+vCommaSeperator+vBasePath + 'BP_RelationsRel/BP_RelationContactPersonRel';
					vCompletePath = vCompletePath+vCommaSeperator+vBasePath + 'BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel';

					vCompletePath = vCompletePath+vCommaSeperator+vBasePath + 'BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommStandardEMailR';
					vCompletePath = vCompletePath+vCommaSeperator+vBasePath + 'BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommStandardPhoneR';
					vCompletePath = vCompletePath+vCommaSeperator+vBasePath + 'BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommStandardMobile';
					vCompletePath = vCompletePath+vCommaSeperator+vBasePath + 'BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommStandardFaxRel';
					vCompletePath = vCompletePath+vCommaSeperator+vBasePath + 'BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommStandardURIRel';

					vCompletePath = vCompletePath+vCommaSeperator+vBasePath + 'BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommEMailsRel';
					vCompletePath = vCompletePath+vCommaSeperator+vBasePath + 'BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommPhonesRel';
					vCompletePath = vCompletePath+vCommaSeperator+vBasePath + 'BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommMobilesRel';
					vCompletePath = vCompletePath+vCommaSeperator+vBasePath + 'BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommFaxesRel';
					vCompletePath = vCompletePath+vCommaSeperator+vBasePath + 'BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommURIsRel';
				}
			}

			else if (vChangeData !== "" || vChangeData!== null || vChangeData !== undefined)
			{
				//Relation
				if( fcg.mdg.approvecrv2.util.DataAccess.isEntityRelevant( vChangeRequest, 'BP_Relation' ) === true ){
					vCompletePath = vCompletePath + vBasePath  + 'BP_RelationsRel' + vChangeData;
					vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel';
					vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/ChangeData';
					vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel';
					vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/ChangeData';
					vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommStandardEMailR';
					vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommStandardPhoneR';
					vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommStandardMobile';
					vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommStandardFaxRel';
					vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommStandardURIRel';

					vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommStandardEMailR/ChangeData';
					vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommStandardPhoneR/ChangeData';
					if (!s3Controller.oApplicationFacade.isMock())
					{
						vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommStandardMobile/ChangeData';
						vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommStandardFaxRel/ChangeData';
						vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommStandardURIRel/ChangeData';
					}

					vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommEMailsRel';
					vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommFaxesRel';
					vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommMobilesRel';
					vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommPhonesRel';
					vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommURIsRel';

					vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommEMailsRel/ChangeData';
					vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommFaxesRel/ChangeData';
					vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommMobilesRel/ChangeData';
					vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommPhonesRel/ChangeData';
					vCompletePath = vCompletePath + vCommaSeperator + 'BP_Root/BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommURIsRel/ChangeData';

				}
			}
			return  vCompletePath;
		}


};