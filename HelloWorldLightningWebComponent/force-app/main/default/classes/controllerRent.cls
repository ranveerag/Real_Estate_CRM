public class controllerRent {
    @AuraEnabled(cacheable=true)
    public static List<Rent__c> getRentId(String optId) {
        return [SELECT Id FROM Rent__c WHERE Opportunity_Name__c = :optId];
    }
  
    @AuraEnabled
      public static void createRentRecord(Id opportunityId) {
          Rent__c newRent = new Rent__c(Opportunity_Name__c = opportunityId);
          insert newRent;
      }
  
      @AuraEnabled
      public static void createOpportunityLineItem(Id opportunityId, Integer quantity, Id productId, Boolean mergeFlag) {
          List<OpportunityLineItem> existingLineItems = [SELECT Id, Quantity FROM OpportunityLineItem WHERE OpportunityId = :opportunityId AND Product2Id = :productId LIMIT 1];
  
          if (existingLineItems.isEmpty()){
          PricebookEntry pricebookEntry = [SELECT Id, UnitPrice FROM PricebookEntry WHERE Product2Id = :productId AND Pricebook2.IsStandard = true LIMIT 1];
      
          OpportunityLineItem newLineItem = new OpportunityLineItem(
              OpportunityId = opportunityId,
              Quantity = quantity,
              Product2Id = productId,
              PricebookEntryId = pricebookEntry.Id,
              TotalPrice = quantity * pricebookEntry.UnitPrice,
              Merge__c = mergeFlag
          );
          insert newLineItem;
          }
         // System.debug(newLineItem);
      }
    @AuraEnabled(cacheable=true)
    public static String getDurationOfLease(String optId) {
        List<Opportunity> opportunities = [SELECT Lease_Duration_Purchase_Mode__c FROM Opportunity WHERE Id = :optId];
  
        if (!opportunities.isEmpty()) {
            return opportunities[0].Lease_Duration_Purchase_Mode__c;
        } else {
            return null; // Return a default value or handle the case when no records are found.
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<Rent__c> getRentList(String optId) {
        return [select Initial_Price__c, percent_increase__c, Sub_Value__c,Year__c,Rupees_Increase__c from Rent__c   WHERE Opportunity_Name__c = :optId order by Year__c];
    }
    
  }